import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import getApi from "../../Utils/apirequest.js";

export default function InsertKeyPoint({ data, setAddKeyAspect, fetchData }) {
    const [keyPoints, setKeyPoints] = useState([{ keypoint: "" }]);

    const handleKeyPointChange = (index, event) => {
        const newKeyPoints = [...keyPoints];
        newKeyPoints[index].keypoint = event.target.value;
        setKeyPoints(newKeyPoints);
    };

    const handleAddKeyPoint = () => {
        setKeyPoints([...keyPoints, { keypoint: "" }]);
    };

    const handleRemoveKeyPoint = (index) => {
        const newKeyPoints = keyPoints.filter((_, i) => i !== index);
        setKeyPoints(newKeyPoints);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate empty keypoints
        const validKeyPoints = keyPoints.filter(kp => kp.keypoint.trim() !== "");
        if (validKeyPoints.length === 0) {
            toast.error("Please add at least one key point");
            return;
        }

        const payload = {
            PortfolioId: data._id,
            keyaspects: validKeyPoints.map(kp => kp.keypoint)
        };

        try {
            const response = await getApi("POST", `/admin/portfolio/keyaspect`, payload);
            
            if (response.status === 201) {
                toast.success("Key Points added successfully");
                fetchData();
                setAddKeyAspect(false);
            } else {
                throw new Error("Failed to add Key Points");
            }
        } catch (error) {
            toast.error(error.message || "Failed to add Key Points");
            console.error("Error adding key points:", error);
        }
    };

    return (
        <div className="grid">
            <ToastContainer />
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Insert Key Points
                        </h3>
                        <FontAwesomeIcon 
                            className="text-lg cursor-pointer" 
                            onClick={() => setAddKeyAspect(false)} 
                            icon={faTimes} 
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            {keyPoints.map((kp, index) => (
                                <div key={index} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Key Point {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Key Point"
                                            value={kp.keypoint}
                                            onChange={(e) => handleKeyPointChange(index, e)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        {keyPoints.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveKeyPoint(index)} 
                                                className="mt-2 text-red-500"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={handleAddKeyPoint} 
                                className="flex items-center text-blue-500"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add Key Point
                            </button>
                            <button 
                                type="submit" 
                                className="mt-4 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                Add Key Points
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}