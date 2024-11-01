import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faEdit, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdatePortfolio from "./updateportfolio";
import { ToastContainer, toast } from "react-toastify";
import SwitcherTwo from "./enable.jsx";
import getApi from "../../Utils/apirequest";
import { storage } from "../../firebase.js";
import { ref, getMetadata, deleteObject } from "firebase/storage";

export default function PortfolioCard({ data, onCardClick, fetchData }) {
    const [isEnabled, setIsEnabled] = useState(data.listed);
    const [showModal, setShowModal] = useState(false);
    const [isPortfolioOfWeek, setIsPortfolioOfWeek] = useState(data.portfoliooftheweek || false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsEnabled(data.listed);
        setIsPortfolioOfWeek(data.portfoliooftheweek);
    }, [data.listed, data.portfoliooftheweek]);

    const handleToggle = async () => {
        const newStatus = !isEnabled;
        setIsEnabled(newStatus);
        try {
            const response = await getApi("PUT", `/admin/portfolio/listed`, {
                listed: newStatus,
                title: data.title
            });
            if (response.status === 200) {
                fetchData();
            } else {
                console.error("Failed to update listed status");
            }
        } catch (error) {
            console.error("Error updating listed status:", error);
        }
    };

    const handleupdateportfoliooftheweek = async () => {
        const response = await getApi("PUT", `/admin/portfolio/portfoliooftheweek/${data._id}`, {})
      
        if (response.status === 200) {
            fetchData();
            toast.success("Successfully updated!");
        }
    }

    const handleLinkClick = (e) => {
        e.stopPropagation();
        onCardClick(data._id);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };
   
    const handleDeleteClick = async (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this portfolio?")) {
            try {
                const imageRef = ref(storage, data.banner);
    
                // Check if the image exists in Firebase
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
    
                // Delete the link from the database
                const response = await getApi("DELETE", `/admin/portfolio/${data._id}`, {});
                if (response.status === 200) {
                    fetchData();
                    toast.success("Portfolio deleted successfully!");
                } else {
                    toast.error("Failed to delete portfolio");
                }
            } catch (error) {
                console.error("Error deleting portfolio:", error);
                toast.error("Error deleting portfolio");
            }
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
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
                        <h2 className="text-xl font-semibold text-gray-800">{data.title}</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {data.category}
                        </span>
                    </div>
                    <div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: isExpanded ? data.about : `${data.about.substring(0, 100)}...`
                            }}
                        />
                        <button onClick={toggleExpand} className="text-blue-500 ml-2">
                            {isExpanded ? "Show Less" : "See More"}
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <SwitcherTwo
                            id={`switch-${data._id}`}
                            isEnabled={isEnabled}
                            handleToggle={handleToggle}
                        />
                        <div className="flex space-x-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                onClick={handleEditClick}
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit
                            </button>
                            <button
                                className="font-bold py-2 px-4 rounded inline-flex items-center"
                                onClick={handleDeleteClick}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500 hover:text-red-600" />
                            </button>
                            <FontAwesomeIcon
                                icon={faStar}
                                onClick={handleupdateportfoliooftheweek}
                                className={`text-2xl cursor-pointer ${data.portfoliooftheweek ? 'text-yellow-500' : 'text-gray-400'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <UpdatePortfolio setShowModal={setShowModal} data={data} fetchData={fetchData} />
                    </div>
                </div>
            )}
        </>
    );
}