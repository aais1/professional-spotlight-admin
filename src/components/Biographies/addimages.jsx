import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../../firebase.js"; 
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostApi from '../../Utils/apirequest';

export default function AddImages({ Images, setAddImages, fetchData, title }) {
    const [newImages, setNewImages] = useState([...Images]); // Initialize with existing images
    const [files, setFiles] = useState(Array(Images.length).fill(null)); // Initialize with null for each image
    const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

    const handleAddImage = () => {
        setNewImages([...newImages, ""]); // Add an empty string for a new image input
        setFiles([...files, null]); // Add a null value for the new image file
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        const updatedFiles = [...files];
        updatedFiles[index] = file; // Update the file at the specified index
        setFiles(updatedFiles);

        const updatedImages = [...newImages];
        updatedImages[index] = URL.createObjectURL(file); // Update the image preview at the specified index
        setNewImages(updatedImages);
    };

    const handleDeleteImage = (index) => {
        const updatedImages = [...newImages];
        const imageToDelete = updatedImages[index];
        if (imageToDelete && imageToDelete !== "") {
            setImagesToDelete([...imagesToDelete, imageToDelete]); // Add to images to delete
        }
        updatedImages.splice(index, 1); // Remove the image from the array
        setNewImages(updatedImages);

        const updatedFiles = [...files];
        updatedFiles.splice(index, 1); // Remove the file from the array
        setFiles(updatedFiles);
    };

    const deleteImage = async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        try {
            await deleteObject(imageRef);
         
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error(`Failed to delete image: ${error.message}`);
        }
    };

    const uploadImage = async (file) => {
     
        if (!file) {
            console.error("No file found");
            return null;
        }

        const sanitizedFileName = file.name.replace(/\s+/g, '-').toLowerCase(); // Sanitize file name
        const formattedTime = new Date().toISOString(); // Add timestamp to make filename unique

        // Define imageRef before using it
        const imageRef = ref(storage, `Biographies/${sanitizedFileName}-${formattedTime}`);
       
        try {
            // Upload the file
            await uploadBytes(imageRef, file);

            // Get the download URL after upload
            const downloadURL = await getDownloadURL(imageRef);
       
            return downloadURL;
        } catch (error) {
            console.error("Error uploading file:", error.code, error.message);
            toast.error(`Failed to upload image: ${error.message}`);
            return null;
        }
    };

    const handleSubmit = async () => {
        // Submit logic
        if (!newImages.length) {
            console.error("No images to submit");
            return;
        }

        // Delete images marked for deletion
        await Promise.all(imagesToDelete.map(async (imageUrl) => {
            await deleteImage(imageUrl);
        }));

        const updatedImageUrls = await Promise.all(
            files.map(async (file, index) => {
                if (file) {
                    // If there's a new file, upload the new one
                    return await uploadImage(file);
                } else {
                    // If there's no new file, keep the old image URL
                    return newImages[index];
                }
            })
        );

      // Replace this with actual submit logic
        let images = [];
        images = updatedImageUrls.filter((image) => image !== null);
        const response = await PostApi('POST', '/admin/biography', { images, title });
      
        if (response.status === 200) {
            toast.success('Images updated successfully');
            fetchData();
            setAddImages(false); // Close the modal after submission
        } else {
            toast.error('Failed to update images');
        }
    };

    const handleClose = () => {
        setAddImages(false); // Close the modal without saving
    };

    return (
        <div className="m-2 p-4 border bg-white border-black rounded-md relative">
            <ToastContainer />
            {/* Cross button to close the modal */}
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={handleClose}
            >
                &#10005; {/* Cross symbol */}
            </button>

            <h2 className="text-lg font-bold mb-4">Add Images</h2>
            {newImages.map((image, index) => (
                <div key={index} className="mb-3 relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                        className="border border-gray-300 p-2 rounded-md w-full"
                    />
                    {image && (
                        <div className="flex items-center mt-2">
                            <p className="flex-1">{image}</p>
                                                        <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => document.querySelector(`input[type="file"]:nth-of-type(${index + 1})`).click()}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Add More Images button */}
            <button
                type="button"
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                onClick={handleAddImage}
            >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add images</span>
            </button>

            {/* Submit button */}
            <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
                Submit
            </button>
        </div>
    );
}