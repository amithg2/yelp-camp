const session = require("express-session");
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

const secret = process.env.SECRET || "thisshuldbesecret";
const store = new MongoDBStore({
  url: dbUrl,
  touchAfter: 24 * 60 * 60,
  secret,
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  saveUninitialized: true,
};

module.exports = { sessionConfig, store };
