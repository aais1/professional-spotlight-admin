import React, { useState, useEffect } from "react";
import Project from "../../components/Portfolio/projectscard";
import InsertProject from "../../components/Portfolio/insertproject";
import InsertKeyPoint from "../../components/Portfolio/insertkeypoint";
import EditKeypoints from "../../components/Portfolio/editkeypoints";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import getApi from "../../Utils/apirequest.js";

export default function Subdetailspage({ portfolioId, onBack, data }) {
    const [showModal, setShowModal] = useState(null);
    const [editkeyaspect, setEditKeyAspect] = useState(false);
    const [addkeyaspect, setAddKeyAspect] = useState(false);
    const [projects, setProjects] = useState([]);
    const [keypoints, setKeypoints] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getApi("GET", `/admin/portfolio/${portfolioId}`);
            setProjects(response.data.project);
            setKeypoints(response.data.keyaspect);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [portfolioId]);

    if (!data) {
        return <div>Loading...</div>;
    }

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
                        onClick={() => setShowModal(true)}
                        className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    >
                        Add new Project
                    </button>
                    <button
                        onClick={() => setEditKeyAspect(true)}
                        className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    >
                        Update key aspects
                    </button>
                    <button
                        onClick={() => setAddKeyAspect(true)}
                        className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-2 sm:px-4 rounded-md"
                    >
                        Add key aspects
                    </button>
                </span>
            </div>
            <div className="p-6">
                <h1 className="text-xl font-semibold">Projects</h1>
                <div className="flex space-x-2 justify-around gap-2 flex-wrap">
                    {projects?.map((project) => (
                        <Project key={project.id} project={project} fetchData={fetchData} />
                    ))}
                </div>
                <h1 className="text-xl m-2 font-semibold">Key Aspects</h1>
                <div className="grid m-2 border border-black-2 p-2 rounded-md justify-start gap-3">
                    {keypoints?.map((keypoint) => (
                        <div key={keypoint._id}>
                            {keypoint.keyaspect.map((aspect, index) => (
                                <li key={index} className="text-sm sm:text-lg">{aspect}</li>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <InsertProject data={data} setShowModal={setShowModal} fetchData={fetchData} />
                    </div>
                </div>
            )}
            {addkeyaspect && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <InsertKeyPoint data={data} setAddKeyAspect={setAddKeyAspect} fetchData={fetchData} />
                    </div>
                </div>
            )}
            {editkeyaspect && (
                <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                    <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                        <EditKeypoints portfolioId={portfolioId} keypoints={keypoints} setEditKeyAspect={setEditKeyAspect} fetchData={fetchData} />
                    </div>
                </div>
            )}
        </div>
    );
}
