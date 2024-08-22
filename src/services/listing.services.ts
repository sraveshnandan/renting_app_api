
import { Listing } from "../database/models/lising.model";
import { Notification } from "../database/models/notification.model";
import { cloudinary } from "../lib/cloudinary";

const hadleCreateListingFunction = async (data: Record<string, any>) => {
    try {
        const { user } = data;
        let newListingpayload = {
            ...data

        }
        if (user.role === "user") {
            return {
                success: false,
                message: "You are not allowed to create a listing."
            }
        }

        const newListing = await Listing.create(newListingpayload);

        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your Listing created sucessfully.",
            description: "We are happy to inform you, that your listing is careted successfully, and it will be live in our application after some security checks by our team in few hours.",
            reciver: user._id
        }
        await Notification.create(newNotificationPayload);


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
        const allListings = await Listing.find({}).sort({ createdAt: -1 }).limit(limit).populate("owner");

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

        let listing: any = await Listing.findById(id).populate("owner");
        if (!listing) {
            return {
                success: false,
                message: "Invalid  ID, No  Listing found."
            }
        }

        const isOwner = listing.owner._id.toString() === user._id.toString();
        if (!isOwner) {
            return {
                success: false,
                message: "You are not allowed to delete this listing."
            }
        }

        // deleting listing images from cdn 

        listing.banners.map((item) => {
            return cloudinary.uploader.destroy(item.public_id)
        })



        await Listing.deleteOne({ _id: id });

        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your Listing is delted sucessfully.",
            description: "Your request to delete your listing is successfully processed. Your listing is deleted now. Thank you. ",
            reciver: user._id
        }
        await Notification.create(newNotificationPayload);

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

        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your Listing is updated sucessfully.",
            description: "The changes you have requested to update in your listing id completed now and it will be reflected in application in few minutes after reviewing. Thank you. ",
            reciver: user._id
        }
        await Notification.create(newNotificationPayload);

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

const GetUserListing = async (userId: string) => {
    try {
        const listing = await Listing.findOne({ owner: userId }).populate("owner");
        if (!listing) {
            return {
                success: false,
                message: "No listing found."
            }
        }

        return {
            success: true,
            listing
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
    handleUpdateListing,
    GetUserListing
}