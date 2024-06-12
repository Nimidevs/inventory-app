const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  no_in_stock: { type: Number, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required:true }],
  // item_image_url: {type: String, required:true}
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
