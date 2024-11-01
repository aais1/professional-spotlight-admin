import React, { useState, useEffect } from "react";
import Portfolioinputform from "../../components/Portfolio/insertportfolio";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Subdetailspage from './subdetails.jsx';
import Card from '../../components/Portfolio/portfoliocard';
import getApi from '../../Utils/apirequest.js';

export default function Portfolio() {
    const [showModal, setShowModal] = useState(false);
    const [subdetails, setSubdetails] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 6;
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async (page) => {
        try {
            const response = await getApi("GET", `/admin/portfolios?page=${page}&limit=${itemsPerPage}`);
            setData(response.data.portfolio);
          
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    // Get current items for the page
    const getCurrentItems = () => {
        return data;
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCardClick = (itemId) => {
        setSelectedItemId(itemId);
        setSubdetails(true);
    };

    const handleBackClick = () => {
        setSubdetails(false);
        setSelectedItemId(null);
    };

    return (
        <>
            <Breadcrumb pageName="Portfolio" />
            {subdetails ? (
                <Subdetailspage 
                    portfolioId={selectedItemId} 
                    onBack={handleBackClick}
                    data={data.find(item => item._id === selectedItemId)}
                    fetchData={fetchData}
                />
            ) : (
                <>
                    <div className="w-full flex mb-3 justify-end">
                        <button
                            className="bg-boxdark hover:bg-graydark hover:shadow-1 text-white font-bold py-2 px-4 rounded-md"
                            onClick={() => setShowModal(true)}
                        >
                            Add new
                        </button>
                    </div>
                    <div className="flex gap-2 mt-10 justify-around flex-wrap">
                        {getCurrentItems().map((item) => (
                            <Card 
                                data={item} 
                                key={item._id} 
                                onCardClick={handleCardClick}
                                fetchData={fetchData}
                            />
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 h-screen sm:ml-10 flex items-center justify-center z-50">
                            <div className="p-1 sm:p-4 w-full sm:w-2/5 h-125 sm:h-150 mt-10 rounded overflow-auto" style={{ scrollbarColor: 'transparent transparent' }}>
                                <Portfolioinputform setShowModal={setShowModal} fetchData={fetchData} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}