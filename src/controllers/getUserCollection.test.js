const User = require("../database/models/User");
const mockRecords = require("../mocks/mockRecords");
const { getUserCollection } = require("./usersControllers");

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
