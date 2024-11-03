import React, { useState } from "react";
import SelectGroupOne from './categorydropdown.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import { storage } from "../../firebase.js"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import getApi from "../../Utils/apirequest.js";

export default function InsertPortfolio({ setShowModal, fetchData }) {
  const handleonclose = () => setShowModal(false);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
    const imageRef = ref(storage, `Portfolios/${sanitizedFileName}-${formattedTime}`);
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
    if (category === "") {
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
      toast.error("Failed to add portfolio");
    }
  };

  return (
    <div className="grid">
      <ToastContainer />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Insert Portfolio</h3>
            <FontAwesomeIcon className="text-lg cursor-pointer" onClick={handleonclose} icon={faTimes} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Title</label>
                  <input
                    type="text"
                    placeholder="Enter your Title"
                    onChange={handleFieldChange}
                    name="title"
                    value={form.title}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <SelectGroupOne selectedCategory={category} setcategory={setCategory} />
              <div>
                <span className="mb-1.5 text-black dark:text-white">Upload your photo</span>
              </div>
              <div id="FileUpload" className="relative mb-5.5 block w-full cursor-pointer rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none" />
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
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">About me</label>
                <textarea
                  rows={6}
                  name="about"
                  onChange={handleFieldChange}
                  value={form.about}
                  placeholder="Enter About me..."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Add Portfolio</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
