const ErrorHandler = require("../middlewares/error");
const Product = require("../modules/productModules");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
// product add
exports.addProducts = async (req, res) => {
    try {
        // Validate required fields
        const {
            name, price, description, brandName,
            category, stock,
            returnPolicy, warranty, specifications
        } = req.body;

        if (!name || !price || !description || !brandName || !category || !stock || !returnPolicy || !warranty) {
            return res.status(400).json({ success: false, error: "please fill all the fields" });
        }

        if (price <= 0 || stock <= 0) {
            return res.status(400).json({ success: false, error: "price and stock should be greater than 0" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: "please upload product images" });
        }

        // Validate file types
        for (const file of req.files) {
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
                return res.status(400).json({ success: false, error: "only jpeg, png and jpg images allowed" });
            }
        }

        // Now write files to disk AFTER validation
        const images = [];

        for (const file of req.files) {
            const filename = `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 100)}${path.extname(file.originalname)}`;
            const filepath = path.join(__dirname, "..", "upload/products", filename);

            fs.writeFileSync(filepath, file.buffer);
            images.push(`${process.env.BACKEND_URL}/upload/products/${filename}`);
        }

        const storeSpecifi = specifications.split("/").map(item => item.trim());

        const product = await Product.create({
            name,
            price,
            description,
            brandName,
            category,
            stock,
            images,
            specifications: storeSpecifi,
            returnPolicy,
            warranty,
            offer: req.body.offer || 0,
            discount: req.body.discount || 0
        });

        return res.status(200).json({ success: true, message: "product created successfully", product });

    } catch (error) {
        ErrorHandler(error, res);
    }
};



// get all products
exports.getAllProducts = async(req,res)=>{
    try {
        
        // const products = await Product.findOne()
        // if(!products){
        //     return res.status(400).json({error:"product not found"})
        // }
        return res.status(200).json({message:"product found"})
    } catch (error) {
          ErrorHandler(error,res);
    }
}
// get single product
exports.getSingleProduct = async(req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product){
            return res.status(400).json({error:"product not found"})
        }   
        return res.status(200).json({message:"product found",product})
    } catch (error) {
          ErrorHandler(error,res);
    }
}
// update product
exports.updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name,price,description,brandName,category,seller,tax,stock,returnPolicy,warranty,specifications,offer} = req.body;

            if(req.files){
                req.files.forEach((file)=>{
                    if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg"){
                        return res.status(400).json({success:true,error:"please upload only jpeg, png and jpg images"})
                    }
                })
                
            };

           var storeSpecifi = [];
          let splitSpecifications = specifications.split("/").map(item => item.trim());
             splitSpecifications.forEach((items)=>{
                storeSpecifi.push(items)
             })
          
            if(req.files && req.files.length > 0){
                const images = req.files.map((file)=>{
                return `${process.env.BACKEND_URL}/upload/products/${file.filename}`
               });

            const product = await Product.findByIdAndUpdate(id,
                {
                  name:name,
                  price:price,
                  description:description,
                  brandName:brandName,
                  category:category,
                  taxPrice:tax,
                  stock:stock,
                  images:images,
                  specifications:storeSpecifi,
                  seller:seller,
                  returnPolicy:returnPolicy,
                  warranty:warranty,
                    
                },{
                new:true,
                runValidators:true,
                useFindAndModify:false
            })

              if(!product){
                  return res.status(400).json({success:false,error:"product not found"})
               };
                 return res.status(200).json({success:true,message:"product updated successfully",product});
                 
            };

            // not upload images
         const product = await Product.findByIdAndUpdate(id,
                {
                  name:name,
                  price:price,
                  description:description,
                  brandName:brandName,
                  category:category,
                  taxPrice:tax,
                  stock:stock,
                  specifications:storeSpecifi,
                  seller:seller,
                  returnPolicy:returnPolicy,
                  warranty:warranty,
                  offer:offer || 0
                },{
                new:true,
                runValidators:true,
                useFindAndModify:false
            });
          if(!product){
             return res.status(400).json({success:false,error:"product not found"})
          };

            return res.status(200).json({success:true,message:"product updated successfully",product})
    } catch (error) {
          ErrorHandler(error,res);
    }
}
// delete product
exports.deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id,{productStatus:1},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        if(!product){
            return res.status(400).json({success:false,error:"product not found"})
        }
        return res.status(200).json({success:true,message:"product delete successfully",product})
    } catch (error) {
          ErrorHandler(error,res);
    }
}
// get product by category
exports.getProductByCategory = async(req,res)=>{
    try {
        const {category} = req.params
        const product = await Product.find({category:category})
        if(!product){
            return res.status(400).json({error:"product not found"})
        }
        return res.status(200).json({message:"product found",product})
    } catch (error) {
          ErrorHandler(error,res);
    }   
}
// product recover
exports.productRecover = async(req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id,{productStatus:0},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        if(!product){
            return res.status(400).json({error:"product not found"})
        }
        return res.status(200).json({message:"product recover successfully",product})
    }
    catch (error) {
          ErrorHandler(error,res);
    }
}
// create review
exports.createReview = async(req,res)=>{
try {
    const { id } = req.params;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(400).json({ error: "Product not found" });
    }

    const existingReview = product.reviews.find(
        (rev) => rev.user.toString() === userId.toString()
    );

    if (existingReview) {
        // Update existing review
        existingReview.rating = Number(rating);
        existingReview.comment = comment;
    } else {
        // Add new review
        const review = {
            user: userId,
            name: req.user.firstname,
            rating: Number(rating),
            comment: comment,
        };
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.ratings = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
        message: existingReview ? "Review updated successfully" : "Review added successfully",
        product,
    });
} catch (error) {
    ErrorHandler(error, res);
}

}
// get All Review
exports.getAllReview = async(req,res)=>{
     try {
        const reviewId = req.params.id;
        const reviews = await Product.findById(reviewId);
        if(!reviews){
            return res.status(400).json({error:"review not found"})
        }

        return res.status(200).json(reviews.reviews)
     } catch (error) {
        ErrorHandler(error,res);
     }
}
// get product category

