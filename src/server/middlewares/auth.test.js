const auth = require("./auth");

const mockReq = { username: "fra432" };

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: () => mockReq,
}));

describe("Given an auth function", () => {
  describe("When invoked with a valid token", () => {
    const req = {
      headers: {
        authorization: "Bearer 12345",
      },
    };

    test("Then the next function should be invoked", () => {
      const next = jest.fn();

      auth(req, null, next);
    });

    test("Then the userId property should be added to the body object", () => {
      const next = () => {};

      auth(req, null, next);

      expect(req).toHaveProperty("username", mockReq.username);
    });
  });

  describe("When invoked with a token which doesn't containts 'Bearer'", () => {
    const req = {
      headers: {
        authorization: "NotBearer",
      },
    };

    test("Then the next function should be invoked with an error", () => {
      const expectedErrorMessage = "Bearer missing";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      auth(req, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When invoked an invalid token", () => {
    const req = {
      headers: {
        authorization: undefined,
      },
    };

    test("Then the next function should be invoked with an error", () => {
      const expectedErrorMessage = "Invalid token";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      auth(req, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
