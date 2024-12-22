import Package from "../models/package.model.js";
//import braintree from "braintree";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";
dotenv.config();
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

//create package
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
    } = req.body;

    // Validate required fields
    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      packageOffer === ""
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    // Validate price logic
    if (packagePrice < packageDiscountPrice) {
      return res.status(400).send({
        success: false,
        message: "Regular price should be greater than discount price!",
      });
    }
    if (packagePrice <= 0 || packageDiscountPrice < 0) {
      return res.status(400).send({
        success: false,
        message: "Price should be greater than 0!",
      });
    }

    // Validate days and nights
    if (packageDays <= 0 && packageNights <= 0) {
      return res.status(400).send({
        success: false,
        message: "Provide valid days and nights!",
      });
    }

    const imageArray = req.files;
    // console.log(imageArray); // Assuming 'Images' is the field name for multiple images
    let packageImages = [];

    if (imageArray && imageArray.length > 0) {
      try {
        // Use Promise.all for concurrent uploads
        const uploadPromises = imageArray.map(async (file) => {
          const fileUri = getDataUri(file); // Convert file to Data URI
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            max_file_size: 2 * 1024 * 1024, // 2 MB size limit
          });
          return cloudResponse.secure_url; // Return secure URL after upload
        });

        packageImages = await Promise.all(uploadPromises); // Wait for all uploads
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return res.status(500).send({
          success: false,
          message: "Failed to upload images",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "No images provided!",
      });
    }

    // Create the package with all details including uploaded image URLs
    const newPackage = await Package.create({
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages,
    });

    if (newPackage) {
      return res.status(201).send({
        success: true,
        message: "Package created successfully",
        package: newPackage,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Failed to create package",
      });
    }
  } catch (error) {
    console.error("Error creating package:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


//get all packages
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    if (packages) {
      return res.status(200).send({
        success: true,
        packages,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "No Packages yet",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get package data
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req?.params?.id);
    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });
    }
    return res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.log(error);
  }
};

//update package
export const updatePackage = async (req, res) => {
  try {
    const findPackage = await Package.findById(req.params.id);
    if (!findPackage)
      return res.status(404).send({
        success: false,
        message: "Package not found!",
      });

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete package
export const deletePackage = async (req, res) => {
  try {
    const deletePackage = await Package.findByIdAndDelete(req?.params?.id);
    return res.status(200).send({
      success: true,
      message: "Package Deleted!",
    });
  } catch (error) {
    cnsole.log(error);
  }
};

//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
