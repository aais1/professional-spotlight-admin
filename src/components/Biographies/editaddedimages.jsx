import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function InsertKeyPoint({ data, setEditKeyAspect }) {
    const [keyPoints, setKeyPoints] = useState(data);

    // Add a new input field for a key point
    const handleAddKeyPoint = () => {
        setKeyPoints([...keyPoints, ""]);
    };

    // Handle input change for key points
    const handleKeyPointChange = (index, event) => {
        const updatedKeyPoints = [...keyPoints];
        updatedKeyPoints[index] = event.target.value;
        setKeyPoints(updatedKeyPoints);
    };

    // Handle key point deletion
    const handleDeleteKeyPoint = (index) => {
        const updatedKeyPoints = keyPoints.filter((_, i) => i !== index);
        setKeyPoints(updatedKeyPoints);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
       
        setShowModal(false); // Close modal on submit
    };

    // Handle modal close
    const handleOnClose = () => {
        setEditKeyAspect (false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white p-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium mb-4">Edit Added Images</h1>
                    <FontAwesomeIcon
                        className="text-lg cursor-pointer"
                        onClick={handleOnClose}
                        icon={faTimes}
                    />
                </div>

                {/* Render multiple input fields for key points */}
                {keyPoints.map((keyPoint, index) => (
                    <div key={index} className="mb-4 flex items-center space-x-4">
                        <input
                            type="text"
                            name={`keypoint-${index}`}
                            value={keyPoint}
                            onChange={(e) => handleKeyPointChange(index, e)}
                            placeholder={`Enter keypoint ${index + 1}`}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteKeyPoint(index)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}

                {/* Add key point button */}
                <div className="mb-4">
                    <button
                        type="button"
                        className="flex items-center space-x-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                        onClick={handleAddKeyPoint}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add images</span>
                    </button>
                </div>

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
