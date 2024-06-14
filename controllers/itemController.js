const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");
const Cloudinary = require("../index");
const path = require("path");
const fs = require("fs");

//Adding Multer to validate file inputs
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    fs.access(uploadPath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) {
            cb(err, uploadPath);
          } else {
            cb(null, uploadPath);
          }
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().exec();
  res.render("items", {
    items: allItems,
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  res.render("item_detail", {
    item: item,
  });
});

//Display form to add new items on request
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("item_form", {
    title: "Add new Items",
    categories: allCategories,
  });
});

exports.item_create_post = [
  upload.single("item_image"),

  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name").trim().isLength({ min: 1 }).escape(),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("descirption is too long")
    .escape(),
  body("price").trim().escape(),
  body("no_in_stock").trim().escape(),
  body("category.*").escape(),
  check("item_image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/svg+xml"
      ) {
        console.log(req.file.mimetype);
        console.log(req.file.path);
        return "image";
      } else {
        console.log("false");
        return false;
      }
    })
    .withMessage("please only submit image documents"),
  check("item_image")
    .custom((value, { req }) => {
      if (!req.file) {
        return false;
      } else {
        return "file";
      }
    })
    .withMessage("Please upload an image file"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // const imagePath = req.file

    console.log("file size", req.file.size);

    const result = await Cloudinary.imageUploadFunction(req.file.path);

    console.log("cloudinary file path", result);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      no_in_stock: req.body.no_in_stock,
      category: req.body.category,
      item_image_url: result.secure_url,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("item_form", {
        title: "Add new Items",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

//Display form to update Item on request

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().exec(),
  ]);
  for (const category of categories) {
    if (item.category.includes(category._id)) {
      category.checked = "true";
    }
  }
  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: categories,
  });
});

exports.admin_update_confirmation_get = asyncHandler(async (req, res, next) => {
  res.render("admin_form", {title: 'confirm youre an admin to update item'})
 })
 exports.admin_update_confirmation_post = asyncHandler(async (req, res, next) => {
   const adminPassword = "king";
 
   if (req.body.password === adminPassword) {
     // Render admin_form with success message
     res.redirect(`/inventory/item/${req.params.id}/update`);
   } else {
     // Render admin_form with error message
    res.redirect(`/inventory/item/${req.params.id}`)
   }
 });

exports.item_update_post = [
  upload.single("item_image"),

  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("name").trim().isLength({ min: 1 }).escape(),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("descirption is too long")
    .escape(),
  body("price").trim().escape(),
  body("no_in_stock").trim().escape(),
  body("category.*").escape(),
  check("item_image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/svg+xml"
      ) {
        console.log(req.file.mimetype);
        console.log(req.file.path);
        return true;
      } else {
        throw new Error('Please only submit image documents');
      }
    })
    .withMessage("please only submit image documents"),
  check("item_image")
    .custom((value, { req }) => {
      if (!req.file) {
        return false;
      } else {
        return "file";
      }
    })
    .withMessage("Please upload an image file"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const result = await Cloudinary.imageUploadFunction(req.file.path);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      no_in_stock: req.body.no_in_stock,
      category: req.body.category,
      item_image_url: result.secure_url,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();

      for (const category of categories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];

//Display Delete page
exports.admin_delete_confirmation_get = asyncHandler(async (req, res, next) => {
 res.render("admin_form", {title: 'confirm youre an admin to delete item'})
})
exports.admin_delete_confirmation_post = asyncHandler(async (req, res, next) => {
  const adminPassword = "king";

  if (req.body.password === adminPassword) {
    // Render admin_form with success message
    res.redirect(`/inventory/item/${req.params.id}/delete`);
  } else {
    // Render admin_form with error message
   res.redirect(`/inventory/item/${req.params.id}`)
  }
});
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  res.render("item_delete", { title: `Delete ${item.name}`, item: item });
});
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/items");
});
