const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundPage function", () => {
  describe("When it's invoked with a response", () => {
    test("Then it should call the response method status with a 404", async () => {
      const next = jest.fn();
      notFoundError(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given generalError function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a response", () => {
    test("Then it should call a response method with status code equal 500", () => {
      const error = {
        statuscode: 500,
        message: "General Error",
      };
      const expectedStatus = 500;
      const expectedMessage = { error: true, message: "General Error" };
      generalError(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
