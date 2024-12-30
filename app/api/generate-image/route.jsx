import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/src/firebaseConfig";

export async function POST(req) {
  try {
    // Parse the prompt from the request
    const { prompt } = await req.json();

    // Initialize Replicate with the API token
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Input for the image generation
    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    // Generate the image using Replicate
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    // Convert the image to base64 format
    const base64Image = "data:image/png;base64," + await convertImage(output[0]);

    // Define the path for Firebase Storage (you can modify this path)
    const fileName = `ai-short-video-files/${Date.now()}.png`;
    const storageRef = ref(storage, fileName);

    // Upload the image to Firebase Storage
    await uploadString(storageRef, base64Image, 'data_url');

    // Get the download URL of the uploaded image
    const downloadUrl = await getDownloadURL(storageRef);

    // Log the URL for your reference
    console.log("Download URL:", downloadUrl);

    // Return the download URL in the response
    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: error.message });
  }
}

// Function to convert the image URL to base64
const convertImage = async (imageUrl) => {
  try {
    // Fetch the image as an array buffer (binary data)
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Convert the image data to base64
    const base64Image = Buffer.from(resp.data).toString('base64');
    return base64Image;
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Error converting image to base64.");
  }
};
