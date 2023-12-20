import assert from "assert";
import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import {
  InvalidArgumentError,
  KnownDomainError,
  PermissionDeniedError,
} from "~/domain/errors.js";
import { Role } from "~/domain/organizations.js";
import prisma from "~/lib/prisma.js";
import { MemberRepository } from "~/repositories/organizations/members.js";
import { OrganizationRepository } from "~/repositories/organizations/organizations.js";
import { UserRepository } from "~/repositories/users/index.js";
import { PermissionService } from "~/services/permissions/service.js";
import { OrganizationService } from "../../service.js";

let organizationService: OrganizationService;

describe("OrganizationsService", () => {
  beforeAll(async () => {
    const userRepository = new UserRepository(prisma);
    const memberRepository = new MemberRepository(prisma);
    const organizationRepository = new OrganizationRepository(prisma);
    const permissionService = new PermissionService(
      memberRepository,
      userRepository,
      organizationRepository,
    );
    organizationService = new OrganizationService(
      organizationRepository,
      memberRepository,
      permissionService,
    );
  });

  describe("removeMember", () => {
    describe("should remove if:", () => {
      interface TestCase {
        name: string;
        arrange: {
          user: Prisma.UserCreateInput;
          organization: Prisma.OrganizationCreateInput;
          member: { role: Role };
          members: { userId: string; role: Role }[];
        };
        act: {
          memberIndex: number;
        };
        expected: { role: Role };
      }

      const selfId = faker.string.uuid();

      const testCases: TestCase[] = [
        {
          name: "removing a member from an organization as an admin",
          arrange: {
            user: {
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.ADMIN,
            },
            members: [
              {
                userId: faker.string.uuid(),
                role: Role.MEMBER,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: {
            role: Role.MEMBER,
          },
        },
        {
          name: "removing a member from an organization as a super user",
          arrange: {
            user: {
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
              isSuperUser: true,
            },
            organization: {
              name: faker.string.sample(),
            },
            member: {
              role: Role.MEMBER,
            },
            members: [
              {
                userId: faker.string.uuid(),
                role: Role.MEMBER,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: {
            role: Role.MEMBER,
          },
        },
        {
          name: "removing an admin from an organization as an admin, and with at least one other admin in the organization",
          arrange: {
            user: {
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.ADMIN,
            },
            members: [
              {
                userId: faker.string.uuid(),
                role: Role.ADMIN,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: {
            role: Role.ADMIN,
          },
        },
        {
          name: "leaving the organization as a member",
          arrange: {
            user: {
              id: selfId,
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.MEMBER,
            },
            members: [
              {
                userId: selfId,
                role: Role.MEMBER,
              },
              {
                userId: faker.string.uuid(),
                role: Role.ADMIN,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: {
            role: Role.MEMBER,
          },
        },
      ];

      test.concurrent.each(testCases)(
        "$name",
        async ({ arrange, act, expected }) => {
          /**
           * Arrange
           *
           * 1. Create a user with userId {userId} based on the arrange.user object
           * which is the user making the request
           * 2. Create an organization with organizationId {organizationId} based on the arrange.organization object
           * which is the organization with members, including the user making the request
           * 3. Create a member with userId {userId} and organizationId {organizationId} based on the arrange.member object
           * for the user making the request
           * 4. Create a set of members with userIds in the organization with {organizationId}
           */
          // 1.
          const userMakingRequest = await prisma.user.create({
            data: arrange.user,
          });

          // 2.
          const organization = await prisma.organization.create({
            data: arrange.organization,
          });

          // 3.
          await prisma.member.create({
            data: {
              role: arrange.member.role,
              userId: userMakingRequest.id,
              organizationId: organization.id,
            },
          });

          // 4.
          const members = await Promise.all(
            arrange.members.map(async (member) => {
              return prisma.member.upsert({
                where: {
                  userId_organizationId: {
                    userId: member.userId,
                    organizationId: organization.id,
                  },
                },
                create: {
                  user: {
                    create: {
                      id: member.userId,
                      email: faker.internet.email(),
                      feideId: faker.string.uuid(),
                      firstName: faker.person.firstName(),
                      lastName: faker.person.lastName(),
                      username: faker.string.sample(20),
                    },
                  },
                  role: member.role,
                  organization: {
                    connect: {
                      id: organization.id,
                    },
                  },
                },
                update: {},
              });
            }),
          );

          /**
           * Act
           *
           * 1. Call the removeMember method on the organizationService with the userId and organizationId
           */
          const userToRemove = members[act.memberIndex];
          assert(
            typeof userToRemove !== "undefined",
            "The user to remove must be defined",
          );

          const result = organizationService.removeMember(
            userMakingRequest.id,
            {
              userId: userToRemove.userId,
              organizationId: organization.id,
            },
          );

          await expect(result).resolves.toEqual({
            id: userToRemove.id,
            organizationId: organization.id,
            userId: userToRemove.userId,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            ...expected,
          });
        },
      );
    });

    describe("should raise:", () => {
      interface TestCase {
        name: string;
        arrange: {
          user: Prisma.UserCreateInput;
          organization: Prisma.OrganizationCreateInput;
          member: { role: Role };
          members: { userId: string; role: Role }[];
        };
        act: {
          memberIndex: number;
        };
        expected: typeof KnownDomainError;
      }

      const selfId = faker.string.uuid();

      const testCases: TestCase[] = [
        {
          name: "if removing another member from an organization as a member",
          arrange: {
            user: {
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.MEMBER,
            },
            members: [
              {
                userId: faker.string.uuid(),
                role: Role.MEMBER,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: PermissionDeniedError,
        },
        {
          name: "if removing an admin from an organization as a member",
          arrange: {
            user: {
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.MEMBER,
            },
            members: [
              {
                userId: faker.string.uuid(),
                role: Role.ADMIN,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: PermissionDeniedError,
        },
        {
          name: "leaving the organization as the only remaining admin",
          arrange: {
            user: {
              id: selfId,
              email: faker.internet.email(),
              feideId: faker.string.uuid(),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              username: faker.string.sample(20),
            },
            organization: {
              name: faker.string.sample(20),
            },
            member: {
              role: Role.ADMIN,
            },
            members: [
              {
                userId: selfId,
                role: Role.ADMIN,
              },
              {
                userId: faker.string.uuid(),
                role: Role.MEMBER,
              },
            ],
          },
          act: {
            memberIndex: 0,
          },
          expected: InvalidArgumentError,
        },
      ];

      test.concurrent.each(testCases)(
        "$expected.name $name",
        async ({ arrange, act, expected }) => {
          /**
           * Arrange
           *
           * 1. Create a user with userId {userId} based on the arrange.user object
           * which is the user making the request
           * 2. Create an organization with organizationId {organizationId} based on the arrange.organization object
           * which is the organization with members, including the user making the request
           * 3. Create a member with userId {userId} and organizationId {organizationId} based on the arrange.member object
           * for the user making the request
           * 4. Create a set of members with userIds in the organization with {organizationId}
           */
          // 1.
          const userMakingRequest = await prisma.user.create({
            data: arrange.user,
          });

          // 2.
          const organization = await prisma.organization.create({
            data: arrange.organization,
          });

          // 3.
          await prisma.member.create({
            data: {
              role: arrange.member.role,
              userId: userMakingRequest.id,
              organizationId: organization.id,
            },
          });

          // 4.
          const members = await Promise.all(
            arrange.members.map(async (member) => {
              return prisma.member.upsert({
                where: {
                  userId_organizationId: {
                    userId: member.userId,
                    organizationId: organization.id,
                  },
                },
                create: {
                  user: {
                    create: {
                      id: member.userId,
                      email: faker.internet.email(),
                      feideId: faker.string.uuid(),
                      firstName: faker.person.firstName(),
                      lastName: faker.person.lastName(),
                      username: faker.string.sample(20),
                    },
                  },
                  role: member.role,
                  organization: {
                    connect: {
                      id: organization.id,
                    },
                  },
                },
                update: {},
              });
            }),
          );

          /**
           * Act
           *
           * 1. Call the removeMember method on the organizationService with the userId and organizationId
           */
          const userToRemove = members[act.memberIndex];
          assert(
            typeof userToRemove !== "undefined",
            "The user to remove must be defined",
          );

          const result = organizationService.removeMember(
            userMakingRequest.id,
            {
              userId: userToRemove.userId,
              organizationId: organization.id,
            },
          );

          await expect(result).rejects.toThrow(expected);
        },
      );
    });
  });
});
