import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import mongoose from "mongoose";
import { resolvers, typeDefs } from "./graphql";
import { MongoDbUri, NODE_ENV, Port } from "./config";
import UploadRoute from "./routes";
import express from "express";
import cors from "cors";

// express server
const app = express();

app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/upload", UploadRoute);

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  nodeEnv: NODE_ENV,
  plugins: [],
});

// graphql server
const startGraphQlServer = async () => {
  console.log("connecting to the database.");

  mongoose
    .connect(MongoDbUri)
    .then(async (con) => {
      console.log(`📡 Database is connected to : ${con.connection.host}`);
      console.log(`Starting GraphQl Server.`);
      await server.start();
      app.use(
        "/graphql",
        expressMiddleware(server, {
          // options
          context: async ({ req }) => {
            return req.headers;
          },
        })
      );
      app.listen(Port, () => {
        console.log("graphql server started on http://localhost:5000/graphql");
      });
    })
    .catch((error) =>
      console.log(`Unable to connect to the database due to : ${error.message}`)
    );
};

startGraphQlServer();
