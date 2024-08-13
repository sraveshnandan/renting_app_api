import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const MongoDbUri = process.env.MONGO_URI;
const StatusSecret = process.env.STATUS_SECRET;
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
const MAILERSEN_API_KEY = process.env.MAILSENDER_API_TOKEN;



export { Port, MongoDbUri, StatusSecret, JWT_SECRET, MAILERSEN_API_KEY };
