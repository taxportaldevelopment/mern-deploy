const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const Razorpay = require("razorpay");
const sharp = require("sharp"); // for image validation

// Load environment variables
dotenv.config();

const app = express();
// Multer configuration with memory storage and 7MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 7 * 1024 * 1024, // 7MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware
app.use(express.json({ limit: "7mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Razorpay Instance
exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_PAI_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Static file serving
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Example route with image dimension validation
app.post("/api/v1/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Validate image dimensions (example: min 200x200, max 2000x2000)
    const metadata = await sharp(req.file.buffer).metadata();

    if (
      metadata.width < 200 ||
      metadata.height < 200 ||
      metadata.width > 2000 ||
      metadata.height > 2000
    ) {
      return res.status(400).json({
        message:
          "Invalid image dimensions! Allowed range: 200x200 to 2000x2000 px",
      });
    }

    // Save the file to disk (optional)
    const uploadPath = path.join(__dirname, "upload", req.file.originalname);
    await sharp(req.file.buffer).toFile(uploadPath);

    return res.status(200).json({
      message: "Image uploaded successfully!",
      file: req.file.originalname,
      dimensions: { width: metadata.width, height: metadata.height },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// API Routers
const DatabaseConnect = require("./db/batabase");
const userRouter = require("./Routers/authRouters");
const productRouter = require("./Routers/productRouters");
const addToCart = require("./Routers/addToCartRouter");
const orderProduct = require("./Routers/orderProduct");

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/addtocart", addToCart);
app.use("/api/v1/orderproduct", orderProduct);

// Error Handling for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res
          .status(400)
          .send("Error: File too large! Maximum size is 7MB");
      default:
        return res.status(400).send(`Multer Error: ${err.message}`);
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
  DatabaseConnect();
});
