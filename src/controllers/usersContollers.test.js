const User = require("../database/models/User");
const mockUsers = require("../mocks/mockUsers");
const { getUsers } = require("./usersControllers");

describe("Given a getUsers function", () => {
  describe("When invoked", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    test("Then it should call the response status method with 200", async () => {
      const expectedStatus = 200;

      User.find = jest.fn().mockResolvedValue(mockUsers);

      await getUsers(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response status method with 200", async () => {
      const collectionsInfo = mockUsers.map((user) => ({
        username: user.username,
        location: user.location,
        image: user.image,
        genre: user.records_collection.genre,
      }));

      const expectedJsonResponse = {
        usersCollection: collectionsInfo,
      };

      User.find = jest.fn().mockResolvedValue(mockUsers);

      await getUsers(null, res);

      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When invoked and the User.find method fails", () => {
    test("Then it should call the next received function", async () => {
      const next = jest.fn();

      User.find = jest.fn().mockRejectedValue();

      await getUsers(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
