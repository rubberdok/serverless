import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, Cabin as CabinModel, Booking as BookingModel, Organization as OrganizationModel, Member as MemberModel } from '@prisma/client';
import { IContext } from '@/lib/apolloServer.js';

/* eslint-disable */
/* prettier-ignore */

/**
 * This file was automatically generated by 'graphql-codegen'.
 * Please do not edit this file directly.
 */
            
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
};

export type AddMemberInput = {
  /** The ID of the organization to add the user to */
  readonly organizationId: Scalars['ID']['input'];
  /** The role of the user in the organization, defaults to Role.MEMBER */
  readonly role?: InputMaybe<Role>;
  /** The ID of the user to add to the organization */
  readonly userId: Scalars['ID']['input'];
};

export type AddMemberResponse = {
  readonly __typename?: 'AddMemberResponse';
  readonly member: Member;
};

export type Booking = {
  readonly __typename?: 'Booking';
  readonly cabin: Cabin;
  readonly email: Scalars['String']['output'];
  readonly endDate: Scalars['DateTime']['output'];
  readonly firstName: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly lastName: Scalars['String']['output'];
  readonly phoneNumber: Scalars['String']['output'];
  readonly startDate: Scalars['DateTime']['output'];
  readonly status: Status;
};

export type Cabin = {
  readonly __typename?: 'Cabin';
  readonly externalPrice: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly internalPrice: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
};

export type CreateOrganizationInput = {
  /** The description of the organization, cannot exceed 10 000 characters */
  readonly description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the organization, must be unique and between 1 and 100 characters */
  readonly name: Scalars['String']['input'];
};

export type CreateOrganizationResponse = {
  readonly __typename?: 'CreateOrganizationResponse';
  readonly organization: Organization;
};

export type LogoutResponse = {
  readonly __typename?: 'LogoutResponse';
  readonly status: LogoutStatus;
};

export const LogoutStatus = {
  Error: 'ERROR',
  Success: 'SUCCESS'
} as const;

export type LogoutStatus = typeof LogoutStatus[keyof typeof LogoutStatus];
export type Member = {
  readonly __typename?: 'Member';
  readonly id: Scalars['ID']['output'];
  readonly organization: Organization;
  readonly role: Role;
  readonly user: User;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  /** Add a member to the organization */
  readonly addMember: AddMemberResponse;
  readonly authenticate: UserResponse;
  /** Create a new organization, and add the current user as an admin of the organization. */
  readonly createOrganization: CreateOrganizationResponse;
  readonly createUser?: Maybe<User>;
  readonly logout: LogoutResponse;
  readonly newBooking: Booking;
  readonly redirectUrl: RedirectUrlResponse;
  /** Remove a member from the organization by the ID of the membership. */
  readonly removeMember: RemoveMemberResponse;
  readonly updateBookingStatus: Booking;
  /**
   * Update an organization with the given name and description.
   * Passing null or omitting a value will leave the value unchanged.
   */
  readonly updateOrganization: UpdateOrganizationResponse;
  readonly updateUser: User;
};


export type MutationAddMemberArgs = {
  data: AddMemberInput;
};


