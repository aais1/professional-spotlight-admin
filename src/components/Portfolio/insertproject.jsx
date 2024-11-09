import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import getApi from "../../Utils/apirequest.js";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function InsertPortfolio({ data, setShowModal, fetchData }) {
    const handleOnClose = () => {
        setShowModal(false);  // This will now properly close the modal
    };

    const [form, setForm] = useState({
        title: "",
        description: "",
        link: "",
        PortfolioId: data._id
    });

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleDescriptionChange = (content) => {
        setForm({
            ...form,
            description: content,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await getApi("POST", `/admin/portfolio/project`, form);
        if (response.status === 201) {
            fetchData();
            toast.success("Project added successfully");
            setShowModal(false);
        } else {
            toast.error("Failed to add project");
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
            <form className="bg-white p-10">
                <ToastContainer />
                <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Add Project
                    </h3>
                    <FontAwesomeIcon className="text-lg cursor-pointer" onClick={handleOnClose} icon={faTimes} />
                </div>
                <div className="mb-6">
                    <ReactQuill
                        value={form.description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Type your description"
                        className="bg-white dark:bg-boxdark text-black dark:text-white"
                    />
                </div>
                <button
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </form>
        </>
    );
}