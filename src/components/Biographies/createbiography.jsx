import React, { useState, useEffect } from "react";
import Categorydropdown from "./categorydropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { storage } from "../../firebase.js"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import Apirequest from '../../Utils/apirequest';

export default function ({ setShowModal, fetchData }) {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [category, setCategory] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        banner: "",
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category: category,
        }));
    }, [category]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            setPreviewUrl(null);
            return;
        }
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file) => {
        if (!file) {
            toast.error("No file found");
            return null;
        }

        const sanitizedFileName = file.name.replace(/\s+/g, '-').toLowerCase();
        const formattedTime = new Date().toISOString();
        const imageRef = ref(storage, `Biographies/${sanitizedFileName}-${formattedTime}`);

        try {
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
        } catch (error) {
            toast.error(`Failed to upload image: ${error.message}`);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.category === "") {
            toast.error("Please select a category");
            return;
        }

        if (!image) {
            toast.error("Please upload an image");
            return;
        }

        const imageUrl = await uploadImage(image);
        if (!imageUrl) {
            toast.error("Failed to upload image");
            return;
        }

        const updatedFormData = {
            ...formData,
            banner: imageUrl,
        };

        try {
            const response = await Apirequest('POST', '/admin/biography', updatedFormData);
            if (response.status === 201) {
                fetchData();
                toast.success("Biography added successfully");
                setShowModal(false);
            } else {
                toast.error('Failed to add biography');
            }
        } catch (error) {
            toast.error('An error occurred while adding biography');
        }
    };

    const handleOnClose = () => {
        setShowModal(false);
    };

    return (
        <div className="grid">
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
                style={{ zIndex: 9999 }}
            />
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Insert Biography</h3>
                        <FontAwesomeIcon className="text-lg" onClick={handleOnClose} icon={faTimes} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your Title"
                                        name="title"
                                        onChange={handleFieldChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <Categorydropdown setcategory={setCategory} />
                            <div>
                                <span className="mb-1.5 text-black dark:text-white">Upload your photo</span>
                            </div>
                            <div id="FileUpload" className="relative mb-5.5 block w-full cursor-pointer rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"></span>
                                    <p><span className="text-primary">Click to upload</span> or drag and drop</p>
                                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                    <p>(max, 800 X 800px)</p>
                                </div>
                            </div>
                            {previewUrl && (
                                <div className="mb-4">
                                    <img src={previewUrl} alt="Uploaded Preview" className="w-full h-auto rounded" />
                                </div>
                            )}
                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
