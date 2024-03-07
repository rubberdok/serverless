import { faker } from "@faker-js/faker";
import { type BookingSemester, type Cabin, Semester } from "@prisma/client";
import { type DeepMockProxy, mock, mockDeep } from "jest-mock-extended";
import { merge } from "lodash-es";
import { DateTime } from "luxon";
import { pino } from "pino";
import type { BookingType } from "~/domain/cabins.js";
import type {
	InternalServerError,
	InvalidArgumentError,
} from "~/domain/errors.js";
import { makeMockContext } from "~/lib/context.js";
import { envToLogger } from "~/lib/fastify/logging.js";
import type { NewBookingParams } from "~/lib/server.js";
import {
	CabinService,
	type ICabinRepository,
	type MailService,
	type PermissionService,
} from "../../service.js";

describe("CabinService", () => {
	let cabinService: CabinService;
	let cabinRepository: DeepMockProxy<ICabinRepository>;
	let mailService: DeepMockProxy<MailService>;

	beforeAll(() => {
		cabinRepository = mockDeep<ICabinRepository>();
		mailService = mockDeep<MailService>();
		cabinService = new CabinService(
			cabinRepository,
			mailService,
			mockDeep<PermissionService>(),
		);
	});

	describe("#newBooking", () => {
		describe("should return error and ok: false if", () => {
			interface TestCase {
				name: string;
				arrange: {
					bookingSemesters: {
						fall: BookingSemester | null;
						spring: BookingSemester | null;
					};
				};
				act: {
					input: NewBookingParams;
				};
				expected: {
					error: InternalServerError | InvalidArgumentError;
				};
			}

			async function testFn({ arrange, act, expected }: TestCase) {
				/**
				 * Arrange
				 *
				 * Mock the cabinRepository.getBookingSemesters method to return the bookingSemesters from the test case.
				 */
				cabinRepository.getBookingSemester.mockImplementation(
					(semester: Semester) => {
						if (semester === Semester.FALL)
							return Promise.resolve(arrange.bookingSemesters.fall);
						if (semester === Semester.SPRING)
							return Promise.resolve(arrange.bookingSemesters.spring);
						throw new Error(`Unexpected semester: ${semester}`);
					},
				);
				cabinRepository.findManyBookings.mockResolvedValue({
					ok: true,
					data: {
						bookings: [],
						total: 0,
					},
				});
				cabinRepository.getCabinById.mockResolvedValue(
					mock<Cabin>({
						id: faker.string.uuid(),
						internalPrice: 100,
						externalPrice: 200,
						internalPriceWeekend: 150,
						externalPriceWeekend: 250,
						capacity: Number.MAX_SAFE_INTEGER,
					}),
				);

				/**
				 * Act
				 *
				 * Call newBooking with the input from the test case.
				 */
				const newBooking = await cabinService.newBooking(
					makeMockContext({ id: faker.string.uuid() }),
					act.input,
				);

				/**
				 * Assert
				 *
				 * Expect newBooking return the expected error.
				 */
				expect(newBooking).toEqual({
					ok: false,
					error: expected.error,
				});
				expect(cabinRepository.createBooking).not.toHaveBeenCalled();
			}

			describe("contact details are incorrect", () => {
				const testCases: TestCase[] = [
					{
						name: "email is invalid",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								email: "fake",
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									email: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "phone number is invalid",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								phoneNumber: "fake",
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									phoneNumber: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "cabinId is not a UUID",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								cabins: [{ id: "fake" }],
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									cabins: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "firstName is blank",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								firstName: "",
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									firstName: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "lastName is blank",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								lastName: "",
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									lastName: expect.any(Array),
								}),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("booking dates are incorrect", () => {
				const testCases: TestCase[] = [
					{
						name: "booking start date is in the past",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: faker.date.past(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "booking end date is in the past",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								endDate: faker.date.past(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									endDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "booking end date is before booking start date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ days: 3 }).toJSDate(),
								endDate: DateTime.now().plus({ days: 2 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "booking end date is the same as booking start date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: makeBookingSemester(),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2500,
									day: 1,
									month: 1,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									day: 1,
									month: 1,
								}).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("booking within a booking semester and", () => {
				const testCases: TestCase[] = [
					{
						name: "no booking semesters are active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({ bookingsEnabled: false }),
								spring: makeBookingSemester({ bookingsEnabled: false }),
							},
						},
						act: {
							input: makeCabinInput(),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.arrayContaining([
										expect.stringContaining(
											"not available for the selected dates",
										),
									]),
								}),
							}),
						},
					},
					{
						name: "no booking semesters exist",
						arrange: {
							bookingSemesters: {
								fall: null,
								spring: null,
							},
						},
						act: {
							input: makeCabinInput(),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.arrayContaining([
										expect.stringContaining(
											"not available for the selected dates",
										),
									]),
								}),
							}),
						},
					},
					{
						name: "the booking start date is before the active booking semester start date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									startAt: DateTime.now().plus({ days: 2 }).toJSDate(),
								}),
								spring: null,
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ days: 1 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the booking end date is after the active booking semester end date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.now().plus({ days: 2 }).toJSDate(),
								}),
								spring: null,
							},
						},
						act: {
							input: makeCabinInput({
								endDate: DateTime.now().plus({ days: 3 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the booking is contained in a booking semester that is not active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({ bookingsEnabled: false }),
								spring: makeBookingSemester({
									bookingsEnabled: true,
									startAt: DateTime.fromObject({ year: 0 }).toJSDate(),
									endAt: DateTime.fromObject({ year: 1 }).toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								endDate: DateTime.now().plus({ days: 3 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("cross-semester booking (Fall to Spring) and", () => {
				const testCases: TestCase[] = [
					{
						name: "there is more than a day between the booking semesters",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.now()
										.plus({ days: 1 })
										.endOf("day")
										.toJSDate(),
								}),
								spring: makeBookingSemester({
									startAt: DateTime.now()
										.plus({ days: 3 })
										.startOf("day")
										.toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ hour: 1 }).toJSDate(),
								endDate: DateTime.now().plus({ days: 4 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the spring semester is not active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.now()
										.plus({ days: 1 })
										.endOf("day")
										.toJSDate(),
								}),
								spring: makeBookingSemester({
									startAt: DateTime.now()
										.plus({ days: 2 })
										.startOf("day")
										.toJSDate(),
									bookingsEnabled: false,
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ hour: 1 }).toJSDate(),
								endDate: DateTime.now().plus({ days: 4 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the fall semester is not active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.now()
										.plus({ days: 1 })
										.endOf("day")
										.toJSDate(),
									bookingsEnabled: false,
								}),
								spring: makeBookingSemester({
									startAt: DateTime.now()
										.plus({ days: 2 })
										.startOf("day")
										.toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ hour: 1 }).toJSDate(),
								endDate: DateTime.now().plus({ days: 4 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("cross-semester booking (Spring to Fall) and", () => {
				const testCases: TestCase[] = [
					{
						name: "there is more than a day between the booking semesters",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									startAt: DateTime.now()
										.plus({ days: 3 })
										.startOf("day")
										.toJSDate(),
								}),
								spring: makeBookingSemester({
									endAt: DateTime.now()
										.plus({ days: 1 })
										.endOf("day")
										.toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now().plus({ hour: 1 }).toJSDate(),
								endDate: DateTime.now().plus({ days: 4 }).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the fall semester is not active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									startAt: DateTime.fromObject({
										year: 0,
									}).toJSDate(),
									endAt: DateTime.fromObject({
										year: 5000,
									}).toJSDate(),
									bookingsEnabled: false,
								}),
								spring: makeBookingSemester({
									endAt: DateTime.fromObject({ year: 2500 }).toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2499,
									month: 12,
									day: 31,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									month: 1,
									day: 2,
								}).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.any(Array),
								}),
							}),
						},
					},
					{
						name: "the spring semester is not active",
						arrange: {
							bookingSemesters: {
								spring: makeBookingSemester({
									startAt: DateTime.fromObject({
										year: 0,
									}).toJSDate(),
									endAt: DateTime.fromObject({
										year: 5000,
									}).toJSDate(),
									bookingsEnabled: false,
								}),
								fall: makeBookingSemester({
									endAt: DateTime.fromObject({ year: 2500 }).toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2499,
									month: 12,
									day: 31,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									month: 1,
									day: 2,
								}).toJSDate(),
							}),
						},
						expected: {
							error: expect.objectContaining({
								name: "InvalidArgumentError",
								reason: expect.objectContaining({
									startDate: expect.anything(),
								}),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});
		});

		describe("should create a booking if", () => {
			interface TestCase {
				name: string;
				arrange: {
					bookingSemesters: {
						fall: BookingSemester | null;
						spring: BookingSemester | null;
					};
				};
				act: {
					input: NewBookingParams;
				};
			}

			async function testFn({ arrange, act, name }: TestCase) {
				/**
				 * Arrange
				 *
				 * Mock the cabinRepository.getBookingSemesters method to return the bookingSemesters from the test case.
				 * Mock the cabinRepository.createBooking method to return a booking.
				 * Mock the mailService.sendBookingConfirmation method to return a promise.
				 */
				cabinRepository.getBookingSemester.mockImplementation(
					(semester: Semester) => {
						if (semester === Semester.FALL)
							return Promise.resolve(arrange.bookingSemesters.fall);
						if (semester === Semester.SPRING)
							return Promise.resolve(arrange.bookingSemesters.spring);
						throw new Error(`Unexpected semester: ${semester}`);
					},
				);
				cabinRepository.findManyBookings.mockResolvedValue({
					ok: true,
					data: {
						bookings: [],
						total: 0,
					},
				});
				cabinRepository.createBooking.mockResolvedValue({
					ok: true,
					data: {
						booking: { ...mock<BookingType>(), id: faker.string.uuid() },
					},
				});
				mailService.sendAsync.mockResolvedValue();

				/**
				 * Act
				 *
				 * Call newBooking with the input from the test case.
				 */
				const newBooking = await cabinService.newBooking(
					makeMockContext(
						{ id: faker.string.uuid() },
						pino({ ...envToLogger.test, name }),
					),
					act.input,
				);

				/**
				 * Assert
				 *
				 * Expect newBooking not to throw an error
				 * Expect cabinRepository.createBooking to be called with the correct arguments
				 * Expect mailService.sendBookingConfirmation to be called with the correct arguments
				 */
				expect(newBooking).toEqual({
					ok: true,
					data: {
						booking: expect.any(Object),
					},
				});
				expect(cabinRepository.createBooking).toHaveBeenCalled();
			}

			describe("booking within a booking semester and", () => {
				const testCases: TestCase[] = [
					{
						name: "the booking start date is the same as the active booking semester start date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									startAt: DateTime.fromObject({
										year: 2500,
										day: 1,
										month: 1,
									}).toJSDate(),
								}),
								spring: null,
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2500,
									day: 1,
									month: 1,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									day: 2,
									month: 1,
								}).toJSDate(),
							}),
						},
					},
					{
						name: "the booking end date is the same as the active booking semester end date",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.now()
										.plus({ days: 2 })
										.startOf("day")
										.toJSDate(),
								}),
								spring: null,
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now()
									.plus({ days: 1 })
									.startOf("day")
									.toJSDate(),
								endDate: DateTime.now()
									.plus({ days: 2 })
									.startOf("day")
									.toJSDate(),
							}),
						},
					},
					{
						name: "the booking is contained in a booking semester that is active",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester(),
								spring: null,
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.now()
									.plus({ days: 1 })
									.startOf("day")
									.toJSDate(),
								endDate: DateTime.now()
									.plus({ days: 2 })
									.startOf("day")
									.toJSDate(),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("cross-semester booking (Fall to Spring) and", () => {
				const testCases: TestCase[] = [
					{
						name: "the booking semesters overlap",
						arrange: {
							bookingSemesters: {
								fall: makeBookingSemester({
									endAt: DateTime.fromObject({
										year: 2500,
										day: 1,
										month: 1,
									}).toJSDate(),
								}),
								spring: makeBookingSemester({
									startAt: DateTime.fromObject({
										year: 2500,
										day: 1,
										month: 1,
									}).toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2499,
									day: 31,
									month: 12,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									day: 2,
									month: 1,
								}).toJSDate(),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});

			describe("cross-semester booking (Spring to Fall) and", () => {
				const testCases: TestCase[] = [
					{
						name: "the booking semesters overlap",
						arrange: {
							bookingSemesters: {
								spring: makeBookingSemester({
									endAt: DateTime.fromObject({
										year: 2500,
										day: 1,
										month: 1,
									}).toJSDate(),
								}),
								fall: makeBookingSemester({
									startAt: DateTime.fromObject({
										year: 2500,
										day: 1,
										month: 1,
									}).toJSDate(),
								}),
							},
						},
						act: {
							input: makeCabinInput({
								startDate: DateTime.fromObject({
									year: 2499,
									day: 31,
									month: 12,
								}).toJSDate(),
								endDate: DateTime.fromObject({
									year: 2500,
									day: 2,
									month: 1,
								}).toJSDate(),
							}),
						},
					},
				];

				test.each(testCases)("$name", testFn);
			});
		});

		it("should return InvalidArgumentError if the participant count exceeds the capacity", () => {
			const bookingSemester = makeBookingSemester();
			const cabin1 = mock<Cabin>({
				id: faker.string.uuid(),
				internalPrice: 100,
				externalPrice: 200,
				internalPriceWeekend: 150,
				externalPriceWeekend: 250,
				capacity: 5,
			});
			const cabin2 = mock<Cabin>({
				id: faker.string.uuid(),
				internalPrice: 100,
				externalPrice: 200,
				internalPriceWeekend: 150,
				externalPriceWeekend: 250,
				capacity: 5,
			});
			const input = makeCabinInput({
				cabins: [cabin1, cabin2],
				internalParticipantsCount: 6,
				externalParticipantsCount: 5,
			});
			cabinRepository.getBookingSemester.mockResolvedValue(bookingSemester);
			cabinRepository.getCabinById.mockResolvedValueOnce(cabin1);
			cabinRepository.getCabinById.mockResolvedValueOnce(cabin2);

			const newBooking = cabinService.newBooking(
				makeMockContext({ id: faker.string.uuid() }),
				input,
			);

			expect(newBooking).resolves.toEqual({
				ok: false,
				error: expect.objectContaining({
					name: "InvalidArgumentError",
					reason: expect.objectContaining({
						internalParticipantsCount: expect.any(Array),
					}),
				}),
			});
		});

		it("should send a booking confirmation email", async () => {
			/**
			 * Arrange
			 *
			 * Mock the cabinRepository.getBookingSemesters method to return the bookingSemesters from the test case.
			 * Mock the cabinRepository.createBooking method to return a booking.
			 * Mock the mailService.sendBookingConfirmation method to return a promise.
			 */
			cabinRepository.getBookingSemester.mockResolvedValue(
				makeBookingSemester({
					bookingsEnabled: true,
					semester: Semester.FALL,
					startAt: DateTime.fromObject({ year: 0 }).toJSDate(),
					endAt: DateTime.fromObject({ year: 3000 }).toJSDate(),
				}),
			);
			const booking = mock<BookingType>({ id: faker.string.uuid() });
			cabinRepository.createBooking.mockResolvedValue({
				ok: true,
				data: {
					booking,
				},
			});
			mailService.sendAsync.mockResolvedValue();

			/**
			 * Act
			 *
			 * call newBooking
			 */
			const newBooking = await cabinService.newBooking(
				makeMockContext(
					{
						id: faker.string.uuid(),
					},
					pino(envToLogger.test),
				),
				makeCabinInput(),
			);

			/**
			 * Assert
			 *
			 * Expect newBooking not to throw an error
			 * Expect cabinRepository.createBooking to be called with the correct arguments
			 * Expect mailService.sendBookingConfirmation to be called with the correct arguments
			 */
			expect(newBooking).toEqual({
				ok: true,
				data: {
					booking,
				},
			});

			expect(mailService.sendAsync).toHaveBeenCalledWith({
				type: "cabin-booking-receipt",
				bookingId: booking.id,
			});
		});

		it("returns InvalidArgument if the booking overlaps with an existing booking", async () => {
			const bookingSemester = makeBookingSemester();
			const cabin = mock<Cabin>({
				id: faker.string.uuid(),
				internalPrice: 100,
				externalPrice: 200,
				internalPriceWeekend: 150,
				externalPriceWeekend: 250,
				capacity: 5,
			});
			const input = makeCabinInput();
			cabinRepository.getBookingSemester.mockResolvedValue(bookingSemester);
			cabinRepository.getCabinById.mockResolvedValue(cabin);
			cabinRepository.findManyBookings.mockResolvedValue({
				ok: true,
				data: {
					bookings: [
						{
							...mock<BookingType>(),
							id: faker.string.uuid(),
							cabins: [{ id: cabin.id }],
							startDate: input.startDate,
							endDate: input.endDate,
						},
					],
					total: 1,
				},
			});

			const newBooking = await cabinService.newBooking(
				makeMockContext({ id: faker.string.uuid() }),
				input,
			);

			expect(newBooking).toEqual({
				ok: false,
				error: expect.objectContaining({
					name: "InvalidArgumentError",
					reason: expect.objectContaining({
						startDate: expect.arrayContaining([
							expect.stringContaining("not available"),
						]),
					}),
				}),
			});
		});
	});
});

function makeCabinInput(
	data: Partial<NewBookingParams> = {},
): NewBookingParams {
	const startDate = DateTime.now().plus({ days: 1 }).toJSDate();
	const endDate = DateTime.fromJSDate(startDate).plus({ days: 1 }).toJSDate();
	return merge<NewBookingParams, Partial<NewBookingParams>>(
		{
			cabins: [{ id: faker.string.uuid() }],
			startDate,
			endDate,
			phoneNumber: "40000000",
			email: faker.internet.email(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			internalParticipantsCount: 1,
			externalParticipantsCount: 1,
		},
		data,
	);
}

function makeBookingSemester(
	data: Partial<BookingSemester> = {},
): BookingSemester {
	return merge<BookingSemester, Partial<BookingSemester>>(
		{
			id: faker.string.uuid(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			semester: Semester.FALL,
			startAt: DateTime.fromObject({ year: 1000 }).toJSDate(),
			endAt: DateTime.fromObject({ year: 3000 }).toJSDate(),
			bookingsEnabled: true,
		},
		data,
	);
}
