import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SwitcherTwo from "./enable";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faExternalLinkAlt, 
    faEdit, 
    faStar, 
    faCopy, 
    faCheckCircle,
    faTrash,
    faHeart,
    faThumbsDown
} from "@fortawesome/free-solid-svg-icons";

import UpdatePortfolio from "./updatebiography";
import getApi from "../../Utils/apirequest";
import { storage } from "../../firebase.js"; 
import { ref, deleteObject } from "firebase/storage";
export default function BiographyCard({ data, onCardClick, fetchData }) {
    const [isEnabled, setIsEnabled] = useState(data.listed);
    const [showModal, setShowModal] = useState(false);
    const [isPortfolioOfWeek, setIsPortfolioOfWeek] = useState(data.biographyoftheday || false);
    const [copySuccess, setCopySuccess] = useState("");
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);

    useEffect(() => {
        setIsEnabled(data.listed);
    }, [data.listed]);

    const handleToggle = async () => {
        if (isRequestInProgress) return;
        setIsRequestInProgress(true);

      
        const newStatus = !isEnabled;
        setIsEnabled(newStatus);
        try {
            const response = await getApi("PUT", `/admin/biography/listed`, {
                title: data.title
            });
           
            if (response.status === 200) {
              
                fetchData();
            } else {
                console.error("Failed to update enable status");
            }
        } catch (error) {
            console.error("Error updating enable status:", error);
        } finally {
            setIsRequestInProgress(false);
        }
    };

    const handleupdatebiographyoftheday = async () => {
        if (isRequestInProgress) return;
        setIsRequestInProgress(true);

        const response = await getApi("PUT", `/admin/biography/biographyoftheday`, {
            title: data.title
        });
      
        if (response.status === 200) {
            fetchData();
            toast.success("Successfully updated!");
        } else {
            toast.error("Failed to update biography of the day");
        }

        setIsRequestInProgress(false);
    };

    const handleLinkClick = (e) => {
        e.stopPropagation();
        onCardClick(data._id);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const handleHeartClick = async () => {
        if (isRequestInProgress) return;
        setIsRequestInProgress(true);
        try {
            const response = await fetch(`https://professional-spotlight-backend.vercel.app/admin/biography/heart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: data.title }), // Ensure 'data' is defined in the scope
            });
    
            // Parse the JSON response
            const responseData = await response.json(); // Rename to avoid shadowing
    
            if (response.ok) {
                fetchData();
                alert("Successfully added to top biographies");
            } else if (responseData.error) {
                toast.error(responseData.error); // Check for errors from the server
            }
        } catch (error) {
            console.error("Error updating biography of the day:", error);
            toast.error("An error occurred while updating the biography of the day");
        } finally {
            setIsRequestInProgress(false);
        }
    };
    

    const handleHeartDislike = async (biographyId) => {
        if (isRequestInProgress) return;
        setIsRequestInProgress(true);
        try {
            // Make an API call to update the heart status of the biography
            const response = await fetch(`https://professional-spotlight-backend.vercel.app/admin/biography/unlike`, {
                method: "POST", // Use POST or PATCH depending on your backend setup
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: data.title }), 
            });
    
            // Parse the response
            const responseData = await response.json();
    
            if (response.ok) {
                alert("Successfully removed from top biographies");
                // Optionally, update the UI to reflect the change
                fetchData(); // Refresh the data if needed
            } else if (responseData.error) {
                alert(`Error: ${responseData.error}`);
            }
        } catch (error) {
            console.error("Error unliking biography:", error);
            alert("An error occurred while removing the heart from the biography.");
        }finally {
            setIsRequestInProgress(false);
        }
    };
    

    const copyToClipboard = (e) => {
        e.stopPropagation();
        const link = `https://www.professionals-spotlight.com/biography/test-biography/${data.slug}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopySuccess("Link copied!");
            setTimeout(() => setCopySuccess(""), 2000);
        });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (isRequestInProgress) return;
        setIsRequestInProgress(true);
        const imageRef = ref(storage, data.banner);
        await deleteObject(imageRef);
        if (window.confirm("Are you sure you want to delete this biography?")) {
            try {
                const response = await getApi("DELETE", `/admin/biography/${data._id}`, {});
                if (response.status === 200) {
                    toast.success("Biography deleted successfully!");
                    fetchData();
                } else {
                    toast.error("Failed to delete biography");
                }
            } catch (error) {
                console.error("Error deleting biography:", error);
                toast.error("An error occurred while deleting the biography");
            } finally {
                setIsRequestInProgress(false);
            }
        } else {
            setIsRequestInProgress(false);
        }
    };

    return (
        <>
            <div className="border w-96 rounded-md hover:shadow-2xl relative cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                <ToastContainer />
                <div className="relative">
                    <img
                        src={data.banner}
                        className="w-full h-48 object-cover rounded-t-md"
                        alt={data.title}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                        <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="text-lg text-gray-600 hover:text-blue-500"
                            onClick={handleLinkClick}
                        />
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {data.title}
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {data.category}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <SwitcherTwo
                            id={`switch-${data._id}`}
                            isEnabled={isEnabled}
                            handleToggle={handleToggle}
                        />
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                            onClick={handleEditClick}
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                        </button>
                        {
                            data.heart ? 
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={handleHeartDislike}>
                            <FontAwesomeIcon icon={faThumbsDown} />
                        </button>
                            
                            : <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={()=>{
                                handleHeartClick();
                               
                        }}>
                             <FontAwesomeIcon icon={faHeart} />
                        </button>
                        }
                        <FontAwesomeIcon
                            icon={faStar}
                            onClick={handleupdatebiographyoftheday}
                            className={`text-lg ${data.biographyoftheday ? 'text-green-500' : 'text-gray-400'}`}
                        />
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faCopy}
                                className="text-lg text-gray-600 hover:text-blue-500 cursor-pointer"
                                onClick={copyToClipboard}
                            />
                            {copySuccess && (
                                <div className="absolute -top-6 left-2 mt-2 mr-2 flex items-center text-green-500 text-sm">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> {copySuccess}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-lg text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div
                        className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto"
                        style={{ scrollbarColor: "transparent transparent" }}
                    >
                        <UpdatePortfolio
                            setShowModal={setShowModal}
                            data={data}
                            fetchData={fetchData}
                        />
                    </div>
                </div>
            )}
        </>
    );
}