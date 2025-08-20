import React, { useEffect, useState } from "react";
import { useQuery,useQueryClient} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { commenUrl } from "../../commen/CommenUrl";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// import newUpdateimg from "../../assets/add-new-product/new-product.png";

const ProductUpdate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { id } = useParams();
  const [productImg, setProductImg] = useState({ images: "" });
  const [images, setImages] = useState([]);


  const handleDeleteProduct = (productId) => {

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        fetch(`${commenUrl}/api/v1/products/getsingle-productdelete/${productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                toast.success("Product deleted successfully");
                queryClient.invalidateQueries(["getallproducts"]); // Invalidate the query to refetch data
                navigate("/admin/productlist"); // Redirect to home or product list page
            } else {
                toast.error(data.error || "Something went wrong");
            }
        })
        .catch(error => {
            toast.error(error.message || "Something went wrong");
        });
    }
};


  const [serverCount, setServerCount] = useState(0);
  const [serverImg, setServerImg] = useState([]);
const [isLoading,setIsLoading] = useState(false)

  const { data: updateproduct } = useQuery({
    queryKey: ["productupdate", id],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(
          `${commenUrl}/api/v1/products/getsingle-product/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category:"",
    discount: "",
    offer: "",
    specifications: "",
    warranty: "",
    brandName:"",
    returnPolicy: "",
  });

  useEffect(() => {
    if (updateproduct) {
      setServerImg(updateproduct?.product.images);
      setProductData({
        name: updateproduct?.product.name,
        description: updateproduct?.product.description,
        price: updateproduct?.product.price,
        brandName:updateproduct?.product.brandName,
        category:updateproduct?.product.category,
        stock: updateproduct?.product.stock,
        specifications: updateproduct?.product.specifications,
        warranty: updateproduct?.product.warranty,
        returnPolicy: updateproduct?.product.returnPolicy,
        offer: updateproduct?.product.offer,
        discount: updateproduct?.product.discount,
      });
    }
  }, [updateproduct]);

  // onChange handle
  const onChange = (e) => {
    if (e.target.name === "file-image") {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      setProductImg({ ...productImg, images: e.target.files });

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
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async(e) => {
    e.preventDefault();
      // if(updateproduct?.product.price <= 0 || updateproduct?.product.stock <= 0){
      //      alert("price and stock should be greater than 0");
      //      return
      // };

      try {
          setIsLoading(true);
          const formData = new FormData();
    
          formData.append("name",productData.name);
          formData.append("description",productData.description);
          formData.append("price",productData.price);
          formData.append("brandName",productData.brandName);
          formData.append("category",productData.category);
          formData.append("seller",productData.seller);
          formData.append("offer",productData.offer);
          formData.append("discount",productData.discount);
          formData.append("stock",productData.stock);
          formData.append("specifications",productData.specifications);
          formData.append("warranty",productData.warranty);
          formData.append("returnPolicy",productData.returnPolicy);
          for(let key of Object.keys(productImg.images)){
            formData.append("images",productImg.images[key]);
        };

        const {data} = await axios.put(`${commenUrl}/api/v1/products/getsingle-productupdate/${id}`,formData,{headers:{"Content-Type":"multipart/form-data"},
            withCredentials:true
        });
       if(!data.success){
            toast.error(data.error)
          };
        if(data.success){
             toast.success(data.message)
        }
      } catch (error) {
          console.log(error)
      }finally{
          setIsLoading(false);
      }
  };

  return (
    <div className="bg-gray-100 p-5">
      <div className="lg:max-w-9/10 lg:mx-auto">
        <div className="md:flex md:flex-nowrap">
          <div className="md:w-2/3 w-full p-3">
            <div className="product-form">
              <form className="mt-4" onSubmit={onSubmit} encType="multipart/form-data">
                {/* image file choose */}
                <div className="form-group mb-4">
                  <label htmlFor="file-image" className="block text-lg py-2">
                    Select Image *
                  </label>
                  <input
                    type="file"
                    id="file-image"
                    name="file-image"
                    placeholder="Product name...."
                    multiple
                    onChange={onChange}
                    className="border rounded-md w-full h-10 p-2"
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="product-name" className="block text-lg py-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={onChange}
                    placeholder="Product name...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="product-name" className="block text-lg py-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={productData.brandName}
                    onChange={onChange}
                    placeholder="Brand Name...."
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
                    value={productData.category}
                    onChange={onChange}
                    placeholder="Product category...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-description"
                    className="block text-lg py-2"
                  >
                    Product Description *
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={productData.description}
                    onChange={onChange}
                    placeholder="Product description...."
                    className="border rounded-md w-full h-20 p-2"
                    required
                  ></textarea>
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="product-price" className="block text-lg py-2">
                    Product Price *
                  </label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    value={productData.price}
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
                    Product Discount *
                  </label>
                  <input
                    type="number"
                    id="product-discount"
                    name="discount"
                    value={productData.discount}
                    onChange={onChange}
                    placeholder="Product discount...."
                    min={0}
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                {/* offer */}
                <div className="form-group mb-4">
                  <label htmlFor="product-offer" className="block text-lg py-2">
                    Product Offer *
                  </label>
                  <input
                    type="number"
                    id="product-offer"
                    name="offer"
                    value={productData.offer}
                    onChange={onChange}
                    placeholder="Product offer...."
                    min={0}
                    className="border rounded-md w-full h-10 p-2"
                  />
                </div>
                {/* stock */}
                <div className="form-group mb-4">
                  <label htmlFor="product-stock" className="block text-lg py-2">
                    Product Stock *
                  </label>
                  <input
                    type="number"
                    id="product-stock"
                    name="stock"
                    value={productData.stock}
                    min={0}
                    onChange={onChange}
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
                    Product Specifications *
                  </label>
                  <textarea
                    id="product-specifications"
                    name="specifications"
                    value={productData.specifications
                      .toString()
                      .replaceAll(/,/g, "/")}
                    onChange={onChange}
                    placeholder="key point1 / key point2 / key point3"
                    className="border rounded-md w-full h-20 p-2"
                    // required
                  ></textarea>
                </div>
                {/* Warranty: */}
                <div className="form-group mb-4">
                  <label
                    htmlFor="product-warranty"
                    className="block text-lg py-2"
                  >
                    Product Warranty *
                  </label>
                  <input
                    type="text"
                    list="warranty"
                    id="product-warranty"
                    name="warranty"
                    value={productData.warranty}
                    onChange={onChange}
                    placeholder="Product warranty...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />

                  <datalist id="warranty">
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
                    Product Return Policy *
                  </label>
                  {/* <input type="text" id="product-return-policy" name="product-return-policy" placeholder='Product return policy....' className='border rounded-md w-full h-10 p-2' required /> */}
                  <input
                    list="returnPolicy"
                    id="product-returnPolicy"
                    name="returnPolicy"
                    value={productData.returnPolicy}
                    onChange={onChange}
                    placeholder="Product return policy...."
                    className="border rounded-md w-full h-10 p-2"
                  />
                  <datalist id="returnPolicy">
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
                    Update Product
                  </button>
                  <span className="ms-3 text-red-500 cursor-pointer" onClick={() => handleDeleteProduct(id)}>
                    Delete Product
                  </span>
                </div>
              </form>
            </div>
          </div>
          <div className="md:w-2/4 w-full p-4">
            <div className="product-title">
              <h1 className="text-3xl font-bold product-font">
                Update Product
              </h1>
              {/* Main Image Display */}
              <div className="product-image mt-4 p-3">
                {images.length > 0 ? (
                  <img
                    src={images[serverCount]?.src}
                    alt="New Upload"
                    className="w-full h-96 object-cover"
                  />
                ) : serverImg.length > 0 ? (
                  <img
                    src={serverImg[serverCount]}
                    alt="Server"
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center items-center mt-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {images.length > 0
                    ? images.map((img, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 shadow-md border rounded cursor-pointer"
                          onMouseOver={() => setServerCount(index)}
                        >
                          <img
                            src={img.src}
                            alt={`New ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    : serverImg.map((img, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 shadow-md border rounded cursor-pointer"
                          onMouseOver={() => setServerCount(index)}
                        >
                          <img
                            src={img}
                            alt={`Server ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
