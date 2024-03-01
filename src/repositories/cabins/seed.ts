import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { BookingStatus } from "~/domain/cabins.js";

faker.seed(312849038190);
const oksenId = faker.string.uuid();
const bjornenId = faker.string.uuid();

const cabinCreateInput: Prisma.CabinCreateInput[] = [
	{
		id: oksenId,
		name: "Oksen",
		capacity: 18,
		internalPrice: 10,
		internalPriceWeekend: 15,
		externalPrice: 20,
		externalPriceWeekend: 25,
	},
	{
		id: bjornenId,
		name: "Bjørnen",
		capacity: 18,
		internalPrice: 10,
		externalPrice: 20,
		internalPriceWeekend: 15,
		externalPriceWeekend: 25,
	},
];

const bookingCreateInput: Prisma.BookingCreateInput[] = [
	{
		id: faker.string.uuid(),
		startDate: DateTime.now().plus({ weeks: 30 }).toJSDate(),
		endDate: DateTime.now().plus({ weeks: 31 }).toJSDate(),
		status: BookingStatus.PENDING,
		email: faker.internet.exampleEmail(),
		phoneNumber: faker.phone.number(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		internalParticipantsCount: 5,
		externalParticipantsCount: 10,
		totalCost: 1 * 250 + 5 * 200 + 1 * 2500 + 5 * 2000,
		cabins: {
			connect: {
				id: oksenId,
			},
		},
	},
	{
		id: faker.string.uuid(),
		startDate: DateTime.now().plus({ weeks: 30 }).toJSDate(),
		endDate: DateTime.now().plus({ weeks: 31 }).toJSDate(),
		status: BookingStatus.REJECTED,
		email: faker.internet.exampleEmail(),
		phoneNumber: faker.phone.number(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		internalParticipantsCount: 5,
		externalParticipantsCount: 10,
		totalCost: 1 * 250 + 5 * 200 + 1 * 2500 + 5 * 2000,
		cabins: {
			connect: {
				id: oksenId,
			},
		},
	},
	{
		id: faker.string.uuid(),
		startDate: DateTime.now().plus({ weeks: 30 }).toJSDate(),
		endDate: DateTime.now().plus({ weeks: 31 }).toJSDate(),
		status: BookingStatus.REJECTED,
		email: faker.internet.exampleEmail(),
		phoneNumber: faker.phone.number(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		internalParticipantsCount: 5,
		externalParticipantsCount: 10,
		totalCost: 1 * 250 + 5 * 200 + 1 * 2500 + 5 * 2000,
		cabins: {
			connect: {
				id: oksenId,
			},
		},
	},
	{
		id: faker.string.uuid(),
		startDate: DateTime.now().plus({ weeks: 30 }).toJSDate(),
		endDate: DateTime.now().plus({ weeks: 31 }).toJSDate(),
		status: BookingStatus.CANCELLED,
		email: faker.internet.exampleEmail(),
		phoneNumber: faker.phone.number(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		internalParticipantsCount: 5,
		externalParticipantsCount: 10,
		totalCost: 1 * 250 + 5 * 200 + 1 * 2500 + 5 * 2000,
		cabins: {
			connect: {
				id: oksenId,
			},
		},
	},
	{
		id: faker.string.uuid(),
		startDate: DateTime.now().plus({ weeks: 30 }).toJSDate(),
		endDate: DateTime.now().plus({ weeks: 31 }).toJSDate(),
		status: BookingStatus.CONFIRMED,
		email: faker.internet.exampleEmail(),
		phoneNumber: faker.phone.number(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		internalParticipantsCount: 5,
		externalParticipantsCount: 10,
		totalCost: 1 * 250 + 5 * 200 + 1 * 2500 + 5 * 2000,
		cabins: {
			connect: {
				id: oksenId,
			},
		},
	},
];

const createBookingSemesterInput: Prisma.BookingSemesterCreateInput[] = [
	{
		id: faker.string.uuid(),
		semester: "FALL",
		startAt: DateTime.fromObject({
			month: 8,
			day: 1,
			year: DateTime.now().year,
		}).toJSDate(),
		endAt: DateTime.fromObject({
			month: 12,
			day: 31,
			year: DateTime.now().year,
		}).toJSDate(),
		bookingsEnabled: true,
	},
	{
		id: faker.string.uuid(),
		semester: "SPRING",
		startAt: DateTime.fromObject({
			month: 1,
			day: 1,
			year: DateTime.now().year,
		}).toJSDate(),
		endAt: DateTime.fromObject({
			month: 7,
			day: 31,
			year: DateTime.now().year,
		}).toJSDate(),
		bookingsEnabled: true,
	},
];

export const load = async (db: PrismaClient) => {
	console.log("Seeding cabins...");
	for (const cabin of cabinCreateInput) {
		await db.cabin.upsert({
			where: {
				id: cabin.id,
			},
			update: cabin,
			create: cabin,
		});
	}
	const cabins = await db.cabin.findMany({
		select: {
			id: true,
			name: true,
		},
	});

	console.log("Seeding bookings...");
	for (const booking of bookingCreateInput) {
		await db.booking.upsert({
			where: {
				id: booking.id,
			},
			update: booking,
			create: booking,
		});
	}
	const bookings = await db.booking.findMany({
		select: {
			id: true,
			cabins: {
				select: {
					id: true,
				},
			},
			status: true,
			firstName: true,
			lastName: true,
		},
	});

	console.log("Seeding booking semesters...");
	for (const semester of createBookingSemesterInput) {
		await db.bookingSemester.upsert({
			where: {
				id: semester.id,
			},
			update: semester,
			create: semester,
		});
	}
	const bookingSemesters = await db.bookingSemester.findMany({
		select: {
			id: true,
			semester: true,
		},
	});

	console.log("Seeding booking contact...");
	await db.bookingContact.upsert({
		where: {
			id: "booking-contact",
		},
		update: {},
		create: {
			email: faker.internet.exampleEmail(),
			phoneNumber: faker.phone.number(),
			name: `${faker.person.firstName()}${faker.person.lastName()}`,
		},
	});

	return { cabins, bookings, bookingSemesters };
};
