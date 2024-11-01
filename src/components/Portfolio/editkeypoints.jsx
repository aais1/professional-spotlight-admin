import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import getApi from "../../Utils/apirequest.js";

export default function InsertKeyPoint({ keypoints, setEditKeyAspect, fetchData, portfolioId }) {
    const [keyPoints, setKeyPoints] = useState(keypoints);
    const [originalKeyPoints, setOriginalKeyPoints] = useState([]);

    useEffect(() => {
        setOriginalKeyPoints(keypoints.map(kp => ({ ...kp })));
    }, [keypoints]);

    // Handle input change for key points
    const handleKeyPointChange = (index, event) => {
        const updatedKeyPoints = [...keyPoints];
        updatedKeyPoints[index].keyaspect = event.target.value;
        setKeyPoints(updatedKeyPoints);
    };

    // Handle key point deletion
    const handleDeleteKeyPoint = async (id) => {
        console.log("Deleting key point with id:", id);
        const response = await getApi("DELETE", `/admin/portfolio/keyaspect/${id}`, {});
        if (response.status === 200) {
            fetchData();
            toast.success("Key Point deleted successfully");
            setEditKeyAspect(false);
        } else {
            toast.error("Failed to delete Key Point");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const changedKeyPoints = keyPoints.filter((kp, index) => kp.keyaspect !== originalKeyPoints[index].keyaspect);
        if (changedKeyPoints.length > 0) {
            const payload = {
                keyaspectId: portfolioId,
                keyaspects: changedKeyPoints.map(kp => ({ id: kp._id, keyaspect: kp.keyaspect }))
            };
            const response = await getApi("PUT", `/admin/portfolio/keyaspect`, payload);
            if (response.status === 200) {
                toast.success("Key Points updated successfully");
                console.log("Key Points updated successfully");
                fetchData();
                setEditKeyAspect(false);
            } else {
                toast.error("Failed to update Key Points");
            }
            console.log("Submitted Key Points:", changedKeyPoints);
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
                <div className="mt-5">
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium mb-4">Edit Key Points</h1>
                    <FontAwesomeIcon
                        className="text-lg cursor-pointer"
                        onClick={handleOnClose}
                        icon={faTimes}
                    />
                </div>

                {/* Render multiple input fields for key points */}
                {keyPoints?.map((keyPoint, index) => (
                    <div key={index} className="mb-4 flex items-center space-x-4">
                        <input
                            type="text"
                            name={`keypoint-${index}`}
                            value={keyPoint.keyaspect}
                            onChange={(e) => handleKeyPointChange(index, e)}
                            placeholder={`Enter keypoint ${index + 1}`}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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