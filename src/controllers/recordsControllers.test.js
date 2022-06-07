const path = require("path");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const mockRecords = require("../mocks/mockRecords");
const {
  addRecordToCollection,
  getCollection,
  deleteRecordFromCollection,
  editRecordFromCollection,
} = require("./recordsControllers");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue(true),
}));

describe("Given a getCollection function", () => {
  const req = {
    username: "fra432",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with a valid token", () => {
    test("Then it should call the response's status method with 200 and the json methos with an array of records", async () => {
      const expectedStatus = 200;
      const expectedJsonResponse = { records: mockRecords };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          records_collection: {
            records: mockRecords,
          },
        }),
      }));

      await getCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When invoked with an invalid token", () => {
    test("Then it should call the next received function", async () => {
      const next = jest.fn();

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(),
      }));

      await getCollection(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a addRecordToCollection controller", () => {
  const req = {
    body: mockRecords[0],
    file: {
      filename: "12798217782",
      originalname: "image.jpg",
    },
    userId: 3,
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  jest
    .spyOn(path, "join")
    .mockResolvedValueOnce("image")
    .mockReturnValueOnce(true)
    .mockResolvedValue(new Error());

  describe("When invoked with a new record with valid credentials in the request", () => {
    test("Then it should call the response's status method with 200 and the record added in the json method", async () => {
      const expectedStatus = 201;
      const user = {
        records_collection: {
          records: [],
        },
      };
      const expectedJsonResponse = mockRecords[0];

      Record.create = jest.fn().mockResolvedValue(mockRecords[0]);
      User.findById = jest.fn().mockResolvedValue(user);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await addRecordToCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        new_record: expectedJsonResponse,
      });
    });
  });

  describe("When invoked and the mongoose create method fails", () => {
    test("Then it should call the next received function with an error 'Unable to add new record'", async () => {
      const expectedErrorMessage = "Unable to add new record";
      const next = jest.fn();

      const expectedError = new Error(expectedErrorMessage);

      Record.create = jest.fn().mockRejectedValue();

      await addRecordToCollection(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When invoked and the file fails to rename", () => {
    test("Then it should call the next received'", async () => {
      const next = jest.fn();

      await addRecordToCollection(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteRecord controller", () => {
  const expectedStatus = 200;

  const req = {
    params: {
      recordId: 3,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with a record id corresponding to an existing records in the database in the req params", () => {
    Record.findByIdAndDelete = jest.fn().mockResolvedValue(mockRecords[0]);
    User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);
    test("Then it should call the response's status method with 200", async () => {
      await deleteRecordFromCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
  test("Then it should call the response's json method with the deleted record", async () => {
    const expectedJsonResponse = {
      deleted_record: mockRecords[0],
    };

    await deleteRecordFromCollection(req, res);

    expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
  });

  describe("When invoked with a record id not corresponding to an existing records in the database", () => {
    test("Then it should call the next received function with ", async () => {
      const expectedErrorMessage = "Record id not found";
      const next = jest.fn();

      const expectedError = new Error(expectedErrorMessage);

      Record.findByIdAndDelete = jest.fn().mockResolvedValue(false);

      await deleteRecordFromCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a editRecordFromCollection controller", () => {
  describe("When it receives a request with a record id present in the db and the record updated in the body", () => {
    test("Then it should call the response's status method  with 200 and the record updated in the json method", async () => {
      const req = {
        params: {
          recordId: "1",
        },
        body: mockRecords[0],
        file: {
          filename: "12798217782",
          originalname: "image.jpg",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 200;
      const expectedJsonResponse = {
        updatedRecord: mockRecords[0],
      };

      jest.spyOn(path, "join").mockResolvedValue("image");

      Record.findByIdAndUpdate = jest.fn().mockReturnValue(mockRecords[0]);

      await editRecordFromCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a record id not present in the db", () => {
    test("Then it should call the next received function with an error 'Id not found, could not update the record'", async () => {
      const expectedErrorMessage = "Id not found, could not update the record";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      jest.spyOn(path, "join").mockResolvedValue("image");

      Record.findByIdAndUpdate = jest.fn().mockRejectedValue();

      await editRecordFromCollection(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
