var express = require('express');
var router = express.Router();
const category_controller = require("../controllers/categoryController")
const item_controller = require("../controllers/itemController")

router.get('/', category_controller.index)

// Categories routing functions

//routing to the form to new categories
router.get('/category/add', category_controller.category_create_get)
router.post('/category/add', category_controller.category_create_post)
//Routing to update Existing Categories
router.get('/category/:id/update', category_controller.category_update_get)
router.post('/category/:id/update', category_controller.category_update_post)
//Routing to Delete Categories
router.get('/category/:id/delete', category_controller.category_delete_get)
router.post('/category/:id/delete', category_controller.category_delete_post)
// Routing to the list of categories
router.get('/categories', category_controller.category_list)
//Routing to Details of each category
router.get('/category/:id', category_controller.category_detail)



// Items Routing Function
//routing to the form to new items
router.get('/item/add', item_controller.item_create_get)
router.post('/item/add', item_controller.item_create_post)
//Routing to admin confirmation form
router.get('/item/:id/confirmupdate', item_controller.admin_update_confirmation_get)
router.post('/item/:id/confirmupdate', item_controller.admin_update_confirmation_post)
//Routing to update items
router.get('/item/:id/update', item_controller.item_update_get)
router.post('/item/:id/update', item_controller.item_update_post)
//ROuting to admin confirmation form
router.get('/item/:id/confirmdelete', item_controller.admin_delete_confirmation_get)
router.post('/item/:id/confirmdelete', item_controller.admin_delete_confirmation_post)
//Routing to Delete Items
router.get('/item/:id/delete', item_controller.item_delete_get)
router.post('/item/:id/delete', item_controller.item_delete_post)
//Routing to the List of items/Guns
router.get('/items', item_controller.item_list)
//Routing to Detail of each GUn
router.get('/item/:id', item_controller.item_detail)

module.exports = router