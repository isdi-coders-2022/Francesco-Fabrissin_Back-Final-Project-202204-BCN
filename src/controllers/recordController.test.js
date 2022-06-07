const Record = require("../database/models/Record");
const mockRecords = require("../mocks/mockRecords");
const getRecordById = require("./recordControllers");

describe("Given a getRecordById function", () => {
  const req = {
    params: {
      recordId: "1",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with a valid token and a existent record id in the request params", () => {
    test("Then it should call the response's status method with 200 and the json method with the info of the record", async () => {
      const expectedStatus = 200;
      const expectedJsonResponse = { recordInfo: mockRecords[0] };

      Record.findById = jest.fn().mockResolvedValue(mockRecords[0]);

      await getRecordById(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When invoked with a valid token and a existent record id in the request params", () => {
    test("Then it should call the response's status method with 200 and the json method with the info of the record", async () => {
      const expectedErrorMessage = "Id not found";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      Record.findById = jest.fn().mockResolvedValue(mockRecords[0]);

      await getRecordById(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
