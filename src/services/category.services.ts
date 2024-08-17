import { Category } from "../database/models/categories.model"
import { cloudinary } from "../lib/cloudinary";

const handleCtaegoryCreate = async (data: any) => {
    try {
        const {
            name, image, creator
        } = data


        const newCategory = await Category.create({ ...data });

        return {
            success: true,
            category: newCategory,
            message: "Category created successfully."
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleGetAllCategories = async (limit: number) => {
    try {
        const allCategories = await Category.find({}).sort({ createdAt: -1 }).limit(limit).populate("creator");

        if (allCategories.length === 0) {
            return {
                success: false,
                message: "No categories yet."
            }
        }
        return {
            success: true,
            allCategories
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleUpdateCategory = async (data: any) => {
    try {

        const { id } = data;
        delete data.id;
        const updatedCategory = await Category.findByIdAndUpdate({ _id: id }, { ...data }, { new: true });

        if (!updatedCategory) {
            return {
                success: false,
                message: "Someting went wrong, or category id is invalid."
            }
        }

        return {
            success: true,
            updatedCategory
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleCategoryDelete = async (data: any) => {

    try {
        const { user, id } = data;
        let category = await Category.findById(id);
        if (!category) {
            return {
                success: false,
                message: "Invalid category id, No category found."
            }
        }

        const isCategoryCreator = category.creator._id.toString() === user._id.toString();

        if (!isCategoryCreator) {
            return {
                success: false,
                message: "You can't delete this category."
            }
        }

        await category.deleteOne({ _id: id });

        await cloudinary.uploader.destroy(category.image.public_id);

        return {
            success: true,
            message: "Category deleted successfully."
        }
    } catch (error) {

    }
}




export { handleCtaegoryCreate, handleGetAllCategories, handleUpdateCategory, handleCategoryDelete }