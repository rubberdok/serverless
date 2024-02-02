import assert, { fail } from "assert";
import { faker } from "@faker-js/faker";
import type { EventSlot } from "@prisma/client";
import { mock, mockDeep } from "jest-mock-extended";
import { merge } from "lodash-es";
import { DateTime } from "luxon";
import {
	InternalServerError,
	InvalidArgumentError,
	PermissionDeniedError,
} from "~/domain/errors.js";
import {
	type EventSignUpDetails,
	type EventType,
	type EventTypeFromDSO,
	EventTypes,
} from "~/domain/events.js";
import { Role } from "~/domain/organizations.js";
import type { User } from "~/domain/users.js";
import type { Result } from "~/lib/result.js";
import { makeMockContext } from "~/services/context.js";
import {
	type CreateEventParams,
	type EventRepository,
	EventService,
	type PermissionService,
	type ProductService,
	type UserService,
} from "../../service.js";
import type { SignUpQueueType } from "../../worker.js";

function setup() {
	const permissionService = mockDeep<PermissionService>();
	const eventsRepository = mockDeep<EventRepository>();
	const userService = mockDeep<UserService>();
	const productService = mockDeep<ProductService>();
	const service = new EventService(
		eventsRepository,
		permissionService,
		userService,
		productService,
		mockDeep<SignUpQueueType>(),
	);
	return {
		permissionService,
		eventsRepository,
		service,
		userService,
		productService,
	};
}

function mockSignUpDetails(
	data: Partial<EventSignUpDetails> = {},
): EventSignUpDetails {
	return {
		signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
		signUpsEndAt: DateTime.now().plus({ days: 1, hours: 2 }).toJSDate(),
		capacity: 10,
		remainingCapacity: 10,
		...data,
	};
}

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

function makeEventParams(
	params: DeepPartial<CreateEventParams>,
): CreateEventParams {
	const { type, data } = params ?? {};
	const baseData = {
		name: faker.commerce.productName(),
		description: faker.lorem.paragraph(),
		startAt: DateTime.now().plus({ days: 1 }).toJSDate(),
		endAt: DateTime.now().plus({ days: 1, hours: 2 }).toJSDate(),
		location: faker.location.streetAddress(),
		contactEmail: faker.internet.email(),
		organizationId: faker.string.uuid(),
		signUpsEnabled: false,
	} as const;

	switch (type) {
		case EventTypes.TICKETS: {
			return {
				type: EventTypes.TICKETS,
				data: merge(
					baseData,
					{
						signUpsEnabled: true,
						price: {
							value: 100,
							merchantId: faker.string.uuid(),
						},
						signUpDetails: {
							capacity: 0,
							signUpsEndAt: DateTime.now().plus({ days: 2 }).toJSDate(),
							signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
							slots: [{ capacity: 1 }],
						},
					},
					data,
				),
			};
		}
		case EventTypes.SIGN_UPS: {
			return {
				type: EventTypes.SIGN_UPS,
				data: merge(
					baseData,
					{
						signUpsEnabled: true,
						signUpDetails: {
							capacity: 0,
							signUpsEndAt: DateTime.now().plus({ days: 2 }).toJSDate(),
							signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
							slots: [{ capacity: 1 }],
						},
					},
					data,
				),
			};
		}
		default: {
			return {
				type: EventTypes.BASIC,
				data: merge(baseData, data),
			};
		}
	}
}

function makeEvent(data?: Partial<EventTypeFromDSO>): EventTypeFromDSO {
	return merge<EventTypeFromDSO, Partial<EventTypeFromDSO> | undefined>(
		{
			name: faker.commerce.productName(),
			description: faker.lorem.paragraph(),
			startAt: DateTime.now().plus({ days: 1 }).toJSDate(),
			endAt: DateTime.now().plus({ days: 1, hours: 2 }).toJSDate(),
			location: faker.location.streetAddress(),
			contactEmail: faker.internet.email(),
			organizationId: faker.string.uuid(),
			signUpsEnabled: false,
			signUpDetails: {
				capacity: 1,
				signUpsEndAt: DateTime.now().plus({ days: 2 }).toJSDate(),
				signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
				remainingCapacity: 1,
			},
			id: faker.string.uuid(),
			productId: faker.string.uuid(),
			type: "TICKETS",
			version: 0,
			categories: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
		},
		data,
	);
}

