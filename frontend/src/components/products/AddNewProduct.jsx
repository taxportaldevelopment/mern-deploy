import React, { useState } from "react";
import newproductImg from "../../assets/add-new-product/new-product.png";
import { useMutation } from "@tanstack/react-query";
import { commenUrl } from "../../commen/CommenUrl";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const AddNewProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    brandname: "",
    offer: "",
    discount: "",
    originalPrice: "",
    category: "",
    stock: "",
    specifications: "",
    warranty: "",
    returnpolicy: "",
  });

  // onChange handle
  const onChange = (e) => {
    if (e.target.name == "file-image") {
      if (e.target.files.length === 0) return;
      setProductImg({ ...productImg, images: e.target.files });

      const files = Array.from(e.target.files);
      const imagePromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ name: file.name, src: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((results) => {
        setImages(results);
      });
    }else{
      setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }
  };

  const [images, setImages] = useState([]);
  const [productImg, setProductImg] = useState({ images: "" });
  // view current image
  // const [currentImage,setCurrentImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);


  // const handleImageRemove = (index) => {
  //   setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  // };
   const [isLoading,setIsLoading] = useState(false)
  const onSubmit = async(e) => {
    e.preventDefault();
    if(productDetails.price <= 0 || productDetails.stock <= 0){
           alert("price and stock should be greater than 0")
           return
  }
        try {
           setIsLoading(true)
          const formData = new FormData();
    
          formData.append("name",productDetails.name);
          formData.append("description",productDetails.description);
          formData.append("price",productDetails.price);
          formData.append("discount",productDetails.discount);
          formData.append("brandName",productDetails.brandname);
          formData.append("category",productDetails.category);
          formData.append("offer",productDetails.offer);
          formData.append("stock",productDetails.stock);
          formData.append("specifications",productDetails.specifications);
          formData.append("warranty",productDetails.warranty);
          formData.append("returnPolicy",productDetails.returnpolicy);
          for(let key of Object.keys(productImg.images)){
            formData.append("images",productImg.images[key])
        }
         const {data} = await axios.post(`${commenUrl}/api/v1/products/addproduct`,formData,{headers:{"Content-Type":"multipart/form-data"},
            withCredentials:true
          })
          
         if(!data.success){
              toast.error(data.error)
            } 
            toast.success(data.message)
            setProductDetails({
              name: "",
              description: "",
              price: "",
              brandname: "",
              category: "",
              stock: "",
              specifications: "",
              warranty: "",
              returnpolicy: "",
            })
        } catch (error){
              // console.log(error)
              throw new Error(error.message || "something went wrong");
        }finally{
            setIsLoading(false)
            
        }
  };

 
  return (
    <div className="bg-gray-100 p-5">
      <div className="lg:max-w-9/10 lg:mx-auto">
        <div className="md:flex md:flex-nowrap">
          <div className="md:w-2/4 w-full p-4">
            <div className="product-title">
              <h1 className="text-3xl font-bold product-font">
                Add New Product
              </h1>
              {/* product image */}
              <div className="product-image mt-4 p-3">
                {/* current image show */}
                {images.length == 0 ? (
                  <img
                    src={newproductImg}
                    alt="Product"
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <img
                    src={images[currentIndex].src}
                    alt=""
                    className="w-full h-96 object-cover"
                  />
                )}

              </div>
              {/* next image show */}
              <div className="flex justify-center items-center">
                {/* images list */}
                <div className="flex justify-evenly items-center">
                  {images.map((img, index) => (
                    <div
                      className="w-20 h-20 shadow-md borde rounded m-2 relative"
                      onMouseOver={() => setCurrentIndex(index)}
                      key={index}
                    >
                      <img
                        src={img.src}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                      {/* remove image */}
                      {/* <div className="remove-image absolute top-0 right-0">
                        <button
                          onClick={() => handleImageRemove(index)}
                          className="bg-red-500 text-white rounded-full p-1"
                        >
                          X
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/3 w-full p-3">
            <div className="grid grid-cols-3 gap-4 mt-4"></div>
            <div className="product-form">
              <form
                className="mt-4"
                onSubmit={onSubmit}
                encType="multipart/form-data"
              >
                {/* image file choose */}
                <div className="form-group mb-4">
                  <label htmlFor="file-image" className="block text-lg py-2">
                    Select Image:
                  </label>
                  <input
                    type="file"
                    id="file-image"
                    name="file-image"
                    placeholder="Product name...."
                    multiple
                    accept="image/*"
                    onChange={onChange}
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="product-name" className="block text-lg py-2">
                    Product Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productDetails.name}
                    onChange={onChange}
                    placeholder="Product name...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-description"
                    className="block text-lg py-2"
                  >
                    Product Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    onChange={onChange}
                    value={productDetails.description}
                    placeholder="Product description...."
                    className="border rounded-md w-full h-20 p-2"
                   
                  ></textarea>
                </div>
                
                 {/* price */}
                <div className="form-group mb-4">
                  <label htmlFor="product-price" className="block text-lg py-2">
                    Product Price:
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productDetails.price}
                    onChange={onChange}
                    placeholder="Product price...."
                    min={0}
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                {/* discount */}
                <div className="form-group mb-4">
                  <label htmlFor="product-discount" className="block text-lg py-2">
                    Product Discount:
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={productDetails.discount}
                    onChange={onChange}
                    placeholder="Product discount...."
                    min={0}
                    className="border rounded-md w-full h-10 p-2"
                  />
                </div>
                {/* offer */}
                <div className="form-group mb-4">
                  <label htmlFor="product-offer" className="block text-lg py-2">
                    Product Offer:
                  </label>
                  <input
                    type="number"
                    id="offer"
                    name="offer"
                    value={productDetails.offer}
                    onChange={onChange}
                    placeholder="Product offer...."
                    min={0}
                    className="border rounded-md w-full h-10 p-2"
             
                  />
                </div>
                {/* brand name */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-brandName"
                    className="block text-lg py-2"
                  >
                    Brand Name:
                  </label>
                  <input
                    type="text"
                    id="brandname"
                    name="brandname"
                    value={productDetails.brandname}
                    onChange={onChange}
                    placeholder="Prand Name...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                {/* category */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-category"
                    className="block text-lg py-2"
                  >
                    Product Category:
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={productDetails.category}
                    onChange={onChange}
                    placeholder="Product category...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>

                {/* tax amount */}
                {/* <div className="form-group mb-4">
                  <label htmlFor="product-tax" className="block text-lg py-2">
                    Product Tax:
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="tax"
                    name="tax"
                    min="0"
                    value={productDetails.tax}
                    onChange={onChange}
                    placeholder="Product tax...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div> */}
                {/* stock */}
                <div className="form-group mb-4">
                  <label htmlFor="product-stock" className="block text-lg py-2">
                    Product Stock:
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={productDetails.stock}
                    onChange={onChange}
                    min={1}
                    placeholder="Product stock...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                {/* Product Specifications */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-specifications"
                    className="block text-lg py-2"
                  >
                    Product Specifications:
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    value={productDetails.specifications}
                    onChange={onChange}
                    placeholder="key point1 / key point2 / key point3"
                    className="border rounded-md w-full h-20 p-2"
                    required
                  ></textarea>
                </div>
                {/* Warranty: */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-warranty"
                    className="block text-lg py-2"
                  >
                    Product Warranty:
                  </label>
                  <input
                    type="text"
                    list="warranty-sec"
                    id="warranty-list"
                    name="warranty"
                    value={productDetails.warranty}
                    onChange={onChange}
                    placeholder="Product warranty...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />

                  <datalist id="warranty-sec">
                    <option value="1 month warranty" />
                    <option value="1 year warranty" />
                    <option value="2 year warranty" />
                    <option value="3 year warranty" />
                    <option value="4 year warranty" />
                  </datalist>
                </div>
                {/* Return Policy */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-return-policy"
                    className="block text-lg py-2"
                  >
                    Product Return Policy:
                  </label>
                  {/* <input type="text" id="product-return-policy" name="product-return-policy" placeholder='Product return policy....' className='border rounded-md w-full h-10 p-2' required /> */}
                  <input
                    list="browsers"
                    name="returnpolicy"
                    value={productDetails.returnpolicy}
                    onChange={onChange}
                    id="browser"
                    placeholder="Product return policy...."
                    className="border rounded-md w-full h-10 p-2"
                  />
                  <datalist id="browsers">
                    <option value="7 days return policy" />
                    <option value="10 days return policy" />
                    <option value="15 days return policy" />
                    <option value="30 days return policy" />
                  </datalist>
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="bg-green-400 hover:bg-green-300 text-white rounded-md px-4 py-2 me-1"
                    disabled={isLoading}
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
