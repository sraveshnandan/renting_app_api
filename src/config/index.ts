import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const MongoDbUri = process.env.MONGO_URI;
const StatusSecret = process.env.STATUS_SECRET;
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
const MAILERSEN_API_KEY = process.env.MAILSENDER_API_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NODE_ENV = process.env.NODE_ENV;
const SMS_GATEWAY_URL = process.env.SMS_GATEWAY_URL;
const SMS_GATEWAY_SECRET = process.env.SMS_GATEWAY_SECRET;

export {
  Port,
  MongoDbUri,
  StatusSecret,
  JWT_SECRET,
  RESEND_API_KEY,
  NODE_ENV,
  SMS_GATEWAY_URL,
  SMS_GATEWAY_SECRET,
};
