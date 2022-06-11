const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
// const mockRecords = require("../mocks/mockRecords");
const { mockNewUsers } = require("../mocks/mockUsers");
const app = require("../server/index");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue("1234image.jpg"),
}));

beforeAll(async () => {
  await connectDB(process.env.MONGO_CONNECTION_TEST);
});

beforeEach(async () => {
  await User.create(mockNewUsers[0]);
  await User.create(mockNewUsers[1]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Given a POST/user/login endpoint", () => {
  describe("When it receives a request with a users present in the database", () => {
    test("Then it should respond with a 200 status and a token", async () => {
      const user = {
        username: "fra432",
        password: "fra432",
      };
      const {
        body: { token },
      } = await request(app).post("/user/login").send(user).expect(200);

      expect(token).not.toBeNull();
    });
  });

  describe("When it receives a request with a users not present in the database", () => {
    test("Then it should respond with a 403 status", async () => {
      const user = {
        username: "piero",
        password: "piero",
      };

      const expectedErrorMessage = "Bad request";

      const {
        body: { message },
      } = await request(app).post("/user/login").send(user).expect(403);

      expect(message).toBe(expectedErrorMessage);
    });
  });
});

describe("Given a GET/users endpoint", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should respond with a 200 status and an array of 2 users", async () => {
      const user = {
        username: "fra432",
        password: "fra432",
      };

      const {
        body: { token },
      } = await request(app).post("/user/login").send(user).expect(200);

      const {
        body: { usersCollection },
      } = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(usersCollection).toHaveLength(2);
    });
  });

  describe("When it receives a request with an invalid token", () => {
    test("Then it should respond with a 200 status and a list of users collections", async () => {
      const invalidToken = "no bearer";
      const expectedErrorMessage = "Bad request";

      const {
        body: { message },
      } = await request(app)
        .get("/users")
        .set("Authorization", invalidToken)
        .expect(401);

      expect(message).toBe(expectedErrorMessage);
    });
  });
});
