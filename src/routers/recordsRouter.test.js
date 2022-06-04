const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
const mockRecords = require("../mocks/mockRecords");
const mockUsers = require("../mocks/mockUsers");
const app = require("../server/index");

beforeAll(async () => {
  await connectDB(process.env.MONGO_CONNECTION_TEST);
});

beforeEach(async () => {
  await User.create(mockUsers[2]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Given a GET/myCollection endpoint", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should respond with a status 200 and a the user collection", async () => {
      const user = {
        username: "fra433",
        password: "fra432",
      };
      const expectedRecords = mockRecords;

      const {
        body: { token },
      } = await request(app).post("/user/login").send(user).expect(200);

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          records_collection: {
            records: mockRecords,
          },
        }),
      }));

      const {
        body: { records },
      } = await request(app)
        .get("/myCollection")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(records).toEqual(expectedRecords);
    });
  });
});