export type MutationAuthenticateArgs = {
  code: Scalars['String']['input'];
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationCreateUserArgs = {
  firstName: Scalars['String']['input'];
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRedirectUrlArgs = {
  state?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveMemberArgs = {
  data: RemoveMemberInput;
};


export type MutationUpdateBookingStatusArgs = {
  id: Scalars['ID']['input'];
  status: Status;
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['ID']['input'];
};

export type NewBookingInput = {
  readonly cabinId: Scalars['ID']['input'];
  readonly email: Scalars['String']['input'];
  readonly endDate: Scalars['DateTime']['input'];
  readonly firstName: Scalars['String']['input'];
  readonly lastName: Scalars['String']['input'];
  readonly phoneNumber: Scalars['String']['input'];
  readonly startDate: Scalars['DateTime']['input'];
};

export type Organization = {
  readonly __typename?: 'Organization';
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly members: ReadonlyArray<Member>;
  readonly name: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly user: UserResponse;
  readonly users: UsersResponse;
};

export type RedirectUrlResponse = {
  readonly __typename?: 'RedirectUrlResponse';
  readonly url: Scalars['String']['output'];
};

export type RemoveMemberInput = {
  readonly id: Scalars['ID']['input'];
};

export type RemoveMemberResponse = {
  readonly __typename?: 'RemoveMemberResponse';
  readonly member: Member;
};

export const Role = {
  /**
   * An admin of the organization, can do everything a member can,
   * # and can also manage members in the organization and delete the organization.
   */
  Admin: 'ADMIN',
  /**
   * A member of the organization, can do everything except
   * manage members in the organization and delete the organization.
   */
  Member: 'MEMBER'
} as const;

export type Role = typeof Role[keyof typeof Role];
export const Status = {
  Cancelled: 'CANCELLED',
  Confirmed: 'CONFIRMED',
  Pending: 'PENDING',
  Rejected: 'REJECTED'
} as const;

export type Status = typeof Status[keyof typeof Status];
export type UpdateOrganizationInput = {
  /**
   * The new description of the organization, cannot exceed 10 000 characters
   * Omitting the value or passing null will leave the description unchanged
   */
  readonly description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the organization to update */
  readonly id: Scalars['ID']['input'];
  /**
   * The new name of the organization
   * Omitting the value or passing null will leave the name unchanged
   */
  readonly name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationResponse = {
  readonly __typename?: 'UpdateOrganizationResponse';
  readonly organization: Organization;
};

export type UpdateUserInput = {
  readonly allergies?: InputMaybe<Scalars['String']['input']>;
  readonly firstName: Scalars['String']['input'];
  readonly graduationYear?: InputMaybe<Scalars['Int']['input']>;
  readonly lastName: Scalars['String']['input'];
  readonly phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  readonly __typename?: 'User';
  readonly allergies?: Maybe<Scalars['String']['output']>;
  readonly canUpdateYear: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['String']['output'];
  readonly firstLogin: Scalars['Boolean']['output'];
  readonly firstName: Scalars['String']['output'];
  readonly graduationYear?: Maybe<Scalars['Int']['output']>;
  readonly graduationYearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly lastName: Scalars['String']['output'];
  readonly phoneNumber?: Maybe<Scalars['String']['output']>;
  readonly username: Scalars['String']['output'];
};

export type UserResponse = {
  readonly __typename?: 'UserResponse';
  readonly user?: Maybe<User>;
};

export type UsersResponse = {
  readonly __typename?: 'UsersResponse';
  readonly total: Scalars['Int']['output'];
  readonly users: ReadonlyArray<User>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddMemberInput: AddMemberInput;
  AddMemberResponse: ResolverTypeWrapper<Omit<AddMemberResponse, 'member'> & { member: ResolversTypes['Member'] }>;
  Booking: ResolverTypeWrapper<BookingModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Cabin: ResolverTypeWrapper<CabinModel>;
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOrganizationResponse: ResolverTypeWrapper<Omit<CreateOrganizationResponse, 'organization'> & { organization: ResolversTypes['Organization'] }>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LogoutResponse: ResolverTypeWrapper<LogoutResponse>;
  LogoutStatus: LogoutStatus;
  Member: ResolverTypeWrapper<MemberModel>;
  Mutation: ResolverTypeWrapper<{}>;
  NewBookingInput: NewBookingInput;
  Organization: ResolverTypeWrapper<OrganizationModel>;
  Query: ResolverTypeWrapper<{}>;
  RedirectUrlResponse: ResolverTypeWrapper<RedirectUrlResponse>;
  RemoveMemberInput: RemoveMemberInput;
  RemoveMemberResponse: ResolverTypeWrapper<Omit<RemoveMemberResponse, 'member'> & { member: ResolversTypes['Member'] }>;
  Role: Role;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationResponse: ResolverTypeWrapper<Omit<UpdateOrganizationResponse, 'organization'> & { organization: ResolversTypes['Organization'] }>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserModel>;
  UserResponse: ResolverTypeWrapper<Omit<UserResponse, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  UsersResponse: ResolverTypeWrapper<Omit<UsersResponse, 'users'> & { users: ReadonlyArray<ResolversTypes['User']> }>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddMemberInput: AddMemberInput;
  AddMemberResponse: Omit<AddMemberResponse, 'member'> & { member: ResolversParentTypes['Member'] };
  Booking: BookingModel;
  Boolean: Scalars['Boolean']['output'];
  Cabin: CabinModel;
  CreateOrganizationInput: CreateOrganizationInput;
  CreateOrganizationResponse: Omit<CreateOrganizationResponse, 'organization'> & { organization: ResolversParentTypes['Organization'] };
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LogoutResponse: LogoutResponse;
  Member: MemberModel;
  Mutation: {};
  NewBookingInput: NewBookingInput;
  Organization: OrganizationModel;
  Query: {};
  RedirectUrlResponse: RedirectUrlResponse;
  RemoveMemberInput: RemoveMemberInput;
  RemoveMemberResponse: Omit<RemoveMemberResponse, 'member'> & { member: ResolversParentTypes['Member'] };
  String: Scalars['String']['output'];
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationResponse: Omit<UpdateOrganizationResponse, 'organization'> & { organization: ResolversParentTypes['Organization'] };
  UpdateUserInput: UpdateUserInput;
  User: UserModel;
  UserResponse: Omit<UserResponse, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  UsersResponse: Omit<UsersResponse, 'users'> & { users: ReadonlyArray<ResolversParentTypes['User']> };
}>;

export type AddMemberResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['AddMemberResponse'] = ResolversParentTypes['AddMemberResponse']> = ResolversObject<{
  member?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookingResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Booking'] = ResolversParentTypes['Booking']> = ResolversObject<{
  cabin?: Resolver<ResolversTypes['Cabin'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CabinResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Cabin'] = ResolversParentTypes['Cabin']> = ResolversObject<{
  externalPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  internalPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateOrganizationResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['CreateOrganizationResponse'] = ResolversParentTypes['CreateOrganizationResponse']> = ResolversObject<{
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type LogoutResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['LogoutResponse'] = ResolversParentTypes['LogoutResponse']> = ResolversObject<{
  status?: Resolver<ResolversTypes['LogoutStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addMember?: Resolver<ResolversTypes['AddMemberResponse'], ParentType, ContextType, RequireFields<MutationAddMemberArgs, 'data'>>;
  authenticate?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'code'>>;
  createOrganization?: Resolver<ResolversTypes['CreateOrganizationResponse'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'data'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'firstName'>>;
  logout?: Resolver<ResolversTypes['LogoutResponse'], ParentType, ContextType>;
  newBooking?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationNewBookingArgs, 'data'>>;
  redirectUrl?: Resolver<ResolversTypes['RedirectUrlResponse'], ParentType, ContextType, Partial<MutationRedirectUrlArgs>>;
  removeMember?: Resolver<ResolversTypes['RemoveMemberResponse'], ParentType, ContextType, RequireFields<MutationRemoveMemberArgs, 'data'>>;
  updateBookingStatus?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationUpdateBookingStatusArgs, 'id' | 'status'>>;
  updateOrganization?: Resolver<ResolversTypes['UpdateOrganizationResponse'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'data'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'id'>>;
}>;

export type OrganizationResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<ReadonlyArray<ResolversTypes['Member']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UsersResponse'], ParentType, ContextType>;
}>;

export type RedirectUrlResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['RedirectUrlResponse'] = ResolversParentTypes['RedirectUrlResponse']> = ResolversObject<{
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveMemberResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['RemoveMemberResponse'] = ResolversParentTypes['RemoveMemberResponse']> = ResolversObject<{
  member?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateOrganizationResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['UpdateOrganizationResponse'] = ResolversParentTypes['UpdateOrganizationResponse']> = ResolversObject<{
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  allergies?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canUpdateYear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstLogin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  graduationYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  graduationYearUpdatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersResponseResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['UsersResponse'] = ResolversParentTypes['UsersResponse']> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users?: Resolver<ReadonlyArray<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = IContext> = ResolversObject<{
  AddMemberResponse?: AddMemberResponseResolvers<ContextType>;
  Booking?: BookingResolvers<ContextType>;
  Cabin?: CabinResolvers<ContextType>;
  CreateOrganizationResponse?: CreateOrganizationResponseResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  LogoutResponse?: LogoutResponseResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RedirectUrlResponse?: RedirectUrlResponseResolvers<ContextType>;
  RemoveMemberResponse?: RemoveMemberResponseResolvers<ContextType>;
  UpdateOrganizationResponse?: UpdateOrganizationResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  UsersResponse?: UsersResponseResolvers<ContextType>;
}>;

