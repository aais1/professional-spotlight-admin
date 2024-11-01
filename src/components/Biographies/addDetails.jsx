import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PostApi from '../../Utils/apirequest';
import { toast, ToastContainer } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function InsertPortfolio({
    portfolio,
    setShowModal,
    fetchData,
}) {
    const [data, setData] = React.useState({
        description: portfolio.description || '',
        title: portfolio.title || '',
    });

    // Simplified onChange handler for ReactQuill
    const handleFieldChange = (content) => {
        setData(prevData => ({
            ...prevData,
            description: content
        }));
    };

    const handleOnClose = () => {
        setShowModal(false);
    };

    // Custom colors array including #124e66
    const colors = [
        '#000000', '#124e66', '#1a5f7a', '#2c3e50', '#2980b9', 
        '#3498db', '#27ae60', '#16a085', '#f1c40f', '#f39c12',
        '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#9b59b6',
        '#8e44ad', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'
    ];

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: colors }, { background: colors }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ]
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'script',
        'indent',
        'direction',
        'size',
        'color',
        'background',
        'align',
        'blockquote',
        'code-block',
        'list',
        'bullet',
        'link'
    ];

    const handlesubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await PostApi('POST', '/admin/biography', data);
            if (response.status === 200) {
                fetchData();
                toast.success('Description updated successfully');
                setShowModal(false);
            }
        } catch (error) {
            toast.error('Failed to update description');
            console.error('Error updating description:', error);
        }
    };

    return (
        <>
            <form className="bg-white p-10">
                <ToastContainer />
                <div className="border-b flex justify-between border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Add description
                    </h3>
                    <FontAwesomeIcon
                        className="text-lg cursor-pointer"
                        onClick={handleOnClose}
                        icon={faTimes}
                    />
                </div>
                <div className="mb-6">
                    <div className="mb-4">
                        <label className="mb-1.5 block text-black dark:text-white">
                            Biography
                        </label>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            onChange={handleFieldChange}
                            name="description"
                            value={data.description}
                            placeholder="Write the biography here..."
                            className="bg-white dark:bg-boxdark text-black dark:text-white"
                            theme="snow"
                        />
                    </div>
                </div>
                <button
                    onClick={handlesubmit}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                    Submit
                </button>
            </form>
        </>
    );
}