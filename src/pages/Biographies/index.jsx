import React, { useState, useEffect } from "react";
import Biographyinputform from "../../components/Biographies/createbiography";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Subdetailspage from './cardsubdetails';
import Card from '../../components/Biographies/biographycard';
import getApi from '../../Utils/apirequest';

export default function Portfolio() {
    const [showModal, setShowModal] = useState(false);
    const [subdetails, setSubdetails] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await getApi('GET', `/admin/biographies?page=${currentPage}&limit=${itemsPerPage}`);
            console.log('RESPONSE', response.data.biographies);
            setData(response.data.biographies);
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    useEffect(() => {
      
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        console.log('DATA', data);
        setFilteredData(data);
    }, [data]);

    // Get current items for the page
    const getCurrentItems = () => {
        return filteredData;
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
            <Breadcrumb pageName="Biographies" />
            {subdetails ? (
                <Subdetailspage 
                    portfolioId={selectedItemId} 
                    onBack={handleBackClick}
                     fetchData={fetchData}
                    data={data.find(item => item._id === selectedItemId)}
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
                            // console.log('ITEM', item),
                            <Card 
                                data={item} 
                                key={item._id} 
                                onCardClick={handleCardClick}
                                //  send get function here
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
                                <Biographyinputform setShowModal={setShowModal} fetchData={fetchData} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}