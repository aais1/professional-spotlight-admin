import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ReviewPopup from "../../components/Reviews/reviewPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import getApi from "../../Utils/apirequest";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

export default function ApproveReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    const response = await getApi("GET", "/admin/reviews");
    console.log(response);
    if (response?.status === 200) {
      setReviews(response.data.reviews);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedReview, setSelectedReview] = useState(null);

  const handleViewReview = (review) => {
    setSelectedReview(review);
  };

  const handleApproveReview = (id) => {
    setReviews(reviews.map(review =>
      review._id === id ? { ...review, approved: true } : review
    ));
    const response = getApi("PUT", `/admin/review/approve/${id}`, {})
  };

  const handleDeleteReview = async (id) => {
    setReviews(reviews.filter(review => review._id !== id));
    const response = getApi("DELETE", `/admin/review/reject/${id}`, {});
    // console.log(response);ad
    toast.success("Review deleted successfully");
  };

  const pendingReviews = reviews.filter(review => !review.approved);
  const approvedReviews = reviews.filter(review => review.approved);

  const ReviewTable = ({ reviews, showApproveButton }) => (
    <div className="overflow-hidden">
      <div className={`${reviews.length !== 0 ? 'h-96' : ''} overflow-y-auto scrollbar-hide`}>
        {reviews.length === 0 ? (

          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">No reviews found</p>
          </div>
        ) : (
          <table className="w-full min-w-max table-auto">
            <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
              <tr className="text-left">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Review</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Reviewer Name</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Biography</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Rating</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black w-44 sm:w-full text-wrap sm:text-nowrap dark:text-white">
                      {review.review.length > 70 ? `${review.review.substring(0, 70)}...` : review.review}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{review.reviewer}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{review.biographySlug}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{review.rating}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className={`px-3 py-1 rounded-full text-xs ${!review.approved ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}>
                      {review.approved ? "approved" : "pending"}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary" onClick={() => handleViewReview(review)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {showApproveButton && (
                        <button className="hover:text-green-500" onClick={() => handleApproveReview(review._id)}>
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                      <button className="hover:text-red-500" onClick={() => handleDeleteReview(review._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb pageName="Pending Reviews" />
      <ToastContainer />
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
        <ReviewTable reviews={pendingReviews} showApproveButton={true} />

        <h2 className="text-2xl font-bold my-8">Approved Reviews</h2>
        <ReviewTable reviews={approvedReviews} showApproveButton={false} />

        {selectedReview && (
          <ReviewPopup
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        )}
      </div>
    </>
  );
}