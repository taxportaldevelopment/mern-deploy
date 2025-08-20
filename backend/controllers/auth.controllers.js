const sendEmail = require("../lib/utils/email");
const generateTokenAndSetCookie = require("../lib/utils/generateToken");
const User = require("../modules/AuthModules");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// register
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "Missing Register form Filed" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, 201, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!email || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, 200, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.firstname,
      lastName: user.lastname,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// logout
exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ accountStatus: 0 })
      .select("-password -__v")
      .sort({ createdAt: -1 });
    if (!users) return res.status(400).json({ error: "No users found" });
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// get me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// get single user
exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -__v");
    if (!user) return res.status(400).json({ error: "No user found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { accountStatus: 1 },
      { new: true, runValidators: true }
    ).select("-password -__v");
    if (!user) return res.status(400).json({ error: "No user found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password -__v");
    if (!user) return res.status(400).json({ error: "No user found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//forgetpassword - /api/v1//password/forgot
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "user not found with this email" });
  }
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${process.env.CLIENT_URL}/auth/forgot/reset/${resetToken}`;

  const message = `your password reset url is as follows \n\n
	${resetUrl} \n\n if you have not requested this email then ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "Aura Homes Forgot Password",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `Email send to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(400).json({ error: error.message });
  }
};

//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = async (req, res, next) => {
   const {password,confirmpassword} = req.body;
  // res.status(200).json({message:"hiiii",DB:req.params.token})
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "password reset token is invalid or expired", user });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({error:"password does not match"})
    }

    const salt = await bcrypt.genSalt(10);
    const handlePassword = await bcrypt.hash(password, salt);

    user.password = handlePassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    generateTokenAndSetCookie(user._id, 201, res);

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, types: typeof req.params.token });
  }
};
// get admin and super admin
exports.getAdminAndSuperAdmin = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ role: "admin" }, { role: "superadmin" }],
    })
      .select("-password -__v")
      .sort({ createdAt: -1 });
    if (!users) return res.status(400).json({ error: "No users found" });
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// admin role set and
exports.setAdminRole = async (req, res) => {
  try {
    const {role} = req.body;
    if (!role || (role !== "admin" && role !== "superadmin" && role !== "user")) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    ).select("-password -__v");
    if (!user) return res.status(400).json({ error: "No user found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// remove admin role

// exports.removeAdminRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;
//     if (!role || (role !== "admin" && role !== "superadmin" && role !== "user")) {
//       return res.status(400).json({ error: "Invalid role provided" });
//     }
//     const user = await User.findByIdAndUpdate(
//       id,
//       { role: "user" },
//       { new: true, runValidators: true }
//     ).select("-password -__v");
//     if (!user) return res.status(400).json({ error: "No user found" });
//     return res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };