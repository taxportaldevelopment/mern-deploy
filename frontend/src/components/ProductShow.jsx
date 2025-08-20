import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { IoStar, IoStarOutline, IoChevronUpOutline, IoChevronDownOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import { commenUrl } from '../commen/CommenUrl';
import UserCart from '../UserCart';

const ProductShow = () => {
    const { id } = useParams();
    const [changeIndex, setChangeIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const thumbnailsRef = useRef(null);

    const { data: getsingle } = useQuery({
        queryKey: ["getsingleproduct"],
        queryFn: async () => {
            // eslint-disable-next-line no-useless-catch
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/getsingle-product/${id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    });

    useEffect(() => {
            function getRefresh() {
      window.scrollTo(0, 0);
    }
    getRefresh();
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollThumbnails = (direction) => {
        if (!thumbnailsRef.current) return;
        
        const scrollAmount = isMobile ? 100 : 100;
        const scrollOptions = {
            behavior: 'smooth'
        };

        if (isMobile) {
            scrollOptions.left = direction === 'left' ? -scrollAmount : scrollAmount;
        } else {
            scrollOptions.top = direction === 'up' ? -scrollAmount : scrollAmount;
        }

        thumbnailsRef.current.scrollBy(scrollOptions);
    };

const handleThumbnailClick = (index) => {
    if (index < 0 || index >= getsingle?.product.images.length) return;

    // ✅ Update main image
    setChangeIndex(index);

    // ✅ Scroll the thumbnail into view
    if (thumbnailsRef.current) {
        const thumbnail = thumbnailsRef.current.children[index];
        const container = thumbnailsRef.current;
        const containerSize = isMobile ? container.offsetWidth : container.offsetHeight;
        const thumbnailSize = isMobile ? thumbnail.offsetWidth : thumbnail.offsetHeight;
        const scrollPosition = (thumbnailSize * index) - (containerSize / 2) + (thumbnailSize / 2);

        if (isMobile) {
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        } else {
            container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }
};


    const navigateImages = (direction) => {
        const newIndex = direction === 'prev' 
            ? Math.max(0, changeIndex - 1)
            : Math.min(getsingle?.product.images.length - 1, changeIndex + 1);
        setChangeIndex(newIndex);
        handleThumbnailClick(newIndex);
    };

    const rating = getsingle?.product.ratings || 0;
    const reviewCount = getsingle?.product.numOfReviews || 0;

    return (
        <div className="bg-white">
            <div className="container px-4 py-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Product Images */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnails Container */}
                            <div className="relative flex md:flex-col items-center">
                                {/* Desktop Up Arrow */}
                                <button
                                    onClick={() => scrollThumbnails('up')}
                                    className="hidden md:block p-2 mb-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                >
                                    <IoChevronUpOutline className="text-gray-600" />
                                </button>

                                {/* Thumbnails */}
                                <div
                                    ref={thumbnailsRef}
                                    className={`flex ${isMobile ? 'flex-row overflow-x-auto' : 'flex-col overflow-y-hidden'} gap-2 max-h-[400px] scrollbar-hide`}
                                >
                                    {getsingle?.product.images.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 w-16 h-16 border rounded cursor-pointer transition-all ${
                                                changeIndex === index 
                                                    ? "ring-2 ring-blue-500 border-blue-500" 
                                                    : "hover:border-gray-400"
                                            }`}
                                            onClick={() =>handleThumbnailClick(index)}
                                        >
                                            <img
                                                src={item}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Down Arrow */}
                                <button
                                    onClick={() => scrollThumbnails('down')}
                                    className="hidden md:block p-2 mt-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                >
                                    <IoChevronDownOutline className="text-gray-600" />
                                </button>

                                {/* Mobile Arrows */}
                                <div className="md:hidden flex justify-between w-full mt-2">
                                    <button
                                        onClick={() => scrollThumbnails('left')}
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        <IoChevronBackOutline className="text-gray-600" />
                                    </button>
                                    <span className="text-sm text-gray-600 self-center">
                                        {changeIndex + 1} / {getsingle?.product.images.length}
                                    </span>
                                    <button
                                        onClick={() => scrollThumbnails('right')}
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        <IoChevronForwardOutline className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                <img
                                    src={getsingle?.product.images[changeIndex]}
                                    alt="Product"
                                    className="w-full h-full object-contain max-h-[500px] rounded"
                                />

                                {/* Main Image Navigation */}
                                <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
                                    <button
                                        onClick={() => navigateImages('prev')}
                                        className={`pointer-events-auto p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors ${changeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={changeIndex === 0}
                                    >
                                        <IoChevronBackOutline className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => navigateImages('next')}
                                        className={`pointer-events-auto p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors ${changeIndex === getsingle?.product.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={changeIndex === getsingle?.product.images.length - 1}
                                    >
                                        <IoChevronForwardOutline className="text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full lg:w-1/2 p-4">
                        <h1 className="lg:text-2xl font-bold text-gray-800">{getsingle?.product.name}</h1>
                        <h2 className="text-xl font-semibold text-gray-900 mt-4">
                            Price: ₹{getsingle?.product.price.toLocaleString()}
                        </h2>
                       {/* stock only 5 left */}
                        {getsingle?.product.stock <= 5 && getsingle?.product.stock > 0 && (
                            <p className="text-sm text-red-600 mt-2">
                                Hurry! Only {getsingle?.product.stock} left in stock.
                            </p>
                        )}
                        {/* Rating */}
                        <div className="flex items-center mt-3">
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    index < Math.round(rating)
                                        ? <IoStar key={index} className="text-yellow-500" />
                                        : <IoStarOutline key={index} className="text-gray-300" />
                                ))}
                            </div>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {rating.toFixed(1)} ({reviewCount} reviews)
                            </span>
                        </div>
                        {/* offer */}
                        <div className="mt-3 text-sm">
                            {getsingle?.product.offer !== 0 ? <span className="font-semibold">Offer: </span> : ""}
                            {/* only show 0 */}
                            {getsingle?.product.offer === 0 ? (
                               ""
                            ) : (
                                <span className="text-green-600">₹{getsingle?.product.offer.toLocaleString()}</span>
                            )}
                        </div>
                        {/* Stock Status */}
                        <p className="mt-3 text-sm">
                            Availability:{" "}
                            <span className={getsingle?.product.stock > 0 ? "text-green-600" : "text-red-600"}>
                                {getsingle?.product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </p>

                        {/* Add to Cart */}
                        {getsingle?.product.stock > 0 && <UserCart productId={id} price={getsingle?.product.price} />}

                        {/* Return Policy */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Return Policy:</h3>
                            <p className="text-sm text-gray-600 mt-1">{getsingle?.product.returnPolicy}</p>
                        </div>

                        {/* Warranty */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Warranty:</h3>
                            <p className="text-sm text-gray-600 mt-1">{getsingle?.product.warranty}</p>
                        </div>

                        {/* Specifications */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Product Specifications:</h3>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {getsingle?.product.specifications?.map((item, index) => (
                                    <li key={index} className="text-sm text-gray-600">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Description:</h3>
                            <p className="text-sm text-gray-600 mt-1">{getsingle?.product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold border-b pb-2">Customer Reviews</h2>
                    <div className="space-y-6 mt-4">
                        {[1, 2, 3].map((review) => (
                            <div key={review} className="flex items-start gap-4 py-4 border-b">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <FaUserCheck className="w-full h-full text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">User Name <span className='text-xs text-white mt-1 bg-green-700 p-1 rounded'>verified</span></h3>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <IoStar key={i} className="text-yellow-500" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {review === 1
                                            ? "This product is amazing! Highly recommend it."
                                            : "Great value for money. Satisfied with the purchase."}
                                    </p>
                                    {/* <span className="text-xs text-gray-400 mt-1 block">2 days ago</span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductShow;