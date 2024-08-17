import { Category } from "../database/models/categories.model";
import { Listing } from "../database/models/lising.model";
import { cloudinary } from "../lib/cloudinary";

const hadleCreateListingFunction = async (data: Record<string, any>) => {
    try {
        const { user } = data;
        let newListingpayload = {
            ...data

        }

        if (user.role !== "owner" && user.role !== "admin") {
            return {
                success: false,
                message: "You are not allowed to create a listing."
            }
        }

        const newListing = await Listing.create(newListingpayload);

        return {
            success: true,
            message: "Listing created successfully.",
            listing: newListing
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleGetAllListings = async (limit: number) => {
    try {
        const allListings = await Listing.find({}).sort({ createdAt: -1 }).limit(limit).populate("owner category");

        if (allListings.length === 0) {
            return {
                success: false,
                message: "No listing yet."
            }
        }
        return {
            success: true,
            message: "All listing fetched successfully.",
            listings: allListings
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleDeleteListing = async (data: any) => {
    try {

        const { user, id } = data;

        let category: any = await Listing.findById(id).populate("owner");
        if (!category) {
            return {
                success: false,
                message: "Invalid  ID, No  Listing found."
            }
        }

        const isOwner = category.owner._id.toString() === user._id.toString();
        if (!isOwner) {
            return {
                success: false,
                message: "You are not allowed to delete this listing."
            }
        }

        // deleting listing images from cdn 

        category.banners.map((item) => {
            return cloudinary.uploader.destroy(item.public_id)
        })



        await Category.deleteOne({ _id: id });

        return {
            success: true,
            message: "Listing deleted successfully."
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

const handleUpdateListing = async (data: any) => {
    try {
        const { user, id } = data;
        const listing = await Listing.findById(id).populate("owner");

        if (!listing) {
            return {
                success: false,
                message: "Invalid Id, no listing found. "
            }
        }

        const iOwner = listing.owner._id.toString() === user._id.toString();

        if (!iOwner) {
            return {
                success: false,
                message: "You are not allowed to update this listing."
            }
        }

        delete data.id;
        delete data.user

        const updatedListing = await Listing.findByIdAndUpdate({ _id: listing._id }, { ...data }, { new: true });

        return {
            success: true,
            message: "Listing updated successfully.",
            listing: updatedListing
        }



    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


export {
    hadleCreateListingFunction,
    handleGetAllListings,
    handleDeleteListing,
    handleUpdateListing
}