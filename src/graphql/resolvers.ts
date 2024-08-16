import { AuthResolvers } from "./auth";
import { CategoryResolvers } from "./category";
import { ListingResolvers } from "./Listing";
import { NotificationResolvers } from "./notification";

const resolvers = {
  Query: {

    test: () => {
      return "working..."
    },
    ...AuthResolvers.Queries,
    // category queries 
    ...CategoryResolvers.Queries,
    // notification queries 
    ...NotificationResolvers.Queries,
    // listing queries 
    ...ListingResolvers.Queries


  },
  Mutation: {
    // auth mutations 
    ...AuthResolvers.Mutations,
    // category mutations 
    ...CategoryResolvers.Mutations,
    // notification mutations 
    ...NotificationResolvers.Mutations,
    // listing mutations 
    ...ListingResolvers.Mutations,

    singleUpload: async (_, { file }) => {
      const { stream, filename, mimetype, encoding } = await file;
      console.log("file", { stream, filename, mimetype, encoding })
      return "testing.."
    }

  }
}


export { resolvers }