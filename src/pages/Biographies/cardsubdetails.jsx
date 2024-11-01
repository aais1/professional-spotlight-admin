import React, { useEffect, useState } from "react";
import Project from "../../components/Portfolio/projectscard";
import InsertDetails from "../../components/Biographies/addDetails";
import EditKeypoints from "../../components/Biographies/editaddedimages";
import InsertImages from "../../components/Biographies/addimages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { storage } from "../../firebase.js";
import { ref, getMetadata, deleteObject } from "firebase/storage"; // Import getMetadata
import PostApi from "../../Utils/apirequest";

export default function Subdetailspage({ portfolioId, onBack, fetchData, data }) {
    const [showModal, setShowModal] = useState(null);
    const [addImages, setAddImages] = useState(false);
    const [EditImages, setEditImages] = useState(false);
    console.log("the id is ", data);

    if (!data) {
        return <div>Loading...</div>;
    }

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEditImages(true);
    };
    const handleDeleteImage = async (imageUrl) => {
      
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                const imageRef = ref(storage, imageUrl);
    
                try {
                    await getMetadata(imageRef);
                    // If the image exists, delete it
                    await deleteObject(imageRef);
                } catch (error) {
                    if (error.code === 'storage/object-not-found') {
                        console.warn("Image not found in Firebase, proceeding to delete link from DB");
                    } else {
                        throw error; // Re-throw if it's a different error
                    }
                }
                const response = await PostApi("POST", `/admin/biography/deleteimage`, {
                    id: data._id, // Send the biography ID instead of title
                    image: imageUrl
                });
                if (response.status === 200) {
                    // If the server successfully deletes the image URL, update the local state
                    fetchData();
                } else {
                    console.error('Failed to delete image URL from database');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
    };

    return (
        <div className="w-full">
            <div className="w-full flex flex-row justify-between items-center h-full">
                <button
                    className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    onClick={onBack}
                >
                    Back
                </button>
                <span className="flex flex-row space-x-2">
                    <button
                        onClick={() => {
                            setShowModal(true);
                        }}
                        className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    >
                        Update details
                    </button>
                    <button
                        onClick={() => setAddImages(true)}
                        className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    >
                        Add Images
                    </button>
                </span>
            </div>
            <div className="p-6">
                <h1 className="text-xl font-semibold">Details</h1>
                <div className="flex space-x-2 justify-around gap-2 flex-wrap">
                    <div className="ql-editor" dangerouslySetInnerHTML={{ __html: data.description }} />
                </div>
                {/* Images */}
                <h1 className="text-xl m-2 font-semibold">Images</h1>
                <div className="flex flex-wrap h-full auto-cols-max m-2 border border-black-2 p-2 rounded-md justify-start gap-5">
                    {data.images && data.images.length > 0 ? (
                        data.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img src={image} alt={`image-${index}`} className="h-40 w-56" />
                                <button
                                    onClick={() => handleDeleteImage(image)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No image uploaded</p>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-3/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <InsertDetails portfolio={data} setShowModal={setShowModal} fetchData={fetchData} />
                    </div>
                </div>
            )}
            {addImages && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <InsertImages Images={data.images} title={data.title} setAddImages={setAddImages} fetchData={fetchData} />
                    </div>
                </div>
            )}
            <style jsx global>{`
                    .ql-editor {
                        padding: 0;
                    }
                    .ql-editor h1 { font-size: 2em; }
                    .ql-editor h2 { font-size: 1.5em; }
                    .ql-editor h3 { font-size: 1.17em; }
                    .ql-editor h4 { font-size: 1em; }
                    .ql-editor h5 { font-size: 0.83em; }
                    .ql-editor h6 { font-size: 0.67em; }
                    .ql-editor .ql-size-small { font-size: 0.75em; }
                    .ql-editor .ql-size-large { font-size: 1.5em; }
                    .ql-editor .ql-size-huge { font-size: 2.5em; }
                    .ql-editor p { margin-bottom: 1em; }
                `}</style>
        </div>
    );
}