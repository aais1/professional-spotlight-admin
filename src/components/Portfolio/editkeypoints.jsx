import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import getApi from "../../Utils/apirequest.js";

export default function InsertKeyPoint({ keypoints, setEditKeyAspect, fetchData, portfolioId }) {
    const [keyPoints, setKeyPoints] = useState([]);
    console.log(portfolioId,keyPoints)

    useEffect(() => {
        // Initialize key points from props
        setKeyPoints(keypoints.map(kp => ({ ...kp })));
    }, [keypoints]);

    // Handle input change for key points
    const handleKeyPointChange = (index, event) => {
        const updatedKeyPoints = [...keyPoints];
        updatedKeyPoints[index].keyaspect = event.target.value;
        setKeyPoints(updatedKeyPoints);
    };

    // Handle key point deletion
    const handleDeleteKeyPoint = async (id) => {
        console.log(id);
        try {
            const response = await fetch(`http://localhost:3001/admin/portfolio/keyaspect/${id}`, {
                method: "DELETE",
            });
            
            if (response.ok) {
                toast.success("Key Point deleted successfully");
                fetchData(); // Refresh data after deletion
            } else {
                toast.error("Failed to delete Key Point");
            }
        } catch (error) {
            toast.error("Error deleting Key Point");
            console.error("Delete error:", error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const changedKeyPoints = keyPoints.filter(
            (kp, index) => kp.keyaspect !== keypoints[index].keyaspect
        );

        if (changedKeyPoints.length > 0) {
            const payload = {
                portfolioId, // Pass portfolioId as a separate field
                keyaspects: changedKeyPoints.map(kp => ({
                    id: kp._id,
                    keyaspect: kp.keyaspect
                }))
            };

            console.log(payload)

            try {
                const response = await fetch("http://localhost:3001/admin/portfolio/keyaspect", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    toast.success("Key Points updated successfully");
                    fetchData(); // Refresh data after update
                    setEditKeyAspect(false); // Close modal
                } else {
                    toast.error("Failed to update Key Points");
                }
            } catch (error) {

                console.log(error)
                toast.error("Error updating Key Points");
                console.error("Update error:", error);
            }
        } else {
            toast.info("No changes detected");
        }
    };

    // Handle modal close
    const handleOnClose = () => {
        setEditKeyAspect(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white p-10">
                <ToastContainer position="top-right" autoClose={5000} />

                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium mb-4">Edit Key Points</h1>
                    <FontAwesomeIcon
                        className="text-lg cursor-pointer"
                        onClick={handleOnClose}
                        icon={faTimes}
                    />
                </div>

                {/* Render multiple input fields for key points */}
                {keyPoints.map((keyPoint, index) => (
                    <div key={keyPoint._id} className="mb-4 flex items-center space-x-4">
                        <input
                            type="text"
                            value={keyPoint.keyaspect}
                            onChange={(e) => handleKeyPointChange(index, e)}
                            placeholder={`Enter keypoint ${index + 1}`}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                        <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteKeyPoint(keyPoint._id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}

                {/* Submit button */}
                <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                    Submit
                </button>
            </form>
        </>
    );
}
