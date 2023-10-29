import crypto from "crypto";

import { User } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { FeideProvider } from "../../providers.js";
import { AuthService, UserService } from "../../service.js";
import { setupMockFeideClient } from "../__mocks__/feide.js";

import { OAuthCase } from "./interfaces.js";

const dummyUser = mockDeep<User>();

let mockUserService: DeepMockProxy<UserService>;

describe("OAuth", () => {
  beforeAll(() => {
    mockUserService = mockDeep<UserService>();
  });

  it("should generate a login url with PKCE params", () => {
    const authService = new AuthService(mockUserService, setupMockFeideClient({}), FeideProvider);
    const { url, codeChallenge } = authService.ssoUrl();
    expect(url).toContain(`code_challenge=${codeChallenge}`);
    expect(url).toContain("code_challenge_method=S256");
  });

  it("should generate a valid code challenge", () => {
    const authService = new AuthService(mockUserService, setupMockFeideClient({}), FeideProvider);
    const { codeChallenge, codeVerifier } = authService.ssoUrl();
    const expected = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
    expect(expected).toStrictEqual(codeChallenge);
  });

  const newUserCases: OAuthCase[] = [
    {
      name: "should create a new user if one does not exist",
      responses: {
        token: {
          status: 200,
          data: {
            access_token: "access_token",
            id_token: "id_token",
          },
        },
        userInfo: {
          status: 200,
          data: {
            sub: "feide_id",
            name: "first last",
            "dataporten-userid_sec": ["example@ntnu.no"],
            email: "example@example.com",
          },
        },
      },
      expected: {
        ...dummyUser,
        username: "example",
        feideId: "feide_id",
        id: "id",
        firstName: "first",
        lastName: "last",
        email: "example@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
    },
  ];
  test.each(newUserCases)("authentication - $name", async ({ responses, expected }) => {
    const authService = new AuthService(mockUserService, setupMockFeideClient({ responses }), FeideProvider);

    mockUserService.getByFeideID.mockReturnValueOnce(Promise.resolve(expected));
    mockUserService.login.mockReturnValueOnce(Promise.resolve(expected));

    const user = await authService.getUser({
      code: "code",
      codeVerifier: "verifier",
    });

    expect(user).toEqual(expected);
    expect(mockUserService.getByFeideID).toHaveBeenCalledWith(expected.feideId);
    expect(mockUserService.create).not.toHaveBeenCalled();
  });

  const existingUserCases: OAuthCase[] = [
    {
      name: "should fetch an existing user",
      responses: {
        token: {
          status: 200,
          data: {
            access_token: "access_token",
            id_token: "id_token",
          },
        },
        userInfo: {
          status: 200,
          data: {
            sub: "feide_id",
            name: "first last",
            "dataporten-userid_sec": ["existing@ntnu.no"],
            email: "existing@example.com",
          },
        },
      },
      expected: {
        ...dummyUser,
        username: "existing",
        feideId: "feide_id",
        id: "id",
        firstName: "first",
        lastName: "last",
        email: "existing@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        graduationYear: null,
        firstLogin: false,
        graduationYearUpdatedAt: null,
        allergies: "",
        phoneNumber: "40000000",
      },
    },
  ];
  test.each(existingUserCases)("authentication - $name", async ({ responses, expected }) => {
    const authService = new AuthService(mockUserService, setupMockFeideClient({ responses }), FeideProvider);

    mockUserService.getByFeideID.mockReturnValueOnce(Promise.resolve(null));
    mockUserService.create.mockReturnValueOnce(Promise.resolve(expected));

    const user = await authService.getUser({
      code: "code",
      codeVerifier: "verifier",
    });

    expect(user).toEqual(expected);
    expect(mockUserService.getByFeideID).toHaveBeenCalledWith((await expected).feideId);

    const { username, feideId, firstName, lastName, email } = expected;
    expect(mockUserService.create).toHaveBeenCalledWith({
      username,
      feideId,
      firstName,
      lastName,
      email,
    });
  });
});
