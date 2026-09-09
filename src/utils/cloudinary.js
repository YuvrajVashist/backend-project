import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { fileURLToPath } from "url";

//in this we take the file that is stored in the server temporarily and we upload it to the cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) console.log("There is no such file Path Exist")
        //upload file on clodinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file upload successfully
        console.log(response.url)
        console.log("The link of file is " + localFilePath)
        return response

    } catch (error) {
        //why do we use unlinkSync not unlink:
        //file should be unlinked first and then do further steps
        
        // fs.unlinkSync(localFilePath)
        // return null;

        console.log("Cloudinary upload error: ", error)
        if(localFilePath){
            fs.unlink(localFilePath)
        }
        return null;
    }
}

export  {uploadOnCloudinary}

