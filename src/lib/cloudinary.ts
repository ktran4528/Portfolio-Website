import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary with the cloud name from environment variables
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo", // Fallback to 'demo' if not set
  },
});

export default cld;
