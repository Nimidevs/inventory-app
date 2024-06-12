const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      no_in_stock: req.body.no_in_stock,
      category: req.body.category,
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
exports.item_update_post = [
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

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      no_in_stock: req.body.no_in_stock,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = Category.find().exec();

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
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];

//Display Delete page 
exports.item_delete_get = asyncHandler(async(req, res, next) => {
  const item = await Item.findById(req.params.id).exec()
  res.render('item_delete', {title:`Delete ${item.name}`, item: item})
})
exports.item_delete_post = asyncHandler(async(req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/items")
})
