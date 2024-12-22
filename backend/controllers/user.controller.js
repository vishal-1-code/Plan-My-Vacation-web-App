import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//update uset details
export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "You can only update your own account please login again!",
    });
  }
  //   console.log(req.body.phone);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(201).send({
      success: true,
      message: "User Details Updated Successfully",
      user: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({
        success: false,
        message: "failed to update profile",
      });
    }
  }
};

//update user profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id; // middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    const profilePhoto = req.files['profilePhoto'][0];
    if (profilePhoto) {
      const photoUri = getDataUri(profilePhoto);
      const cloudResponsePhoto = await cloudinary.uploader.upload(
        photoUri.content,
        {
          max_file_size: 2 * 1024 * 1024,
        }
      );

      if (cloudResponsePhoto) {
        user.avatar = cloudResponsePhoto.secure_url; // save the cloudinary url
        // console.log(user.avatar);
      }

      await user.save();

      user = {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        address: user.address,
        avatar: user.avatar,
      };
      // console.log("everything is alright till now!");
      return res.status(201).json({
        user: user,
        success: true,
        message: "Profile photo updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "client error",
    });
  }
};

// update user password
export const updateUserPassword = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account password please login again!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      });
    }

    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    const validPassword = bcryptjs.compareSync(oldPassword, validUser.password);
    if (!validPassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    const updatedHashedPassword = bcryptjs.hashSync(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: updatedHashedPassword,
        },
      },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete user
export const deleteUserAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return res.status(401).send({
      success: false,
      message: "You can only delete your account!",
    });
  try {
    await User.findByIdAndDelete(req.params.id);
    //clear cookie before sending json
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};

//get all users admin
export const getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      user_role: 0,
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });
    if (users && users.length > 0) {
      res.send(users);
    } else {
      res.status(400).send({
        success: false,
        message: "No Users Yet!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete user admin
export const deleteUserAccountAdmin = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};
