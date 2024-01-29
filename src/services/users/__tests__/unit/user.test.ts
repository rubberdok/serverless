import { jest } from "@jest/globals";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { type DeepMockProxy, mock, mockDeep } from "jest-mock-extended";
import type { User } from "~/domain/users.js";
import type { EmailQueueType } from "~/services/mail/worker.js";
import {
	type PermissionService,
	type UserRepository,
	UserService,
} from "../../service.js";

const dummyUser = mockDeep<User>();

const time = new Date(`${dayjs().year() + 1}-01-01`);

let service: UserService;
let repo: DeepMockProxy<UserRepository>;
let permissionService: DeepMockProxy<PermissionService>;

beforeAll(() => {
	repo = mockDeep<UserRepository>();
	permissionService = mockDeep<PermissionService>();
	service = new UserService(
		repo,
		permissionService,
		mockDeep<EmailQueueType>(),
	);

	jest.useFakeTimers().setSystemTime(time);
});

describe("UserService", () => {
	interface TestCase {
		name: string;
		input: Partial<{
			firstName: string | null;
			graduationYear: number | null;
		}>;
		updateInput: Partial<Prisma.UserUpdateInput>;
		existing: User;
		expected: User;
	}

	const testCases: TestCase[] = [
		{
			name: "set firstLogin to false",
			input: {
				firstName: "test",
			},
			updateInput: {
				firstName: "test",
				firstLogin: false,
			},
			existing: {
				...dummyUser,
				id: "1",
				firstLogin: true,
			},
			expected: {
				...dummyUser,
				firstName: "test",
				firstLogin: false,
			},
		},
		{
			name: "not set `graduationYearUpdatedAt` on first login",
			input: {
				graduationYear: dayjs().year() + 1,
			},
			updateInput: {
				firstLogin: false,
				graduationYear: dayjs().year() + 1,
			},
			existing: {
				...dummyUser,
				id: "1",
				firstLogin: true,
				graduationYear: null,
				graduationYearUpdatedAt: null,
			},
			expected: {
				...dummyUser,
				graduationYearUpdatedAt: null,
				graduationYear: dayjs().year() + 1,
			},
		},
		{
			name: "set `graduationYearUpdatedAt` on on graduation year update",
			input: {
				graduationYear: dayjs().year() + 1,
			},
			updateInput: {
				graduationYear: dayjs().year() + 1,
				graduationYearUpdatedAt: time,
			},
			existing: {
				...dummyUser,
				id: "1",
				firstLogin: false,
				graduationYear: null,
				graduationYearUpdatedAt: null,
			},
			expected: {
				...dummyUser,
				graduationYearUpdatedAt: time,
				graduationYear: dayjs().year() + 1,
			},
		},
		{
			name: "disallow updating graduation year within one year",
			input: {
				graduationYear: dayjs().year() + 1,
			},
			updateInput: {},
			existing: {
				...dummyUser,
				id: "1",
				firstLogin: false,
				graduationYear: dayjs().year(),
				graduationYearUpdatedAt: dayjs(time)
					.subtract(1, "year")
					.add(1, "minute")
					.toDate(),
			},
			expected: {
				...dummyUser,
				graduationYearUpdatedAt: time,
				graduationYear: dayjs().year(),
			},
		},
		{
			name: "update `graduationYearUpdatedAt` if changed after one year",
			input: {
				graduationYear: dayjs().year() + 1,
			},
			updateInput: {
				graduationYear: dayjs().year() + 1,
				graduationYearUpdatedAt: time,
			},
			existing: {
				...dummyUser,
				id: "1",
				firstLogin: false,
				graduationYear: dayjs().year(),
				graduationYearUpdatedAt: dayjs(time)
					.subtract(1, "year")
					.subtract(1, "minute")
					.toDate(),
			},
			expected: {
				...dummyUser,
				graduationYearUpdatedAt: time,
				graduationYear: dayjs().year() + 1,
			},
		},
	];

	test.each(testCases)(
		"should $name",
		async ({ existing, expected, input, updateInput }) => {
			repo.get.mockReturnValueOnce(Promise.resolve(existing));
			repo.update.mockReturnValueOnce(Promise.resolve(expected));
			permissionService.isSuperUser.mockResolvedValue({ isSuperUser: false });

			await service.update(existing.id, input);

			expect(repo.get).toHaveBeenCalledWith(existing.id);
			expect(repo.update).toHaveBeenCalledWith(existing.id, updateInput);
		},
	);

	it("logging in should set lastLogin", async () => {
		repo.update.mockReturnValueOnce(
			Promise.resolve(mock<User>({ graduationYearUpdatedAt: null })),
		);

		await service.login(dummyUser.id);

		expect(repo.update).toHaveBeenCalledWith(dummyUser.id, { lastLogin: time });
	});
});
