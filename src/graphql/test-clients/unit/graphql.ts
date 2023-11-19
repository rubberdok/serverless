/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type Cabin = {
  __typename?: 'Cabin';
  externalPrice: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CreateEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  spots?: InputMaybe<Scalars['Int']['input']>;
  startAt: Scalars['DateTime']['input'];
};

export type CreateEventResponse = {
  __typename?: 'CreateEventResponse';
  event: Event;
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

export type Event = {
  __typename?: 'Event';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  events: Array<Event>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID']['output'];
  /** The organization the member is a member of */
  organization: Organization;
  /** The role of the member in the organization */
  role: Role;
  /** The user that is a member of the organization */
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a member to the organization */
  addMember: AddMemberResponse;
  createEvent: CreateEventResponse;
  /** Create a new organization, and add the current user as an admin of the organization. */
  createOrganization: CreateOrganizationResponse;
  newBooking: Booking;
  /** Remove a member from the organization by the ID of the membership. */
  removeMember: RemoveMemberResponse;
  updateBookingStatus: Booking;
  /**
   * Update an organization with the given name and description.
   * Passing null or omitting a value will leave the value unchanged.
   */
  updateOrganization: UpdateOrganizationResponse;
  updateUser: User;
};


export type MutationAddMemberArgs = {
  data: AddMemberInput;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRemoveMemberArgs = {
  data: RemoveMemberInput;
};


export type MutationUpdateBookingStatusArgs = {
  data: UpdateBookingStatusInput;
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['ID']['input'];
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

export type Organization = {
  __typename?: 'Organization';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The members of the organization */
  members: Array<Member>;
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  user: UserResponse;
  users: UsersResponse;
};

export type RemoveMemberInput = {
  id: Scalars['ID']['input'];
};

export type RemoveMemberResponse = {
  __typename?: 'RemoveMemberResponse';
  member: Member;
};

export enum Role {
  /**
   * An admin of the organization, can do everything a member can,
   * # and can also manage members in the organization and delete the organization.
   */
  Admin = 'ADMIN',
  /**
   * A member of the organization, can do everything except
   * manage members in the organization and delete the organization.
   */
  Member = 'MEMBER'
}

export enum Status {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type UpdateBookingStatusInput = {
  id: Scalars['ID']['input'];
  status: Status;
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
  firstName: Scalars['String']['input'];
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  allergies?: Maybe<Scalars['String']['output']>;
  canUpdateYear: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  graduationYear?: Maybe<Scalars['Int']['output']>;
  graduationYearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  total: Scalars['Int']['output'];
  users: Array<User>;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersResponse', total: number, users: Array<{ __typename?: 'User', id: string }> } };

export type CreateOrganization1MutationVariables = Exact<{ [key: string]: never; }>;


export type CreateOrganization1Mutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'CreateOrganizationResponse', organization: { __typename?: 'Organization', id: string } } };

export type CreateOrganizationMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'CreateOrganizationResponse', organization: { __typename?: 'Organization', id: string, name: string } } };

export type UpdateOrganization1MutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateOrganization1Mutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'UpdateOrganizationResponse', organization: { __typename?: 'Organization', id: string } } };

export type UpdateOrganization2MutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateOrganization2Mutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'UpdateOrganizationResponse', organization: { __typename?: 'Organization', id: string, name: string } } };

export type AddMember1MutationVariables = Exact<{ [key: string]: never; }>;


export type AddMember1Mutation = { __typename?: 'Mutation', addMember: { __typename?: 'AddMemberResponse', member: { __typename?: 'Member', id: string, organization: { __typename?: 'Organization', members: Array<{ __typename?: 'Member', id: string }> } } } };

export type AddMember2MutationVariables = Exact<{ [key: string]: never; }>;


export type AddMember2Mutation = { __typename?: 'Mutation', addMember: { __typename?: 'AddMemberResponse', member: { __typename?: 'Member', id: string, organization: { __typename?: 'Organization', id: string, members: Array<{ __typename?: 'Member', id: string }> } } } };

export type RemoveMember1MutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveMember1Mutation = { __typename?: 'Mutation', removeMember: { __typename?: 'RemoveMemberResponse', member: { __typename?: 'Member', id: string, organization: { __typename?: 'Organization', members: Array<{ __typename?: 'Member', id: string }> } } } };

export type RemoveMember2MutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveMember2Mutation = { __typename?: 'Mutation', removeMember: { __typename?: 'RemoveMemberResponse', member: { __typename?: 'Member', id: string, organization: { __typename?: 'Organization', id: string, members: Array<{ __typename?: 'Member', id: string }> } } } };


export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const CreateOrganization1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrganization1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrganization1Mutation, CreateOrganization1MutationVariables>;
export const CreateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const UpdateOrganization1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrganization1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"id","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganization1Mutation, UpdateOrganization1MutationVariables>;
export const UpdateOrganization2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrganization2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"id","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganization2Mutation, UpdateOrganization2MutationVariables>;
export const AddMember1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addMember1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"user","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"StringValue","value":"org","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddMember1Mutation, AddMember1MutationVariables>;
export const AddMember2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addMember2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"user","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"StringValue","value":"org","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddMember2Mutation, AddMember2MutationVariables>;
export const RemoveMember1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeMember1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"id","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveMember1Mutation, RemoveMember1MutationVariables>;
export const RemoveMember2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeMember2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"id","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveMember2Mutation, RemoveMember2MutationVariables>;