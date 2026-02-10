import axios from "axios";

export const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

  try {
    const cloudRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      formData,
      { timeout: 5000 }
    );

    console.log(cloudRes); // full response
    return cloudRes.data.secure_url; // this works now

  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.log("Request timed out");
    } else {
      console.log("Upload error:", error.message);
    }
    return null; // or handle it however you like
  }
};
