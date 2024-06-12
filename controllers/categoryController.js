const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("index", { categories: allCategories });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();
  res.render("categories", {
    title: "List of Categories",
    categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [gunCategory, gunItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  res.render("category_details", {
    category: gunCategory,
    guns: gunItems,
  });
});
// Display form to add new Categories on request
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Add new category" });
});
exports.category_create_post = [
  // Validate and sanitize the fields
  body("name", "Name must not be empty").trim().isLength({ min: 5 }).escape(),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description is must be gretaer than 1 and less than 500")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add new category",
        category: category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];
//Display Form to update categories on request
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const categoryToUpdate = await Category.findById(req.params.id).exec();
  res.render("category_form", {
    title: "Update Category",
    category: categoryToUpdate,
  });
});
exports.category_update_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 5 }).escape(),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description is must be gretaer than 1 and less than 500")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "update category",
        category: category,
        errors: errors.array(),
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
//Display page  to delete Category
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    items: items,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);
  if (items.length > 0) {
    // The category has items under it
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      items: items,
    });
    return
  }else{
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories")
  }
});
