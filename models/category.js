const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 200 },
  description: { type: String, required: true },
});

//virtual for categories URL
CategorySchema.virtual("url").get(function (){
    return `/inventory/category/${this._id}`
})

//Export model
module.exports = mongoose.model("Category", CategorySchema)
