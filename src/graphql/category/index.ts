import { GraphQLError } from "graphql";
import { handleCategoryDelete, handleCtaegoryCreate, handleGetAllCategories, handleUpdateCategory } from "../../services/category.services"
import { isLoggedIn } from "../../middlewares/Authorise";

const CategoryResolvers = {
    Queries: {
        categories: async (_, { limit }) => {
            const allCAteRes = await handleGetAllCategories(limit);
            if (!allCAteRes.success) {
                return new GraphQLError(allCAteRes.message)
            }
            delete allCAteRes.success
            return allCAteRes.allCategories
        }
    },
    Mutations: {
        createCategory: async (_, { data }) => {
            const categoryRes = await handleCtaegoryCreate(data);
            if (!categoryRes.success) {
                return new GraphQLError(categoryRes.message)
            }
            delete categoryRes.success;
            return categoryRes
        },
        updateCAtegory: async (_, { data }) => {
            const updateCateRes = await handleUpdateCategory(data);
            if (!updateCateRes.success) {
                return new GraphQLError(updateCateRes.message)
            }

            delete updateCateRes.success
            return updateCateRes.updatedCategory
        },
        deleteCategory: async (_, { ID }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthenticated, please login to perform this action.")
            }
            const deleteCateRes = await handleCategoryDelete({ user, id: ID });
            if (!deleteCateRes.success) {
                return new GraphQLError(deleteCateRes.message)
            }
            return deleteCateRes.message
        }

    }
}

export { CategoryResolvers }