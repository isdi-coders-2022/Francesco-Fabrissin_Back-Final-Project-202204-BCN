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

/* describe("Given a POST/user/register endpoint", () => {
  describe("When it receives a request with a users present in the database", () => {
    test.only("Then it should respond with a 200 status and a token", async () => {
      
       const newUser = {
        username: "sergio",
        password: "sergio",
        email: "sergiosergio@gmail.com",
        location: "Barcelona",
      }; 

      const testFile = "test file";
      jest.spyOn(path, "join").mockResolvedValue("image");

      const {
        body: {
          newUser: { username },
        },
      } = await request(app)
        .post("/user/register")
        .field("username", "sergio")
        .field("password", "sergio")
        .field("email", "sergio")
        .field("location", "sergio")
        .attach("file", Buffer.from(testFile, "utf-8"), {
          // add file info accordingly
          filename: "12798217782",
          originalname: "image.jpg",
        })
        .expect(201);

      expect(username).toBe("sergio");
    });
  });
});
*/
