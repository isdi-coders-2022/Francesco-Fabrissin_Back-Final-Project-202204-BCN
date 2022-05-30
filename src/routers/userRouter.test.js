const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
const mockUsers = require("../mocks/mockUsers");
const app = require("../server/index");

const mongoString =
  "mongodb+srv://fra432:isdicoders@cluster2.hykgg.mongodb.net/test?retryWrites=true&w=majority";

beforeAll(async () => {
  await connectDB(mongoString);
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
});
