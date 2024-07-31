import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ChangeProfileImage from "./ChangeProfileImage";

const ChangeDetails = () => {
  const initFormState = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: null,
  };

  const initValidState = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  };

  const [details, setDetails] = useState(initFormState);
  const [valid, setValid] = useState(initValidState);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({
    server: "",
    confirmPassword: "",
    newPassword: "",
    oldPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [visible, setVisible] = useState(false);
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
    if (errors.server !== "") {
      const timer = setTimeout(() => {
        setErrors((prevErrors) => ({ ...prevErrors, server: "" }));
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [errors.server]);

  const passDict = {
    true: ["text", "Hide Password!"],
    false: ["password", "Show Password!"],
  };

  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;

  const validate = (type, val) => {
    if (type === "newPassword") {
      if (passRegex.test(val) && val.length > 0) {
        setValid((prev) => ({ ...prev, [type]: true }));
      } else {
        setValid((prev) => ({ ...prev, [type]: false }));
      }
      if (val === details.confirmPassword) {
        setValid((prev) => ({ ...prev, confirmPassword: true }));
      } else {
        setValid((prev) => ({ ...prev, confirmPassword: false }));
      }
    } else if (type === "confirmPassword") {
      if (val === details.newPassword) {
        setValid((prev) => ({ ...prev, [type]: true }));
      } else {
        setValid((prev) => ({ ...prev, [type]: false }));
      }
    } else if (type === "oldPassword") {
      setValid((prev) => ({ ...prev, [type]: val.length > 0 }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const showPass = () => {
    setVisible((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDetails((prev) => ({ ...prev, profileImage: file }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({
      server: "",
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    });

    if (details.newPassword !== details.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    // Validate all required fields
    if (!details.oldPassword) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Old password is required",
      }));
      return;
    }

    if (!details.newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      return;
    }

    if (!details.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm password is required",
      }));
      return;
    }

    try {
      setErrors({
        server: "",
        confirmPassword: "",
        newPassword: "",
        oldPassword: "",
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/changePassword`,
        details,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setSuccessMessage("Password updated successfully");
      console.log(successMessage);
      setDetails(initFormState);
      setIsValid(false);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setSuccessMessage("");
      setErrors((prev) => ({
        ...prev,
        server: "Incorrect password",
      }));
    }
  };

  useEffect(() => {
    const allValid = Object.values(valid).every((val) => val === true);
    setIsValid(allValid);
  }, [valid]);

  return (
    <div className="change-details-form max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Change Your Password</h2>

      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}
      {errors.server && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {errors.server}
        </div>
      )}
      {/* <hr className="mb-4"></hr> */}

      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label
            htmlFor="oldPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Previous Password
          </label>
          <input
            type={passDict[visible.toString()][0]}
            name="oldPassword"
            id="oldPassword"
            value={details.oldPassword}
            onChange={handleChange}
            autoComplete="old-password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.oldPassword && (
            <div className="text-red-500 text-sm mt-2">
              {errors.oldPassword}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={passDict[visible.toString()][0]}
              name="newPassword"
              id="newPassword"
              value={details.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {errors.newPassword && (
            <div className="text-red-500 text-sm mt-2">
              {errors.newPassword}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm New Password
          </label>
          <input
            type={passDict[visible.toString()][0]}
            name="confirmPassword"
            id="confirmPassword"
            value={details.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.confirmPassword === false && (
            <div className="text-red-500 text-sm mt-2">
              The passwords must match!
            </div>
          )}
          <button
            type="button"
            onClick={showPass}
            className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 my-2 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            {passDict[visible.toString()][1]}
          </button>
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-2">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={!isValid}
        >
          Change Password
        </button>
      </form>
      <hr className = ""></hr>
      <ChangeProfileImage />
    </div>
  );
};

export default ChangeDetails;
