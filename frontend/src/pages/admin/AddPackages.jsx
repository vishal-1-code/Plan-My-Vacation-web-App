import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 10,
    packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleImageSubmit = () => {
    if (images.length == 0) {
      toast.error("please upload atleast 1 image");
      return;
    }

  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (formData.packageImages.length === 0) {
      toast.error("You must upload atleast 1 image");
      return;
    }
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.packagePrice < 0) {
      toast.error("Price should be greater than 500!");
      return;
    }

    // const price = Number(formData.packagePrice);
    // console.log(price);
    // console.log(formData.packagePrice);

    // setFormData({ ...formData,packagePrice:price});
    // const discount = Number(formData.packageDiscountPrice);
    // setFormData({ ...formData,packageDiscountPrice:discount});

    // // formData.packageDiscountPrice = Number(formData.packageDiscountPrice);
    // console.log("discount-> ",typeof formData.packageDiscountPrice);
    // console.log("package price-> ",typeof formData.packagePrice);
    // if (formData.packageDiscountPrice < formData.packagePrice) {
    //   alert("Regular Price should be greater than Discount Price!");
    //   return;
    // }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }

    const myFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "packageImages") {
        myFormData.append(key, formData[key]);
      }
    });
   
    formData.packageImages.forEach((file) => {
      // console.log(file);
      myFormData.append("Images", file);
    });

    if(formData.packageImages.length < 1){
      toast.error("please upload atleast 1 image");
      return;
    }
   
    // console.log(myFormData);
    try {
      setLoading(true);
      setError(false);
      
      const token = localStorage.getItem("X_TTMS_access_token");
      const res = await fetch("http://localhost:8000/api/package/create-package", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: myFormData,
      });
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
        toast.error("There is some error occured!");
        return;
      }
      setLoading(false);
      setError(false);
      toast.success(data?.message);
      setFormData({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
      });
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center p-3">
        <form
          onSubmit={handleSubmit}
          className="w-4/5 shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
        >
          <h1 className="text-center text-2xl font-semibold">Add Package</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="packageName">Name:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDescription">Description:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDestination">Destination:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="packageDays">Days:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="packageNights">Nights:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageAccommodation">Accommodation:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageTransportation">Transportation:</label>
            <select
              className="border border-black rounded-lg"
              id="packageTransportation"
              onChange={handleChange}
            >
              <option>Select</option>
              <option>Flight</option>
              <option>Train</option>
              <option>Boat</option>
              <option>Bus</option>
              <option>Cab</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageMeals">Meals:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageMeals"
              value={formData.packageMeals}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageActivities">Activities:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageActivities"
              value={formData.packageActivities}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packagePrice">Price:</label>
            <input
              type="number"
              className="border border-black rounded"
              id="packagePrice"
              value={formData.packagePrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="packageOffer">Offer:</label>
            <input
              type="checkbox"
              className="border border-black rounded w-4 h-4"
              id="packageOffer"
              checked={formData.packageOffer}
              onChange={handleChange}
            />
          </div>
          <div
            className={`${
              formData.packageOffer ? "flex flex-col w-full" : "hidden"
            }`}
          >
            <label htmlFor="packageDiscountPrice">Discount Price:</label>
            <input
              type="number"
              className="border border-black rounded"
              id="packageDiscountPrice"
              value={formData.packageDiscountPrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageImages">
              Images:
              <span className="text-red-700 text-sm">
                (images size should be less than 2mb and max 5 images)
              </span>
            </label>
            <input
              type="file"
              className="border border-black rounded"
              id="packageImages"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files); // Convert FileList to Array
                setImages((images) => [...images, ...files]); // Update images state
                setFormData((formData) => ({
                  ...formData,
                  packageImages: [...formData.packageImages, ...files], // Update packageImages
                }));
              }}
            />
          </div>
          {imageUploadError ||
            (error && (
              <span className="text-red-600 w-full">
                {imageUploadError || error}
              </span>
            ))}
          <button
            hidden={images.length === 0}
            disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
            type="button"
            onClick={handleImageSubmit}
          >confirm images
           </button>
          <button
           // disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
          >
          Add package
          </button>
          {formData.packageImages.length > 0 && (
            <div className="p-3 w-full flex flex-col justify-center">
              {formData.packageImages.map((image, i) => {
                return (
                  <div
                    key={i}
                    className="shadow-xl rounded-lg p-1 flex flex-wrap my-2 justify-between"
                  >
                    <img src={image} alt="" className="h-20 w-20 rounded" />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="p-2 text-red-500 hover:cursor-pointer hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AddPackages;
