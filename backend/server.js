import app from "./app.js"; // Import the Express app
import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Check if necessary environment variables are set
if (
  !process.env.CLOUDINARY_CLIENT_NAME ||
  !process.env.CLOUDINARY_CLIENT_API ||
  !process.env.CLOUDINARY_CLIENT_SECRET ||
  !process.env.PORT
) {
  console.error("Missing necessary environment variables!");
  process.exit(1); // Exit if any critical environment variable is missing
}

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Start the server on the port specified in the .env file
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});

// Graceful shutdown (e.g., for handling SIGINT or SIGTERM signals)
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

// Catch termination signals and handle graceful shutdown
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
