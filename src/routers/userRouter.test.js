const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
const mockUsers = require("../mocks/mockUsers");
const app = require("../server/index");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: jest.fn().mockReturnValue("1234image.jpg"),
}));

beforeAll(async () => {
  await connectDB(process.env.MONGO_CONNECTION_TEST);
});

beforeEach(async () => {
  await User.create(mockUsers[0]);
  await User.create(mockUsers[1]);
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

describe("Given a POST/user/register endpoint", () => {
  describe("When it receives a request with wrong user credentials", () => {
    test("Then it should respond with a 400 status and a 'Bad request error message'", async () => {
      const expectedErrorMessage = "Bad request";
      const testFile = "test file";

      const {
        body: { message },
      } = await request(app)
        .post("/user/register")
        .type("multipart/form-data")
        .field("username", "sergio")
        .field("password", "sergio")
        .attach("image", Buffer.from(testFile, "utf-8"), {
          filename: "12798217782",
          originalname: "image.jpg",
        })
        .expect(400);

      expect(message).toBe(expectedErrorMessage);
    });
  });

  describe("When it receives a request with a users not present in the database", () => {
    test("Then it should respond with a 200 status and a token", async () => {
      const testFile = "test file";

      const {
        body: {
          new_user: { username },
        },
      } = await request(app)
        .post("/user/register")
        .type("multipart/form-data")
        .field("username", "sergio")
        .field("password", "sergio")
        .field("email", "sergiosergio@gmail.com")
        .field("location", "Barcelona")
        .attach("image", Buffer.from(testFile, "utf-8"), {
          filename: "12798217782",
          originalname: "image.jpg",
        })
        .expect(201);

      expect(username).toBe("sergio");
    });
  });
});
