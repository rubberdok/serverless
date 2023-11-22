/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

/* eslint-disable */
/* prettier-ignore */

/**
 * This file was automatically generated by 'graphql-codegen'.
 * Please do not edit this file directly.
 * To regenerate this file, run `pnpm generate:gql`
 */

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddMemberInput = {
  /** The ID of the organization to add the user to */
  organizationId: Scalars['ID']['input'];
  /** The role of the user in the organization, defaults to Role.MEMBER */
  role?: InputMaybe<Role>;
  /** The ID of the user to add to the organization */
  userId: Scalars['ID']['input'];
};

export type AddMemberResponse = {
  __typename?: 'AddMemberResponse';
  member: Member;
};

export type Booking = {
  __typename?: 'Booking';
  cabin: Cabin;
  email: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Status;
};

export type BookingContact = {
  __typename?: 'BookingContact';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type BookingContactResponse = {
  __typename?: 'BookingContactResponse';
  bookingContact: BookingContact;
};

export type BookingSemester = {
  __typename?: 'BookingSemester';
  bookingsEnabled: Scalars['Boolean']['output'];
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  semester: Semester;
  startAt: Scalars['DateTime']['output'];
};

export type BookingSemestersResponse = {
  __typename?: 'BookingSemestersResponse';
  autumn?: Maybe<BookingSemester>;
  spring?: Maybe<BookingSemester>;
};

export type Cabin = {
  __typename?: 'Cabin';
  capacity: Scalars['Int']['output'];
  externalPrice: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CabinsResponse = {
  __typename?: 'CabinsResponse';
  cabins: Array<Cabin>;
};

export type CreateEventInput = {
  /**
   * Total capacity for the event, regardless of the capacity in each slot.
   * This number takes precedence over the capacity in each slot, so if the remaining capacity on the event is 0
   * no more users can be registered as attending.
   */
  capacity?: InputMaybe<Scalars['Int']['input']>;
  /**
   * The description of the event, defaults to "". We support markdown on the client, so this can be markdown.
   * This will be displayed to users.
   */
  description?: InputMaybe<Scalars['String']['input']>;
  /**
   * The end time of the event. If this is not provided, the event will be assumed to be two hours long.
   * This will be displayed to users.
   */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The name of the event, this will be displayed to users */
  name: Scalars['String']['input'];
  /**
   * The organization that is hosting the event. Events must be hosted by an organization, and the user
   * creating the event must be a member of the organization.
   */
  organizationId: Scalars['ID']['input'];
  /** The slots for the event. If this is not provided, but capacity is, then all users can attend the event. */
  slots?: InputMaybe<Array<CreateEventSlot>>;
  /** The start time of the event. Events must have a start time. */
  startAt: Scalars['DateTime']['input'];
};

export type CreateEventResponse = {
  __typename?: 'CreateEventResponse';
  event: Event;
};

export type CreateEventSlot = {
  capacity: Scalars['Int']['input'];
};

export type CreateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt: Scalars['DateTime']['input'];
  /** The description of the listing, can be markdown. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name: Scalars['String']['input'];
  /** The ID of the organization that the listing belongs to. */
  organizationId: Scalars['ID']['input'];
};

export type CreateListingResponse = {
  __typename?: 'CreateListingResponse';
  listing: Listing;
};

export type CreateOrganizationInput = {
  /** The description of the organization, cannot exceed 10 000 characters */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the organization, must be unique and between 1 and 100 characters */
  name: Scalars['String']['input'];
};

export type CreateOrganizationResponse = {
  __typename?: 'CreateOrganizationResponse';
  organization: Organization;
};

export type DeleteListingInput = {
  id: Scalars['ID']['input'];
};

export type DeleteListingResponse = {
  __typename?: 'DeleteListingResponse';
  listing: Listing;
};

export type Event = {
  __typename?: 'Event';
  /** The description of the event. We support markdown on the client, so this can be markdown. */
  description: Scalars['String']['output'];
  /** The end time of the event. */
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The name of the event. */
  name: Scalars['String']['output'];
  /** The start time of the event. */
  startAt: Scalars['DateTime']['output'];
};

export type EventInput = {
  id: Scalars['ID']['input'];
};

export type EventResponse = {
  __typename?: 'EventResponse';
  event: Event;
};

export type EventsInput = {
  /**
   * If true, only return events that are currently happening, or will happen in the future
   * i.e. events where endAt is in the future.
   */
  futureEventsOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  /** All events, if futureEventsOnly is false, otherwise only future events */
  events: Array<Event>;
  /** The events that start next week, by week number */
  nextWeek: Array<Event>;
  /** The events that start this week, by week number */
  thisWeek: Array<Event>;
  /** The total number of events returned by this query (for now) */
  total: Scalars['Int']['output'];
  /** The events that start in two weeks or later, by week number */
  twoWeeksOrLater: Array<Event>;
};

export type Listing = {
  __typename?: 'Listing';
  /** An optional URL to the application form for the listing, defaults to "" */
  applicationUrl: Scalars['String']['output'];
  /** When the listing closes, i.e. deadline, or when the listing is hidden from view. */
  closesAt: Scalars['DateTime']['output'];
  /** The description of the listing, can be markdown. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name/title of the listing, will be visible to users. */
  name: Scalars['String']['output'];
  /** The organization that the listing belongs to. */
  organization: Organization;
};

export type ListingInput = {
  id: Scalars['ID']['input'];
};

export type ListingResponse = {
  __typename?: 'ListingResponse';
  listing: Listing;
};

export type ListingsResponse = {
  __typename?: 'ListingsResponse';
  listings: Array<Listing>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID']['output'];
  /** The organization the member is a member of */
  organization: Organization;
  /** The role of the member in the organization */
  role: Role;
  /** The user that is a member of the organization */
  user: PublicUser;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a member to the organization */
  addMember: AddMemberResponse;
  /** Create an event, requires that the user is logged in, and is a member of the organization that is hosting the event */
  createEvent: CreateEventResponse;
  createListing: CreateListingResponse;
  /** Create a new organization, and add the current user as an admin of the organization. */
  createOrganization: CreateOrganizationResponse;
  deleteListing: DeleteListingResponse;
  newBooking: NewBookingResponse;
  /** Remove a member from the organization by the ID of the membership. */
  removeMember: RemoveMemberResponse;
  /** Retract an active sign up for an event, requires that the user is logged in */
  retractSignUp: RetractSignUpResponse;
  /** Sign up for an event, requires that the user is logged in */
  signUp: SignUpResponse;
  /** Updates the booking contact, requires that the user is in an organization with the CABIN_BOOKING permission. */
  updateBookingContact: UpdateBookingContactResponse;
  /**
   * Updates the booking semester for the given semester, requires that the user is in an organization with
   * the CABIN_BOOKING permission.
   */
  updateBookingSemester: UpdateBookingSemesterResponse;
  updateBookingStatus: UpdateBookingResponse;
  updateListing: UpdateListingResponse;
  /**
   * Update an organization with the given name and description.
   * Passing null or omitting a value will leave the value unchanged.
   */
  updateOrganization: UpdateOrganizationResponse;
  updateUser: UpdateUserResponse;
};


export type MutationAddMemberArgs = {
  data: AddMemberInput;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateListingArgs = {
  data: CreateListingInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationDeleteListingArgs = {
  data: DeleteListingInput;
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRemoveMemberArgs = {
  data: RemoveMemberInput;
};


export type MutationRetractSignUpArgs = {
  data: RetractSignUpInput;
};


export type MutationSignUpArgs = {
  data: SignUpInput;
};


export type MutationUpdateBookingContactArgs = {
  data: UpdateBookingContactInput;
};


export type MutationUpdateBookingSemesterArgs = {
  data: UpdateBookingSemesterInput;
};


export type MutationUpdateBookingStatusArgs = {
  data: UpdateBookingStatusInput;
};


export type MutationUpdateListingArgs = {
  data: UpdateListingInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewBookingInput = {
  cabinId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type NewBookingResponse = {
  __typename?: 'NewBookingResponse';
  booking: Booking;
};

export type Organization = {
  __typename?: 'Organization';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The members of the organization */
  members: Array<Member>;
  name: Scalars['String']['output'];
};

export type ParticipationStatus =
  /** The user is confirmed to be attending the event */
  | 'CONFIRMED'
  /** The user is on the wait list for the event */
  | 'ON_WAITLIST'
  /** The user has signed up for the event, and had their sign up removed by an admin */
  | 'REMOVED'
  /** The user has signed up for the event, and then retracted their sign up */
  | 'RETRACTED';

/**
 * PrivateUser should only be used when accessed by the authenticated user themselves
 * as it contains sensitive information.
 */
export type PrivateUser = {
  __typename?: 'PrivateUser';
  allergies?: Maybe<Scalars['String']['output']>;
  /** If the user is permitted to update their graduation year */
  canUpdateYear: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Student email */
  email: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  /** The users grade year, from 1 - 6(+) */
  gradeYear?: Maybe<Scalars['Int']['output']>;
  /** Expected graduation year for the user */
  graduationYear?: Maybe<Scalars['Int']['output']>;
  /** The last time the users graduation year was updated */
  graduationYearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  /** All organizations the user is a member of */
  organizations: Array<Organization>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

/**
 * The public facing user type, with limited information.
 * This type is is available to other users, and should therefore not contain sensitive information,
 * unless the information is restricted by access control.
 */
export type PublicUser = {
  __typename?: 'PublicUser';
  /** The users' given/first name */
  firstName: Scalars['String']['output'];
  /** The users' grade year */
  gradeYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /** The users' family/last name */
  lastName: Scalars['String']['output'];
  /** The users' username */
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  bookingContact: BookingContactResponse;
  bookingSemesters: BookingSemestersResponse;
  cabins: CabinsResponse;
  event: EventResponse;
  events: EventsResponse;
  listing: ListingResponse;
  listings: ListingsResponse;
  user: UserResponse;
  users: UsersResponse;
};


export type QueryEventArgs = {
  data: EventInput;
};


export type QueryEventsArgs = {
  data?: InputMaybe<EventsInput>;
};


export type QueryListingArgs = {
  data: ListingInput;
};

export type RemoveMemberInput = {
  id: Scalars['ID']['input'];
};

export type RemoveMemberResponse = {
  __typename?: 'RemoveMemberResponse';
  member: Member;
};

export type RetractSignUpInput = {
  /** The event to retract the sign up for */
  eventId: Scalars['ID']['input'];
};

export type RetractSignUpResponse = {
  __typename?: 'RetractSignUpResponse';
  signUp: SignUp;
};

export type Role =
  /**
   * An admin of the organization, can do everything a member can,
   * # and can also manage members in the organization and delete the organization.
   */
  | 'ADMIN'
  /**
   * A member of the organization, can do everything except
   * manage members in the organization and delete the organization.
   */
  | 'MEMBER';

export type Semester =
  | 'AUTUMN'
  | 'SPRING';

export type SignUp = {
  __typename?: 'SignUp';
  /** The event the user signed up for */
  event: Event;
  id: Scalars['ID']['output'];
  /** The status of the user's participation in the event */
  participationStatus: ParticipationStatus;
  /** The user that signed up for the event */
  user: PublicUser;
};

export type SignUpInput = {
  /** The event to sign up for */
  eventId: Scalars['ID']['input'];
};

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  signUp: SignUp;
};

export type Status =
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'PENDING'
  | 'REJECTED';

export type UpdateBookingContactInput = {
  /** The email address of the booking contact, will be publicly available, pass the empty string to remove the email address */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The full name of the booking contact, will be publicly available, pass the empty string to remove the name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the booking contact, will be publicly available, pass the empty string to remove the phone number */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBookingContactResponse = {
  __typename?: 'UpdateBookingContactResponse';
  bookingContact: BookingContact;
};

export type UpdateBookingResponse = {
  __typename?: 'UpdateBookingResponse';
  booking: Booking;
};

export type UpdateBookingSemesterInput = {
  /** Whether or not bookings are enabled for this semester */
  bookingsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The end date for the booking period */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** There are only ever two semesters, so this is the ID of the semester to update. */
  semester: Semester;
  /** The start date for the booking period */
  startAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateBookingSemesterResponse = {
  __typename?: 'UpdateBookingSemesterResponse';
  bookingSemester: BookingSemester;
};

export type UpdateBookingStatusInput = {
  id: Scalars['ID']['input'];
  status: Status;
};

export type UpdateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The description of the listing, can be markdown. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateListingResponse = {
  __typename?: 'UpdateListingResponse';
  listing: Listing;
};

export type UpdateOrganizationInput = {
  /**
   * The new description of the organization, cannot exceed 10 000 characters
   * Omitting the value or passing null will leave the description unchanged
   */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the organization to update */
  id: Scalars['ID']['input'];
  /**
   * The new name of the organization
   * Omitting the value or passing null will leave the name unchanged
   */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationResponse = {
  __typename?: 'UpdateOrganizationResponse';
  organization: Organization;
};

export type UpdateUserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserResponse = {
  __typename?: 'UpdateUserResponse';
  user: PrivateUser;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<PrivateUser>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  total: Scalars['Int']['output'];
  users: Array<PrivateUser>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string } | null } };

export type LoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string } | null } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any>) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const MeDocument = new TypedDocumentString(`
    query me {
  user {
    user {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const LoggedInDocument = new TypedDocumentString(`
    query loggedIn {
  user {
    user {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<LoggedInQuery, LoggedInQueryVariables>;