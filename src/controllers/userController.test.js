const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../database/models/User");
const mockUsers = require("../mocks/mockUsers");
const userLogin = require("./userControllers");

const mockToken = "token";

describe("Given a userLogin function", () => {
  const req = {
    body: mockUsers[0],
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When it receives a request with a user present in the database", () => {
    User.findOne = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jsonwebtoken.sign = jest.fn().mockReturnValue(mockToken);
    test("Then it should call the status response's method with 200", async () => {
      const expectedStatus = 200;

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the json response's method with a token", async () => {
      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe("When it receives a request with a user not present in the database", () => {
    const next = jest.fn();

    test("Then it should call the received next function with a 'Username or password incorrect' error", async () => {
      const expectedErrorMessage = "Username or password incorrect";

      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      const expectedError = new Error(expectedErrorMessage);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a user already present in the database but with the wrong password", () => {
    const next = jest.fn();

    test("Then it should call the received next function with a 'Password incorrect", async () => {
      const expectedErrorMessage = "Password incorrect";

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      const expectedError = new Error(expectedErrorMessage);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
