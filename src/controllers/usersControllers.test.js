const User = require("../database/models/User");
const mockRecords = require("../mocks/mockRecords");
const { mockUsers } = require("../mocks/mockUsers");
const { getUsers, getUserCollection } = require("./usersControllers");

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
        id: user.id,
        username: user.username,
        location: user.location,
        image: user.image,
        genre: user.records_collection.genre,
        records: user.records_collection.records,
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

describe("Given a getUserCollection controller", () => {
  const req = {
    params: {
      userId: 1,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with an id of a user present in the database and a valid token", () => {
    test("Then it should call the responses's status method with 200 and the json method with the user collection", async () => {
      const expectedStatus = 200;
      const expectedJsonResponse = {
        userInfo: {
          username: "fra432",
          image: "",
        },
        records: mockRecords,
      };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          username: "fra432",
          image: "",

          records_collection: {
            records: mockRecords,
          },
        }),
      }));

      await getUserCollection(req, res);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When invoked with an id of a user not present in the database", () => {
    test("Then it should call next receivd function with an error 'Collection not found'", async () => {
      const next = jest.fn();
      const expectedErrorMessage = "Collection not found";
      const error = new Error(expectedErrorMessage);

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(),
      }));

      await getUserCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
