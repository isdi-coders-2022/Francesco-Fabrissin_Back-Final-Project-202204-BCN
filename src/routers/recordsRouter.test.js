const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const Record = require("../database/models/Record");
const User = require("../database/models/User");
const mockRecords = require("../mocks/mockRecords");
const { mockNewUsers } = require("../mocks/mockUsers");
const app = require("../server/index");

beforeAll(async () => {
  await connectDB(process.env.MONGO_CONNECTION_TEST);
});

beforeEach(async () => {
  await User.create(mockNewUsers[2]);
  await User.create(mockNewUsers[3]);
});

beforeEach(async () => {
  await Record.create(mockRecords[0]);
  await Record.create(mockRecords[1]);
  await Record.create(mockRecords[2]);
});

afterEach(async () => {
  await User.deleteMany({});
});
afterEach(async () => {
  await Record.deleteMany({});
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

describe("Given a DELETE/myCollection/:recordId endpoint", () => {
  describe("When it receives a request with a record id", () => {
    test("Then it should respond with a status 200 and a deleted record", async () => {
      const record = await Record.find({ title: "Brace & Bit" });
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTYwOTk5MzliYjlkZmFkOWY5OTI5NyIsInVzZXJuYW1lIjoiZnJhNDMyIiwiaW1hZ2UiOiJodHRwczovL3ZpZGVvLWVjdjEtMS54eC5mYmNkbi5uZXQvdi90MS42NDM1LTkvMzc4Njc2NDNfMjE4MTc5MDEyODc3MjA3OV8zNDk2Njg1NjkwNjA5OTkxNjgwX24uanBnP19uY19jYXQ9MTA4JmNjYj0xLTcmX25jX3NpZD0wOWNiZmUmX25jX29oYz1MWFNxN1F1RFpnUUFYXzF0NzBaJl9uY19odD12aWRlby1lY3YxLTEueHgmb2g9MDBfQVQtWXRoLW9PaUJZNXRZVVVoX29udlpFZnhGRTlIMWRxd1V6ejc1ZDVZc1VEdyZvZT02MkJDRTk2QSIsImlhdCI6MTY1NDUxMDQ3NX0.jJpqlaW_kflpVjuvS86EuVqqlS93Y2D8IC-axYFa7jg";

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      const {
        // eslint-disable-next-line camelcase
        body: { deleted_record },
      } = await request(app)
        .delete(`/myCollection/${record[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(deleted_record).toHaveProperty("title", "Brace & Bit");
    });
  });
});
