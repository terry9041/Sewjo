import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * The registration component for the application
 * @returns the registration component
 */
export default function RegisterForm({ swapReg }) {
  const initFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const initValidState = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  };
  const [user, setUser] = useState(initFormState);
  const [valid, setValid] = useState(initValidState);
  const [isValid, setIsValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState("");
  const router = useRouter();

  const passDict = {
    true: ['text', 'Hide Password!'],
    false: ['password', 'Show Password!']
  };

  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/;
  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;

  const validate = (type, val) => {
    if (type === "firstName" || type === "lastName") {
      val.length === 0 ? setValid({ ...valid, [type]: false }) : setValid({ ...valid, [type]: true });
    } else if (type === "email") {
      emailRegex.test(val) && val.length > 0 ? setValid({ ...valid, [type]: true }) : setValid({ ...valid, [type]: false });
    } else if (type === "password") {
      passRegex.test(val) && val.length > 0 ? setValid(valid => { return { ...valid, [type]: true }; }) : setValid(valid => { return { ...valid, [type]: false }; });
      val === user.confirmPassword ? setValid(valid => { return { ...valid, ["confirmPassword"]: true }; }) : setValid(valid => { return { ...valid, ["confirmPassword"]: false }; });
    } else if (type === "confirmPassword") {
      val === user.password ? setValid(valid => { return { ...valid, [type]: true }; }) : setValid(valid => { return { ...valid, [type]: false }; });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    validate(name, value);
  };

  const showPass = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/user/register", user, { withCredentials: true })
      .then(res => {
        res.data.errors ? setErrors(res.data.errors) : router.push("/dashboard");
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    valid.firstName && valid.lastName && valid.email && valid.password && valid.confirmPassword ? setIsValid(true) : setIsValid(false);
  }, [valid, errors]);

  return (
    <div className="register-form max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">(sked.) register.</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={user.firstName}
            onChange={handleChange}
            autoComplete="firstName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.firstName === false && (
            <div className="text-red-500 text-sm mt-2">First name is required!</div>
          )}
          {errors.firstName && valid.firstName && (
            <div className="text-red-500 text-sm mt-2">{errors.firstName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={user.lastName}
            onChange={handleChange}
            autoComplete="lastName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.lastName === false && (
            <div className="text-red-500 text-sm mt-2">Last name is required!</div>
          )}
          {errors.lastName && valid.lastName && (
            <div className="text-red-500 text-sm mt-2">{errors.lastName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            autoComplete="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.email === false && (
            <div className="text-red-500 text-sm mt-2">A valid email is required!</div>
          )}
          {errors.email && valid.email && (
            <div className="text-red-500 text-sm mt-2">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
          <div className="relative">
            <input
              type={passDict[visible][0]}
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              autoComplete="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={showPass}
              className="absolute right-2 top-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              {passDict[visible][1]}
            </button>
          </div>
          {valid.password === false ? (
            <div className="text-red-500 text-sm mt-2">
              Passwords must be at least 8 characters long and have an uppercase letter, a lowercase letter, a number and a symbol.
            </div>
          ) : (
            <div className="text-gray-500 text-sm mt-2">
              Passwords must be at least 8 characters long and have an uppercase letter, a lowercase letter, a number and a symbol.
            </div>
          )}
          {errors.password && valid.password && (
            <div className="text-red-500 text-sm mt-2">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm password</label>
          <input
            type={passDict[visible][0]}
            name="confirmPassword"
            id="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.confirmPassword === false && (
            <div className="text-red-500 text-sm mt-2">The passwords must match!</div>
          )}
          {errors.confirmPassword && valid.confirmPassword && (
            <div className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</div>
          )}
        </div>
        <div className="mb-6">
          {isValid ? (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Register
            </button>
          ) : (
            <button
              type="submit"
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled
            >
              Register
            </button>
          )}
        </div>
      </form>
      <p className="text-center">
        Already have an account? <button onClick={swapReg} className="text-blue-500 hover:text-blue-700">Login here!</button>
      </p>
    </div>
  );
}
