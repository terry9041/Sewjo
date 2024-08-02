import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ChangeProfileImage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userImageSrc, setUserImageSrc] = useState<string>("/favicon.ico");
  const router = useRouter();

  useEffect(() => {
    if (successMessage !== "") {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getProfileImage`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data); // Handle the response data (e.g., set state)
        setUserImageSrc(response.data.id || "/favicon.ico"); // Set userImageSrc based on response
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setUserImageSrc("/favicon.ico"); // Set default image on error
      }
    };
    fetchProfileImage();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleProfileImageChange = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccessMessage("");

    if (!profileImage) {
      setErrors("Please select a profile image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/changeProfileImage`, // Adjusted URL
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Profile image updated successfully");
      setProfileImage(null);
      // router.push("/dashboard");
      window.location.reload();
    } catch (err) {
      setErrors("Failed to upload profile image. Please try again.");
    }
  };

  return (
    <div className="change-profile-image-form max-w-md  bg-white  flex flex-col mt-3">
      <h2 className="text-2xl font-bold my-6">Change Profile Image</h2>

      {/* <img
        src={
          userImageSrc != null
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${userImageSrc}`
            : "/favicon.ico"
        }
        alt={"user profile image"}
        width={200}
        height={200}
        className="self-center rounded-xl"
      /> */}
      <img
        className="self-center rounded-xl my-4"
        src={userImageSrc}
        alt="user photo"
        width={200}
        height={200}
      />
      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}
      {errors && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {errors}
        </div>
      )}

      <form onSubmit={handleProfileImageChange}>
        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="block text-gray-700 font-bold mt-4 mb-2"
          >
            Upload a new profile image below
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Profile Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeProfileImage;
