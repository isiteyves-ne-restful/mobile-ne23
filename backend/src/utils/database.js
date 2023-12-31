import mongoose from "mongoose";
const { connect } = mongoose;
import { config } from "dotenv";
config({ path: "./.env" });

connect(process.env.DB_URL, {
  serverSelectionTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.log(err));