exports.getCategory = async (req, res) => {
    try {
        const selectedCategory = req.query.category; // e.g., "Electronics" or "All"
        let products;

        if (selectedCategory && selectedCategory !== "All") {
            products = await Product.find({ category: selectedCategory , productStatus: 0 }); // Filter by selected category
        } else {
            products = await Product.find({ productStatus: 0 }); // All products
        }

        // Get unique categories from all products
        const allProducts = await Product.find({ productStatus: 0 });
        const categorySet = new Set();
        allProducts.forEach((item) => {
            if (item.category) {
                categorySet.add(item.category);
            }
        });

        const categories = ["All", ...categorySet];

        return res.status(200).json({
            success: true,
            categories,
            selectedCategory: selectedCategory || "All",
            products,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
// product search
exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

     if(!keyword){
         return res.status(400).json({ message: 'Keyword is required' });
     }
    const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { brandName: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
     ]
});

    if(!products){
        return res.status(400).json({message:"product not found"});
    }
    return res.status(200).json({ success: true, products });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// get recover producta productsStatus
exports.getRecoverProducts = async (req, res) => {
    try {
        const products = await Product.find({ productStatus: 1 });
        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: "No recovered products found" });
        }
        return res.status(200).json({ success: true, products });
    } catch (error) {
        ErrorHandler(error, res);
    }
};
// get five start product
exports.getFiveStarProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $match: { ratings: 5, productStatus: 0 } }, // filter first
            { $sample: { size: 10 } } // then randomly sample 10
        ]);

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: "No five-star products found" });
        }

        return res.status(200).json({ success: true, products });
    } catch (error) {
        ErrorHandler(error, res);
    }
};
