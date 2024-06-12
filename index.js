require("dotenv").config();
// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.API_KEY);
console.log("API Secret:", process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const imageUploadFunction = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(
      imagePath
    );
    //console.log(result.secure_url);
    return result
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

module.exports.imageUploadFunction = imageUploadFunction;

// const imagePath =
//   "https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg";
// (async function uploadImage() {
//   try {
//     const result = await cloudinary.uploader.upload(imagePath);
//     console.log(result);
//   } catch (error) {
//     console.error("Error uploading image:", error);
//   }
// })();

/////////////////////////
// Uploads an image file
/////////////////////////
// const uploadImage = async (imagePath) => {
//   // Use the uploaded file's name as the asset's public ID and
//   // allow overwriting the asset with new versions
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,
//   };

//   try {
//     // Upload the image
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     console.log(result);
//     return result.public_id;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const result = (async () => {
//     await uploadImage(imagePath)
// }) ()
// Log the configuration
// console.log(result);

// cloudinary.uploader.upload(imagePath).then((result) => {
//   console.log(result);
// });

//keep

// const Cloudinary = require('./index');


// const imagePath =
//   'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';

// (async function uploadImage() {
//   try {
//     const result = await Cloudinary.imageUploadFunction(imagePath);
//     console.log(result);
//   } catch (error) {
//     console.error('Error uploading image:', error);
//   }
// })();

// // (async function uploadImage() {
// //   try {
// //     const result = await CLOUDINARY.cloudinaryFunction.uploader.upload(
// //       imagePath
// //     );
// //     console.log(result.secure_url);
// //   } catch (error) {
// //     console.error("Error uploading image:", error);
// //   }
// // })();
