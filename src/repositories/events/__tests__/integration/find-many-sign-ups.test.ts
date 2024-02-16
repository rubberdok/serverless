import assert from "assert";
import { faker } from "@faker-js/faker";
import { ParticipationStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { NotFoundError } from "~/domain/errors.js";
import prisma from "~/lib/prisma.js";
import { EventRepository } from "../../repository.js";

describe("EventRepository", () => {
	let eventRepository: EventRepository;

	beforeAll(() => {
		eventRepository = new EventRepository(prisma);
	});
	describe("findManySignUps", () => {
		it("should return sign ups ordered by created at ascending", async () => {
			/**
			 * Arrange
			 *
			 * 1. Create 3 users
			 * 2. Create an event
			 * 3. Create 3 sign ups for the event
			 */
			const user1 = await makeUser();
			const user2 = await makeUser();
			const user3 = await makeUser();

			const event = await prisma.event.create({
				data: {
					type: "BASIC",
					name: faker.word.adjective(),
					startAt: DateTime.now().plus({ days: 1 }).toJSDate(),
					endAt: DateTime.now().plus({ days: 2 }).toJSDate(),
				},
			});

			const signUp1 = await makeSignUp({
				userId: user1.id,
				eventId: event.id,
			});
			await makeSignUp({
				userId: user2.id,
				eventId: event.id,
				status: ParticipationStatus.CONFIRMED,
			});
			const signUp3 = await makeSignUp({
				userId: user3.id,
				eventId: event.id,
			});

			/**
			 * Act
			 *
			 * Call findManySignUps
			 */
			const actual = await eventRepository.findManySignUps({
				eventId: event.id,
				status: ParticipationStatus.ON_WAITLIST,
			});
			if (!actual.ok) throw actual.error;

			/**
			 * Assert
			 *
			 * 1. The sign ups should be ordered by created at ascending
			 * 2. Only the sign ups with status ON_WAITLIST should be returned, so the second sign up should not be returned
			 */
			expect(actual.data.signUps).toEqual([signUp1, signUp3]);
			expect(actual.data.total).toBe(2);
		});

		it("should NotFoundError if trying to fetch sign ups for an event that doesn't exist", async () => {
			/**
			 * Act
			 *
			 * Call findManySignUps
			 */
			const actual = await eventRepository.findManySignUps({
				eventId: faker.string.uuid(),
				status: ParticipationStatus.ON_WAITLIST,
			});
			assert(!actual.ok, "Expected an error");
			expect(actual.error).toBeInstanceOf(NotFoundError);
		});
	});
});

function makeSignUp({
	userId,
	eventId,
	status,
}: {
	userId: string;
	eventId: string;
	status?: ParticipationStatus;
}) {
	return prisma.eventSignUp.create({
		data: {
			userId,
			eventId,
			participationStatus: status ?? ParticipationStatus.ON_WAITLIST,
		},
	});
}

function makeUser() {
	return prisma.user.create({
		data: {
			email: faker.internet.email(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			username: faker.string.sample(20),
			feideId: faker.string.uuid(),
		},
	});
}
