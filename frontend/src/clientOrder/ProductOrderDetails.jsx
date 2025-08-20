import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import LoadingSpenner from "../commen/LoadingSpenner";

const product = {
  name: "Apple iPhone 14",
  price: 79999,
  image: "http://localhost:4000/upload/products/images-174782605073753.jpg",
};

const ProductOrderDetails = () => {
  const { id } = useParams();

  const { data: getsingle } = useQuery({
    queryKey: ["getsingleproduct"],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(`${commenUrl}/api/v1/products/getsingle-product/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Something went wrong")
        }
        return data;
      } catch (error) {
        throw error
      }
    }
  });

  const { data: getAddress } = useQuery({
    queryKey: ["findaddress"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${commenUrl}/api/v1/orderproduct/order/useraddress/check`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [addressRemove, setAddressRemove] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [orderInput, setOrderInput] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    phoneNumber: undefined, // Changed from "" to undefined to avoid E.164 warning
    paymentMethod: "",
    currency: selectedCountryId?.currency || "INR",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Address Details:", orderInput);
    alert("Address details submitted!");
  };

  const handlePreviousAddressSelect = (items, index) => {
    setSelectedAddressIndex(index);
    setOrderInput({
      name: items.name || "",
      address: items.shippingAddress?.addressLine || "",
      city: items.shippingAddress?.city || "",
      state: items.shippingAddress?.state || "",
      pincode: items.shippingAddress?.postalCode || "",
      country: items.shippingAddress?.country || "",
      phoneNumber: `+91 8925965366`, // Changed from "" to undefined
      paymentMethod: items.paymentMethod || "",
      currency: items.currency || "INR",
    });
    setAddressRemove(true);
  };

  const RemoveAddress = () => {
    setAddressRemove(false);
    setSelectedAddressIndex(null);
    setOrderInput({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      phoneNumber: undefined, // Changed from "" to undefined
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        📦 Shipping Address
      </h2>

      {/* Product Info */}
      <div className="flex items-center space-x-4">
        <img
          src={getsingle?.product?.images?.[0]}
          alt={getsingle?.product?.name || "Product"}
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <h3 className="text-lg font-semibold">{getsingle?.product?.name || product.name}</h3>
          <p className="text-blue-600 font-bold text-lg">
            ₹{getsingle?.product?.price?.toLocaleString() || product.price?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {getAddress?.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-1">
            📦 Client Details (Previous Address){" "}
            {addressRemove ? (
              <span
                onClick={RemoveAddress}
                className="text-red-500 cursor-pointer text-xs lg:text-sm hover:underline"
              >
                Clear Address
              </span>
            ) : (
              ""
            )}
          </h4>
          {getAddress.map((items, index) => (
            <div key={index} className="mb-4 p-2 border rounded-md">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="previousAddress"
                  checked={selectedAddressIndex === index}
                  onChange={() => handlePreviousAddressSelect(items, index)}
                  className="mt-1"
                />
                <div>
                  <p>
                    <strong>Name:</strong> {items.name}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {items.shippingAddress.addressLine}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {items.shippingAddress.postalCode}
                  </p>
                  <p>
                    <strong>State:</strong> {items.shippingAddress.state}
                  </p>
                  <p>
                    <strong>Mobile No:</strong> 📞 {items.phoneNumber}
                  </p>
                  <p>
                    <strong>Country:</strong> {items.shippingAddress.country}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> 💳 {items.paymentMethod}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            value={orderInput.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Your name"
            required
            readOnly={addressRemove}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Address
          </label>
          <textarea
            name="address"
            value={orderInput.address}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Street, area, building info"
            required
            readOnly={addressRemove}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            {addressRemove ? (
              <p className="text-gray-500 border p-2 rounded">{orderInput.country || "N/A"}</p>
            ) : (
              <CountrySelect
                containerClassName="form-group"
                inputClassName="w-full p-2 border rounded"
                onChange={(country) => {
                  setSelectedCountryId(country);
                  setOrderInput((prev) => ({
                    ...prev,
                    country: country.name,
                    state: "",
                    city: "",
                  }));
                  setSelectedStateId(null);
                }}
                placeHolder="Select Country"
                value={selectedCountryId?.id || null}
                disabled={addressRemove}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            {addressRemove ? (
              <p className="text-gray-500 border p-2 rounded">{orderInput.state || "N/A"}</p>
            ) : (
              <StateSelect
                countryid={selectedCountryId?.id}
                containerClassName="form-group"
                inputClassName="w-full p-2 border rounded"
                onChange={(state) => {
                  setSelectedStateId(state.id);
                  setOrderInput((prev) => ({
                    ...prev,
                    state: state.name,
                    city: "",
                  }));
                }}
                placeHolder="Select State"
                value={selectedStateId}
                disabled={addressRemove || !selectedCountryId}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            {addressRemove ? (
              <p className="text-gray-500 border p-2 rounded">{orderInput.city || "N/A"}</p>
            ) : (
              <CitySelect
                countryid={selectedCountryId?.id}
                stateid={selectedStateId}
                containerClassName="form-group"
                inputClassName="w-full p-2 border rounded"
                onChange={(city) => {
                  setOrderInput((prev) => ({
                    ...prev,
                    city: city.name,
                  }));
                }}
                placeHolder="Select City"
                value={orderInput.city}
                disabled={addressRemove || !selectedCountryId || !selectedStateId}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            {addressRemove ? (
              <p className="text-gray-500 border p-2 rounded">{orderInput.pincode || "N/A"}</p>
            ) : (
              <input
                type="text"
                name="pincode"
                value={orderInput.pincode}
                onChange={handleChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Enter Postal Code"
                className="w-full p-2 border rounded"
                required
                readOnly={addressRemove}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Currency
            </label>
            <select
              name="currency"
              value={orderInput.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value={` ${selectedCountryId?.currency}`}>{selectedCountryId?.currency ? `${selectedCountryId.currency}` : ``}</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option value="CNY">CNY</option>
              <option value="RUB">RUB</option>
              <option value="BRL">BRL</option>
              <option value="ZAR">ZAR</option>
              <option value="KRW">KRW</option>
              <option value="MXN">MXN</option>
              <option value="NZD">NZD</option>
              <option value="SGD">SGD</option>
              <option value="HKD">HKD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={orderInput.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              readOnly={addressRemove}
            >
              <option value="">Select Payment Method</option>
              <option value="prepaid">Prepaid</option>
              <option value="cash on delivery">Cash on Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <PhoneInput
              international
              defaultCountry={selectedCountryId?.iso2 || "IN"}
              value={orderInput.phoneNumber}
              onChange={(value) => setOrderInput({ ...orderInput, phoneNumber: value })}
              className="w-full p-2 border rounded"
              placeholder="Enter phone number"
              required
              readOnly={addressRemove}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Payment
        </button>
      </form>
    </div>
  );
};

export default ProductOrderDetails;