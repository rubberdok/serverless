export const BookingStatus = {
	PENDING: "PENDING",
	CONFIRMED: "CONFIRMED",
	CANCELLED: "CANCELLED",
	REJECTED: "REJECTED",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

interface BookingType {
	id: string;
	startDate: Date;
	endDate: Date;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	cabins: { id: string }[];
	status: BookingStatus;
	totalCost: number;
	internalParticipantsCount: number;
	externalParticipantsCount: number;
}

class Booking implements BookingType {
	constructor(params: NewBookingParams) {
		this.id = params.id;
		this.startDate = params.startDate;
		this.endDate = params.endDate;
		this.email = params.email;
		this.firstName = params.firstName;
		this.lastName = params.lastName;
		this.phoneNumber = params.phoneNumber;
		this.cabins = params.cabins;
		this.status = params.status;
		this.totalCost = params.totalCost;
		this.internalParticipantsCount = params.internalParticipantsCount;
		this.externalParticipantsCount = params.externalParticipantsCount;
	}
	internalParticipantsCount: number;
	externalParticipantsCount: number;
	totalCost: number;
	status: BookingStatus;
	id: string;
	startDate: Date;
	endDate: Date;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	cabins: { id: string }[];
}

type NewBookingParams = {
	id: string;
	startDate: Date;
	endDate: Date;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	cabins: { id: string }[];
	status: BookingStatus;
	totalCost: number;
	internalParticipantsCount: number;
	externalParticipantsCount: number;
};

export { Booking };
export type { NewBookingParams, BookingType };
