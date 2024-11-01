import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import getApi from "../../Utils/apirequest.js";
import { toast, ToastContainer } from "react-toastify";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function UpdateProject({ data, setShowModal, fetchData }) {
    const [title, setTitle] = useState(data.title);
    const [link, setLink] = useState(data.link);
    const [description, setDescription] = useState(data.description);

    const handleOnClose = () => {
        setShowModal(false);  // Properly close the modal
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            link,
            id: data._id,
            description
        };

        try {
            console.log("payload",payload);
            const response = await getApi("PUT", `/admin/portfolio/project`, payload);
      console.log(response);
            if (response.status === 200) {
                console.log("Project updated successfully");
                fetchData();
                toast.success("Project updated successfully");
                setShowModal(false);
            } else {
                // Handle error response
                console.error("Failed to update project");
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image',
        'color', 'background'
    ];

    return (
        <>
            <form className="bg-white p-10" onSubmit={handleSubmit}>
                <ToastContainer />
                <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Edit Project
                    </h3>
                    <FontAwesomeIcon className="text-lg cursor-pointer" onClick={handleOnClose} icon={faTimes} />
                </div>
                <div className="w-full xl:w-1/2x">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your title"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Link
                    </label>
                    <input
                        type="text"
                        name="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enter your Link"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Description
                    </label>
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                        formats={formats}
                        placeholder="Type your description"
                        className="bg-white dark:bg-boxdark text-black dark:text-white"
                    />
                </div>
                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Submit
                </button>
            </form>
        </>
    );
}