import React, { useState } from "react";
import SelectGroupOne from './categorydropdown.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {toast, ToastContainer } from "react-toastify";
import { storage } from "../../firebase.js"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import getApi from "../../Utils/apirequest.js";

export default function InsertPortfolio({ setShowModal ,fetchData }) {
  const handleonclose = () => {
    setShowModal(false);
  };

  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    about: "",
    category: "",
    banner: "",
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {

    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      return;
    }
    const file = e.target.files[0];
    setImage(file);
  };

  const uploadImage = async (file) => {

    if (!file) {
      console.error("No file found");
      return null;
    }
    
    const sanitizedFileName = file.name.replace(/\s+/g, '-').toLowerCase(); // Sanitize file name
    const formattedTime = new Date().toISOString(); // Add timestamp to make filename unique
    
    // Define imageRef before using it
    const imageRef = ref(storage, `Portfolios/${sanitizedFileName}-${formattedTime}`);
  
    try {
      // Upload the file
      await uploadBytes(imageRef, file);
      
      // Get the download URL after upload
      const downloadURL = await getDownloadURL(imageRef);
    
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error.code, error.message);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (category === "") {
      console.error("No category found");
      toast.error("Please select a category");
      return;
    }

    if (!image) {
      console.error("No image found");
      toast.error("Please upload an image");
      return;
    }

    const imageUrl = await uploadImage(image);
  
    if (!imageUrl) {
      console.error("Failed to upload image");
      toast.error("Failed to upload image");
      return;
    }

    // Update form data with the imageUrl and category
    const updatedFormData = {
      ...form,
      banner: imageUrl,
      category: category,
    };

    try {
      const response = await getApi("POST", "/admin/portfolio", updatedFormData);
      if (response.status === 201) {
        toast.success("Portfolio added successfully");
        setForm({
          title: "",
          about: "",
          category: "",
          banner: "",
        });
        fetchData();
        setShowModal(false);
      } else {
        toast.error("Failed to add portfolio");
      }
    } catch (error) {
      console.error("Error adding portfolio:", error);
      toast.error("Failed to add portfolio");
    }
  };

  return (
    <div className="grid ">
      <ToastContainer />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Insert Portfolio
            </h3>
            <FontAwesomeIcon className="text-lg cursor-pointer" onClick={handleonclose} icon={faTimes} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Title"
                    onChange={handleFieldChange}
                    name="title"
                    value={form.title}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <SelectGroupOne selectedCategory={category} setcategory={setCategory} />
              <div>
                <span className="mb-1.5 text-black dark:text-white">
                  Upload your photo
                </span>
              </div>
              <div
                id="FileUpload"
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                        fill="#3C50E0"
                      />
                    </svg>
                  </span>
                  <p>
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                  <p>(max, 800 X 800px)</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  About me
                </label>
                <textarea
                  rows={6}
                  name="about"
                  onChange={handleFieldChange}
                  value={form.about}
                  placeholder="Enter About me..."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Add Portfolio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}