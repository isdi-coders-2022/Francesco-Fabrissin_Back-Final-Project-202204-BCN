const mockRecords = require("./mockRecords");

const mockUsers = [
  {
    id: "1",
    username: "fra432",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAS",
    email: "frafra@gmail.com",
    location: "Barcelona",
    image: "image",
    imageBackup: "image",
    records_collection: {
      records: [...mockRecords],
      genre: "Electronic",
    },
    wantlist: [],
  },
  {
    id: "2",
    username: "nico",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAG",
    email: "niconico@gmail.com",
    location: "Genova",
    image: "image",
    imageBackup: "image",
    records_collection: {
      records: [...mockRecords],
      genre: "Jazz",
    },
    wantlist: [],
  },
  {
    id: "3",
    username: "fra433",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAS",
    email: "fra@gmail.com",
    location: "Udine",
    image: "image",
    imageBackup: "image",
    records_collection: {
      records: [...mockRecords],
      genre: "Punk",
    },
    wantlist: [],
  },
  {
    id: "4",
    username: "nicos",
    password: "$2a$10$LsFVpdYMCNUst/DRujI4ke0Purxd3cPmjU6TqbqhgbnEv8bwjh14S",
    email: "nico@gmail.com",
    location: "Milan",
    image: "image",
    imageBackup: "image",
    records_collection: {
      records: [...mockRecords],
      genre: "Rock",
    },
    wantlist: [],
  },
];

const mockNewUsers = [
  {
    username: "fra432",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAS",
    email: "frafra@gmail.com",
    location: "Barcelona",
    records_collection: {
      records: [],
      genre: "Electronic",
    },
    wantlist: [],
  },
  {
    username: "nico",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAG",
    email: "niconico@gmail.com",
    location: "Genova",
    records_collection: {
      records: [],
      genre: "Jazz",
    },
    wantlist: [],
  },
  {
    username: "fra433",
    password: "$2a$10$fvX34xBeots6dRezw8IQJ.g/diQHdPQefkscaQdoBXqd5ThlSggAS",
    email: "fra@gmail.com",
    location: "Udine",
    records_collection: {
      records: [],
      genre: "Punk",
    },
    wantlist: [],
  },
  {
    username: "nicos",
    password: "$2a$10$LsFVpdYMCNUst/DRujI4ke0Purxd3cPmjU6TqbqhgbnEv8bwjh14S",
    email: "nico@gmail.com",
    location: "Milan",
    records_collection: {
      records: [],
      genre: "Rock",
    },
    wantlist: [],
  },
];

module.exports = { mockUsers, mockNewUsers };
