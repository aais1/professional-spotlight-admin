import axios from "axios";
import toast from "react-hot-toast";

async function sendRequest(method, url, body = null) {
  console.log("body",body);
  const baseURL = "https://professional-spotlight-backend-beta.vercel.app"; // Make sure this is defined in .env file
  
  if (!baseURL) {
    throw new Error("Base URL is not defined in the environment variables.");
  }
  console.log(baseURL+url)
  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: baseURL + url, // Concatenating the base URL with the specific path
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      withCredentials: false,
    });

    if (response.status < 200 || response.status >= 300) {
      // Handle non-success status codes
      throw new Error(response.data.message || "Request failed");
    }

    return response;
  } catch (error) {
    console.error("Request error:", error);

    // Handle different error scenarios
    if (error.response) {

      toast.error(error.response.data.message );
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      // No response received
      console.error("No response received:", error.request);
      throw new Error("No response received from server");
    } else {
      // Error setting up the request
      console.error("Request setup error:", error.message);
      throw new Error(error.message);
    }
  }
}

export default sendRequest;
