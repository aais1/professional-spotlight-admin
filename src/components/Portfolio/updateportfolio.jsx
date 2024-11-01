import React, { useState } from "react";
import SelectGroupOne from './categorydropdown.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import { storage } from "../../firebase.js"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import getApi from "../../Utils/apirequest.js";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function UpdatePortfolio({ data, setShowModal, fetchData }) {
  const handleOnClose = () => {
    setShowModal(false);
  };

  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(data.category);
  const [form, setForm] = useState({
    title: data.title,
    about: data.about,
    category: data.category,
    banner: data.banner,
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
      return null;
    }
    
    const sanitizedFileName = file.name.replace(/\s+/g, '-').toLowerCase();
    const formattedTime = new Date().toISOString();
    
    const imageRef = ref(storage, `Portfolios/${sanitizedFileName}-${formattedTime}`);
    
    try {
      await uploadBytes(imageRef, file);
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
      toast.error("Please select a category");
      return;
    }

    let imageUrl = form.banner;
    if (image) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        toast.error("Failed to upload image");
        return;
      }
    }

    const updatedFormData = {
      ...form,
      banner: imageUrl,
      category: category,
    };

    try {
      const response = await getApi("PUT", `/admin/portfolio/${data._id}`, updatedFormData);
      if (response.status === 200) {
        toast.success("Portfolio updated successfully");
        fetchData();
        setShowModal(false);
      } else {
        toast.error("Failed to update portfolio");
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast.error("Failed to update portfolio");
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
    <div className="grid">
      <ToastContainer />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Portfolio
            </h3>
            <FontAwesomeIcon className="text-lg cursor-pointer" onClick={handleOnClose} icon={faTimes} />
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
                      {/* SVG path data */}
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
                <ReactQuill
                  value={form.about}
                  onChange={(content) => setForm({ ...form, about: content })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter About me..."
                  className="bg-white dark:bg-boxdark text-black dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Update Portfolio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}