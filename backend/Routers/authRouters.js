const express = require("express");
const { signup, login, logout, getAllUsers, forgotPassword, resetPassword, getMe, getAdminAndSuperAdmin, setAdminRole, removeAdminRole, getSingleUser } = require("../controllers/auth.controllers");
const { protectRouter, isAdmin } = require("../middlewares/authenticate");
const routers = express.Router();

routers.route("/sigup").post(signup);
routers.route("/sigin").post(login);
routers.route("/logout").post(logout);
routers.route("/getsingleuser/:id").get(protectRouter, getSingleUser); // This route is for getting the current user's details
routers.route("/me").get(protectRouter,getMe);
routers.route("/password/forgot").post(forgotPassword);
routers.route("/password/reset/:token").post(resetPassword);


// admin routers
routers.route("/getalluser").get(protectRouter, isAdmin, getAllUsers);
routers.route("/getadminandsuperadmin").get(protectRouter, isAdmin, getAdminAndSuperAdmin);
routers.route("/set/admin/:id").post(protectRouter, isAdmin, setAdminRole);
// routers.route("/remove/admin/:id").post(protectRouter, isAdmin, removeAdminRole);
module.exports = routers;