function makeEventWithSlots(
	data?: Partial<EventTypeFromDSO>,
): EventTypeFromDSO & { slots: EventSlot[] } {
	const event = makeEvent(data);
	return {
		...event,
		slots: [
			mock<EventSlot>({
				id: faker.string.uuid(),
				capacity: 1,
				eventId: event.id,
				remainingCapacity: 1,
			}),
		],
	};
}

function makeReturnType(
	result:
		| { data: EventTypeFromDSO }
		| { error: InvalidArgumentError | InternalServerError },
): Result<
	{ event: EventTypeFromDSO },
	InvalidArgumentError | InternalServerError
> {
	if ("data" in result) {
		return {
			ok: true,
			data: {
				event: result.data,
			},
		};
	}
	return {
		ok: false,
		error: result.error,
	};
}

function makeUser(user?: Partial<User>): User {
	return mock<User>(user ?? { id: faker.string.uuid() });
}

describe("EventsService", () => {
	describe("#create", () => {
		describe("should return", () => {
			interface TestCase {
				name: string;
				act: {
					createEventParams: CreateEventParams;
					user: User | null;
					role?: Role | null;
					repository?: Result<
						{ event: EventTypeFromDSO },
						InvalidArgumentError | InternalServerError
					>;
				};
				assertion: {
					return: Result<
						{ event: EventType },
						InternalServerError | InvalidArgumentError | PermissionDeniedError
					>;
				};
			}

			const testCases: TestCase[] = [
				{
					name: "if name is empty",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({ data: { name: "" } }),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if startAt is in the past",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							data: { startAt: DateTime.now().minus({ days: 1 }).toJSDate() },
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if endAt is in the past and earlier than startAt",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							data: {
								startAt: DateTime.now().plus({ days: 1 }).toJSDate(),
								endAt: DateTime.now().minus({ days: 2 }).toJSDate(),
							},
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if endAt is in the future and earlier than startAt",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							data: {
								startAt: DateTime.now().plus({ days: 2 }).toJSDate(),
								endAt: DateTime.now().plus({ days: 1 }).toJSDate(),
							},
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if the description is too long",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							data: { description: faker.string.sample(10_001) },
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if the name is too long",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							data: { name: faker.string.sample(201) },
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if signUpDetails have negative capacity",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							type: EventTypes.SIGN_UPS,
							data: {
								signUpsEnabled: true,
								signUpDetails: {
									capacity: -1,
									slots: [{ capacity: 1 }],
									signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
									signUpsEndAt: DateTime.now()
										.plus({ days: 1, hours: 2 })
										.toJSDate(),
								},
							},
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if signUpDetails have a slot with negative capacity",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							type: EventTypes.SIGN_UPS,
							data: {
								signUpsEnabled: true,
								signUpDetails: {
									capacity: 1,
									slots: [{ capacity: -1 }],
									signUpsStartAt: DateTime.now().plus({ days: 1 }).toJSDate(),
									signUpsEndAt: DateTime.now()
										.plus({ days: 1, hours: 2 })
										.toJSDate(),
								},
							},
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if signUpsEndAt is earlier than signUpsStartAt",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({
							type: EventTypes.SIGN_UPS,
							data: {
								signUpsEnabled: true,
								signUpDetails: {
									capacity: 1,
									slots: [{ capacity: 1 }],
									signUpsStartAt: DateTime.now()
										.plus({ days: 1, hours: 2 })
										.toJSDate(),
									signUpsEndAt: DateTime.now().plus({ days: 1 }).toJSDate(),
								},
							},
						}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: InvalidArgumentError.name,
							}),
						}),
					},
				},
				{
					name: "if the user does not have a role in the organization",
					act: {
						user: makeUser(),
						role: null,
						createEventParams: makeEventParams({}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: PermissionDeniedError.name,
							}),
						}),
					},
				},
				{
					name: "if the user is not logged in",
					act: {
						user: makeUser(),
						role: null,
						createEventParams: makeEventParams({}),
					},
					assertion: {
						return: makeReturnType({
							error: expect.objectContaining({
								name: PermissionDeniedError.name,
							}),
						}),
					},
				},
				{
					name: "and an event is created",
					act: {
						user: makeUser(),
						role: Role.MEMBER,
						createEventParams: makeEventParams({ type: EventTypes.BASIC }),
						repository: makeReturnType({
							data: makeEvent(),
						}),
					},
					assertion: {
						return: {
							ok: true,
							data: expect.any(Object),
						},
					},
				},
			];

			test.each(testCases)(
				"ok: $assertion.return.ok $name",
				async ({ act, assertion }) => {
					const { service, permissionService, eventsRepository } = setup();
					eventsRepository.create.mockResolvedValueOnce(
						act.repository ?? {
							ok: false,
							error: new InternalServerError("No return value expected"),
						},
					);
					/**
					 * Arrange
					 * 1. Set up the mock repository to handle the create method
					 */
					permissionService.hasRole.mockResolvedValueOnce(
						act.role !== null && act.role !== undefined,
					);

					/**
					 * Act
					 */
					const result = await service.create(
						makeMockContext(mock<User>({ id: faker.string.uuid() })),
						act.createEventParams,
					);

					/**
					 * assertion that the expected error is thrown
					 */
					expect(result).toEqual(assertion.return);
				},
			);
		});
	});

	describe("#update", () => {
		describe("should raise", () => {
			interface TestCase {
				name: string;
				arrange: {
					hasRole: boolean;
					event: EventTypeFromDSO & { slots: EventSlot[] };
				};
				act: {
					event: Partial<{
						name: string;
						description: string;
						startAt: Date;
						endAt: Date;
						location: string;
					}>;
					signUpDetails?: Partial<{
						signUpsEnabled: boolean;
						signUpsStartAt: Date;
						signUpsEndAt: Date;
						capacity: number;
						slots: { capacity: number }[];
					}>;
				};
				assertion: {
					error: string;
				};
			}
			const startAt = faker.date.soon();
			const endAt = faker.date.future({ refDate: startAt });

			const testCases: TestCase[] = [
				{
					name: "update name to empty string",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots(),
					},
					act: {
						event: {
							name: "",
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "Date.now() < endAt < startAt, changing endAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							endAt: faker.date.recent({ refDate: startAt }),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "Date.now() < endAt < startAt, changing endAt and startAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							endAt: faker.date.between({ from: startAt, to: endAt }),
							startAt: faker.date.soon({ refDate: endAt, days: 2 }),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "Date.now() < endAt < startAt, changing startAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.future({ refDate: endAt }),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "startAt < Date.now() < endAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.recent(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "startAt < endAt < Date.now()",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							endAt: faker.date.recent(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "startAt < endAt < Date.now(), changing endAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							endAt: faker.date.recent(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "endAt < startAt < Date.now(), changing endAt and startAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.recent(),
							endAt: faker.date.past(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "endAt < startAt < Date.now(), changing endAt and startAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.recent(),
							endAt: faker.date.past(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "signUpsEndAt < signUpsStartAt, changing signUpsStartAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({
							signUpDetails: mockSignUpDetails({
								signUpsEndAt: DateTime.now().plus({ days: 1 }).toJSDate(),
							}),
						}),
					},
					act: {
						event: {},
						signUpDetails: {
							signUpsStartAt: DateTime.now().plus({ days: 2 }).toJSDate(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "signUpsEndAt < signUpsStartAt, changing signUpsEndAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({
							signUpDetails: mockSignUpDetails({
								signUpsEndAt: DateTime.now().plus({ days: 3 }).toJSDate(),
								signUpsStartAt: DateTime.now().plus({ days: 2 }).toJSDate(),
							}),
						}),
					},
					act: {
						event: {},
						signUpDetails: {
							signUpsEndAt: DateTime.now().plus({ days: 1 }).toJSDate(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
				{
					name: "signUpsEndAt in the past, changing signUpsEndAt",
					arrange: {
						hasRole: true,
						event: makeEventWithSlots({
							signUpDetails: mockSignUpDetails({
								signUpsEndAt: DateTime.now().plus({ days: 3 }).toJSDate(),
								signUpsStartAt: DateTime.now().minus({ days: 2 }).toJSDate(),
							}),
						}),
					},
					act: {
						event: {},
						signUpDetails: {
							signUpsEndAt: DateTime.now().minus({ days: 1 }).toJSDate(),
						},
					},
					assertion: {
						error: InvalidArgumentError.name,
					},
				},
			];

			test.each(testCases)(
				"$assertion.error.name, $name",
				async ({ assertion, arrange, act }) => {
					const { service, eventsRepository, permissionService } = setup();

					/**
					 * Arrange
					 *
					 * 1. Set up the mock for `eventsRepository.get` to return the event in {arrange.event}
					 * 2. Set up the mock for `permissionService.hasRole` to return `true`
					 */
					// 1.
					eventsRepository.getWithSlots.mockResolvedValueOnce(arrange.event);
					// 2.
					permissionService.hasRole.mockResolvedValueOnce(arrange.hasRole);

					/**
					 * Act
					 */
					try {
						await service.update(
							faker.string.uuid(),
							faker.string.uuid(),
							act.event,
							act.signUpDetails,
						);
						fail("Expected to throw an error");
					} catch (error) {
						assert(error instanceof Error);
						expect(error.name).toBe(assertion.error);
						expect(eventsRepository.update).not.toHaveBeenCalled();
					}
				},
			);
		});
		describe("should update", () => {
			interface TestCase {
				name: string;
				arrange: {
					event: EventTypeFromDSO & { slots: EventSlot[] };
				};
				act: {
					event: Partial<{
						name?: string;
						description?: string;
						startAt?: Date;
						endAt?: Date;
						location?: string;
					}>;
					signUpDetails?: Partial<{
						signUpsEnabled: boolean;
						signUpsStartAt: Date;
						signUpsEndAt: Date;
						capacity: number;
						slots: { capacity: number }[];
					}>;
				};
				assertion: {
					event: {
						name?: string;
						description?: string;
						startAt?: Date;
						endAt?: Date;
						location?: string;
					};
					signUpDetails?: Partial<{
						signUpsEnabled: boolean;
						signUpsStartAt: Date;
						signUpsEndAt: Date;
						capacity: number;
						slots: { capacity: number }[];
					}>;
				};
			}
			const startAt = faker.date.soon();
			const endAt = faker.date.future({ refDate: startAt });

			const testCases: TestCase[] = [
				{
					name: "update name",
					arrange: {
						event: makeEventWithSlots(),
					},
					act: {
						event: {
							name: faker.company.name(),
						},
					},
					assertion: {
						event: {},
					},
				},
				{
					name: "all defined fields are updated",
					arrange: {
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							name: faker.company.name(),
							description: faker.lorem.paragraph(),
							startAt: DateTime.now().plus({ days: 1 }).toJSDate(),
							endAt: DateTime.now().plus({ days: 1, hours: 2 }).toJSDate(),
							location: faker.location.streetAddress(),
						},
					},
					assertion: {
						event: {},
					},
				},
				{
					name: "undefined fields are not updated",
					arrange: {
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							name: faker.company.name(),
							startAt: undefined,
							endAt: faker.date.future({ refDate: endAt }),
							location: undefined,
						},
					},
					assertion: {
						event: {
							location: expect.any(String),
							startAt: expect.any(Date),
							endAt: expect.any(Date),
							name: expect.any(String),
						},
					},
				},
				{
					name: "update `startAt` to be in the future, before `endAt`",
					arrange: {
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.recent({ refDate: endAt }),
						},
					},
					assertion: {
						event: {
							startAt: expect.any(Date),
							endAt: expect.any(Date),
						},
					},
				},
				{
					name: "update `endAt` to be in the future, after `startAt`",
					arrange: {
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							endAt: faker.date.soon({ refDate: startAt }),
						},
					},
					assertion: {
						event: {
							startAt: expect.any(Date),
							endAt: expect.any(Date),
						},
					},
				},
				{
					name: "update `startAt` and `endAt`, with `previousEndAt` < `startAt` < `endAt`",
					arrange: {
						event: makeEventWithSlots({ startAt, endAt }),
					},
					act: {
						event: {
							startAt: faker.date.soon({ refDate: endAt }),
							endAt: faker.date.future({ refDate: endAt }),
						},
					},
					assertion: {
						event: {},
					},
				},
				{
					name: "update signUpDetails when signUpsEndAt is in the past",
					arrange: {
						event: makeEventWithSlots({
							signUpsEnabled: true,
							signUpDetails: mockSignUpDetails({
								signUpsEndAt: DateTime.now().minus({ days: 2 }).toJSDate(),
								signUpsStartAt: DateTime.now().minus({ days: 3 }).toJSDate(),
							}),
						}),
					},
					act: {
						event: {},
						signUpDetails: {
							slots: [],
							signUpsEnabled: false,
						},
					},
					assertion: {
						event: {},
						signUpDetails: {
							signUpsEnabled: false,
						},
					},
				},
			];

			test.each(testCases)("$name", async ({ arrange, act, assertion }) => {
				const { service, eventsRepository, permissionService } = setup();

				/**
				 * Arrange
				 *
				 * 1. Set up the mock for `eventsRepository.get` to return the event in {arrange.event}
				 * 2. Set up the mock for `permissionService.hasRole` to return `true`
				 */
				// 1.
				eventsRepository.getWithSlots.mockResolvedValueOnce(arrange.event);
				// 2.
				permissionService.hasRole.mockResolvedValueOnce(true);

				/**
				 * Act
				 */
				const result = service.update(
					faker.string.uuid(),
					faker.string.uuid(),
					act.event,
					act.signUpDetails,
				);

				/**
				 * assertion
				 */
				await expect(result).resolves.not.toThrow();
				expect(eventsRepository.update).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining(assertion.event),
					assertion.signUpDetails &&
						expect.objectContaining(assertion.signUpDetails),
				);
			});
		});
	});

	describe("#createCategory", () => {
		it("should create a category", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.createCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					name: faker.commerce.productName(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).resolves.not.toThrow();
			expect(eventsRepository.createCategory).toHaveBeenCalled();
		});

		it("should raise PermissionDeniedError if the user is not a super user", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: false,
			});

			/**
			 * Act
			 */
			const result = service.createCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					name: faker.commerce.productName(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(PermissionDeniedError);
			expect(eventsRepository.createCategory).not.toHaveBeenCalled();
		});

		it("should raise InvalidArgumentError if the name is too long", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.createCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					name: faker.string.sample(101),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(InvalidArgumentError);
			expect(eventsRepository.createCategory).not.toHaveBeenCalled();
		});

		it("should raise InvalidArgumentError if the name is too short", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.createCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					name: "",
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(InvalidArgumentError);
			expect(eventsRepository.createCategory).not.toHaveBeenCalled();
		});
	});

	describe("#updateCategory", () => {
		it("should update a category", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.updateCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
					name: faker.commerce.productName(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).resolves.not.toThrow();
			expect(eventsRepository.updateCategory).toHaveBeenCalled();
		});

		it("should raise PermissionDeniedError if the user is not a super user", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: false,
			});

			/**
			 * Act
			 */
			const result = service.updateCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
					name: faker.commerce.productName(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(PermissionDeniedError);
			expect(eventsRepository.updateCategory).not.toHaveBeenCalled();
		});

		it("should raise InvalidArgumentError if the name is too long", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.updateCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
					name: faker.string.sample(101),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(InvalidArgumentError);
			expect(eventsRepository.updateCategory).not.toHaveBeenCalled();
		});

		it("should raise InvalidArgumentError if the name is too short", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.updateCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
					name: "",
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(InvalidArgumentError);
			expect(eventsRepository.updateCategory).not.toHaveBeenCalled();
		});
	});

	describe("#deleteCategory", () => {
		it("should delete a category", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: true,
			});

			/**
			 * Act
			 */
			const result = service.deleteCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).resolves.not.toThrow();
			expect(eventsRepository.deleteCategory).toHaveBeenCalled();
		});

		it("should raise PermissionDeniedError if the user is not a super user", async () => {
			const { service, eventsRepository, permissionService } = setup();

			/**
			 * Arrange
			 *
			 * 1. Set up the mock for `permissionService.isSuperUser` to return `true`
			 */
			permissionService.isSuperUser.mockResolvedValueOnce({
				isSuperUser: false,
			});

			/**
			 * Act
			 */
			const result = service.deleteCategory(
				makeMockContext(mock<User>({ id: faker.string.uuid() })),
				{
					id: faker.string.uuid(),
				},
			);

			/**
			 * assertion
			 */
			await expect(result).rejects.toThrow(PermissionDeniedError);
			expect(eventsRepository.deleteCategory).not.toHaveBeenCalled();
		});
	});
});
