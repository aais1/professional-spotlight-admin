import React, { useEffect, useState } from "react";
import getApi from "../../Utils/apirequest.js";
import { FaFacebook, FaInstagram, FaLinkedin, FaCopy, FaCheckCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";

export default function BiographyPage() {
  console.log("page called!");
  const [biography, setBiography] = useState({});
  const [email, setEmail] = useState(""); // State to store email input
  const [isChecked, setIsChecked] = useState(false); // State to store checkbox status
  const [isLoadingBiography, setIsLoadingBiography] = useState(false); // Loading state for fetching biography
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false); // Loading state for subscription
  const [copySuccess, setCopySuccess] = useState(""); // State for copy success message
  const [hasFetchedBiography, setHasFetchedBiography] = useState(false); // State to track if biography has been fetched

  const location = useLocation();
  const { slug } = useParams();

  const fetchBiography = async (slug) => {
    setIsLoadingBiography(true); // Start loading
    try {
      const response = await getApi("GET", `/admin/testing/${slug}`);
      console.log("Response Data:", response.data);
      if (response && response.data.biography) {
        setBiography(response.data.biography);
      } else {
        setBiography({});
      }
    } catch (error) {
      console.error("Error fetching biography:", error);
      setBiography({});
    } finally {
      setIsLoadingBiography(false); // End loading
      setHasFetchedBiography(true); // Mark biography as fetched
    }
  };

  useEffect(() => {
    console.log("Biography from state:", biography);

    // Check if biography has not been fetched yet and trigger the fetch
    if (!hasFetchedBiography) {
      console.log("Biography not available, fetching from API...");
      const slugFromUrl = location.pathname.split("/").pop(); // Extract the slug from the URL
      fetchBiography(slugFromUrl); // Fetch the biography using the slug
    }
  }, [hasFetchedBiography, location.pathname]);

  // Function to handle email subscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!isChecked) {
      alert("You must agree to the privacy policy and terms.");
      return;
    }

    setIsLoadingSubscription(true); // Start loading
    try {
      const response = await getApi("POST", "/user/biography/subscribe", {
        email: email,
      });
      console.log("Subscription successful:", response);
      if (response.message === "Subscribed successfully") {
        alert("Subscribed successfully!");
        setEmail("");
        setIsChecked(false); // Reset checkbox after successful subscription
      } else {
        alert("You may have already subscribed with this email!");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsLoadingSubscription(false); // End loading
    }
  };

  // Function to copy the current URL to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess("Link copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Clear the message after 2 seconds
    });
  };

  // Return early if biography is not available
  if (!biography.title) {
    return <p>No biography data available</p>;
  }

  return (
    <>
      {/* Loader Overlay for Initial Data Fetching */}
      {isLoadingBiography && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#124e66]"></div>
        </div>
      )}

      <div>
        <div className="relative bg-center rounded-lg h-full w-full bg-[#d4d9d3] ">
          <div
            className="bg-cover bg-center flex-col rounded-lg h-56 sm:h-96 flex justify-center items-center w-screen sm:w-full"
            style={{
              backgroundImage: `url(${biography.banner})`,
            }}
          >
            <h1 className="text-3xl sm:text-6xl font-semibold font-[Frutiger] text-white">
              {biography.title}
            </h1>
          </div>

          <div className="grid sm:flex">
            <div
              className="w-4/5 m-4 h-150 flex flex-wrap overflow-auto p-2 text-xs sm:text-base sm:p-12"
              style={{ lineHeight: "2", scrollbarColor: "transparent transparent" }}
            >
              <p className="text-[#124e66]">
                {biography.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}