import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditProject from "./editproject";

export default function Project({ project, fetchData }) {
    const [showModal, setShowModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleEditClick = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="border w-96 rounded-md hover:shadow-2xl">
            <span className="flex justify-between items-center p-2">
                <span>
                    <h1 className="p-2">{project.title}</h1>
                </span>
            </span>
            <div className="p-2">
                <div
                    dangerouslySetInnerHTML={{
                        __html: isExpanded ? project.description : `${project.description.substring(0, 70)}...`
                    }}
                />
                <button onClick={toggleExpand} className="text-blue-500 ml-2">
                    {isExpanded ? "Show Less" : "See More"}
                </button>
            </div>

            <div className="flex w-full justify-end pr-10 pb-6 bottom-2 right-2 items-center space-x-4">
                <a href={project.link}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-lg text-gray-400" title="link for the project" />
                </a>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    onClick={handleEditClick}
                >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <EditProject setShowModal={setShowModal} data={project} fetchData={fetchData} />
                    </div>
                </div>
            )}
        </div>
    );
}