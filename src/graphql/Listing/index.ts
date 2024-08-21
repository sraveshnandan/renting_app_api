import { GraphQLError } from "graphql";
import { isLoggedIn } from "../../middlewares/Authorise"
import { GetUserListing, hadleCreateListingFunction, handleDeleteListing, handleGetAllListings, handleUpdateListing } from "../../services/listing.services";

const ListingResolvers = {
    Queries: {
        listings: async (_, { limit }) => {
            const allRes = await handleGetAllListings(limit);
            if (!allRes.success) {
                return new GraphQLError(allRes.message);
            }
            delete allRes.success;

            return allRes
        },
        getUserListing: async (_, { }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorise, please login to create this listing.")
            }

            const userListRes = await GetUserListing(user._id);
            if (!userListRes.success) {
                return new GraphQLError(userListRes.message)
            }
            return userListRes.listing
        }
    },
    Mutations: {
        createListing: async (_, { data }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorise, please login to create this listing.")
            }
            const listRes = await hadleCreateListingFunction({ ...data, user });
            if (!listRes.success) {
                return new GraphQLError(listRes.message);
            }

            return listRes
        },
        deleteListing: async (_, { ID }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorised, pleae login to perform this action.")
            }

            const deleteRes = await handleDeleteListing({ user, id: ID });
            if (!deleteRes.success) {
                return new GraphQLError(deleteRes.message)
            };
            return deleteRes.message
        },
        updateListing: async (_, { data }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorised, please login again.")
            }

            const updateRes = await handleUpdateListing({ user, ...data });
            if (!updateRes.success) {
                return new GraphQLError(updateRes.message)
            }
            delete updateRes.success
            return updateRes
        }
    }
}

export { ListingResolvers }