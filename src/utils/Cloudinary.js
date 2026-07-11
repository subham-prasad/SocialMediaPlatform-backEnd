import { v2 as cloudinary } from "cloudinary";
import fs, { unlinkSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINAY_CLOUD_NAME,
  api_key: process.env.CLOUDINAY_API_KEY,
  api_secret: process.env.CLOUDINAY_API_SECRET,
});

//study cloudinary response log

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file upload is successfull

    // console.log("The file is uploaded on cloudilya", response.url);
    fs.unlinkSync(localFilePath); //remove the locally saved data then only move forward for anything

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved data then only move forward for anything
  }
};

export { uploadOnCloudinary };
