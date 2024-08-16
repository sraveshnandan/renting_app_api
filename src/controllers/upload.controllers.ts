import express from 'express';

import { cloudinary } from '../lib/cloudinary';




// Define the REST endpoint for file uploads
const handleFileUpload = async (req: any, res: any) => {
    try {
        if (!req?.files) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }


        // Array to hold the upload results
        let uploadResults: { url: string; public_id: string }[] = [];

        // Handle multiple file uploads
        const files = req.files;
        const uploadPromises = files.map((file) => {
            return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'renting_app' }, // Optional: specify a folder in Cloudinary
                    (error, result) => {
                        if (error) return reject(new Error(error.message));
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.end(file.buffer);
            });
        });

        // Wait for all files to be uploaded
        uploadResults = await Promise.all(uploadPromises);

        // Send the response with the uploaded file URLs
        return res.json({
            message: 'Files uploaded successfully.',
            files: uploadResults,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const handleFileDelete = async (req: express.Request, res: any) => {
    try {

        const { public_id } = req.body;


        if (public_id.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No public_id provided."
            })
        }


        const deletePromises = public_id.map(id => cloudinary.uploader.destroy(id));

        const results = await Promise.all(deletePromises);

        // Return success response
        res.status(200).json({
            message: 'Images deleted successfully',
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export { handleFileUpload, handleFileDelete }