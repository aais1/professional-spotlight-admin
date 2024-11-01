import React, { useEffect, useState } from "react";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Reviews from '../../components/Reviews/review'
import Insertreview from "../../components/Reviews/insertreview";
import  getApi  from "../../Utils/apirequest";
export default function reviews() {
    const [showModal, setShowModal] = useState(null);
    const [reviews, setReviews] = useState([]);
    const fetchData = async () => {
        const response = await getApi("GET","/admin/reviews/approved");
      if (response?.status == 200) {
        setReviews(response.data.reviews);
      }
      }
    useEffect(() => {
        fetchData();
    }
    , []);
       
    return (
        <>
            <Breadcrumb pageName="Reviews" />
            <div className="flex w-full justify-end">
                <button
                    className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => setShowModal(true)}
                >
                    Add new Review
                </button>
            </div>
            <div className="mt-2">
                {
                    <Reviews  reviews={reviews} fetchData={fetchData} />
                }
            </div>
            {showModal && (
                        <div className="fixed inset-0 h-screen sm:ml-46 flex items-center justify-center z-50">
                            <div className="p-1 sm:p-4 w-full sm:w-4/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                                <Insertreview setShowModal={setShowModal} fetchData={fetchData} />
                            </div>
                        </div>
                    )}
          

        </>
    )
}
