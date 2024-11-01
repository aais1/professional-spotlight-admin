import React from 'react';

const ReviewPopup = ({ review, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">Review Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <p><strong>Review:</strong> {review.review}</p>
          <p><strong>Biography:</strong> {review.biographySlug}</p>
          <p><strong>Reviewer:</strong> {review.reviewer}</p>
          <p><strong>Rating:</strong> {review.rating}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;