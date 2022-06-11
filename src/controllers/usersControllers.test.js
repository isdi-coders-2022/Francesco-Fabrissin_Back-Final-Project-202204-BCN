const { mockUsers } = require("../mocks/mockUsers");
const User = require("../database/models/User");
const { getUsers } = require("./usersControllers");

jest.mock("../database/models/User", () => ({
  find: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnValue(mockUsers),
  count: jest.fn().mockReturnValue(8),
}));

describe("Given a getUsers function", () => {
  describe("When invoked", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const req = {
      query: {
        limit: 5,
        filter: "",
      },
    };
    test("Then it should call the response status method with 200", async () => {
      const expectedStatus = 200;

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response json method with the collections info", async () => {
      const collectionsInfo = mockUsers.map((user) => ({
        id: user.id,
        username: user.username,
        location: user.location,
        image: user.image,
        imageBackup: user.imageBackup,
        genre: user.records_collection.genre,
        records: user.records_collection.records,
      }));

      const expectedJsonResponse = {
        usersCollection: collectionsInfo,
        pages: 1,
      };

      await getUsers(req, res);

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
