import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * The registration component for the application
 * @returns the registration component
 */
export default function ModalRegisterForm({ swapReg })  {
  const initFormState = {
    userName: '',
    email: '',
    password: '',
    confirm: '',
  };
  const initValidState = {
    userName: null,
    email: null,
    password: null,
    confirm: null,
  };
  const [user, setUser] = useState(initFormState);
  const [valid, setValid] = useState(initValidState);
  const [isValid, setIsValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const passDict = {
    true: ['text', 'Hide Password!'],
    false: ['password', 'Show Password!']
  };

  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/;
  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;

  const validate = (type, val) => {
    if (type === "userName") {
      val.length === 0 ? setValid({ ...valid, [type]: false }) : setValid({ ...valid, [type]: true });
    } else if (type === "email") {
      emailRegex.test(val) && val.length > 0 ? setValid({ ...valid, [type]: true }) : setValid({ ...valid, [type]: false });
    } else if (type === "password") {
      passRegex.test(val) && val.length > 0 ? setValid(valid => { return { ...valid, [type]: true }; }) : setValid(valid => { return { ...valid, [type]: false }; });
      val === user.confirm ? setValid(valid => { return { ...valid, ["confirm"]: true }; }) : setValid(valid => { return { ...valid, ["confirm"]: false }; });
    } else if (type === "confirm") {
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
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`, user, { withCredentials: true });
      if (res.data.errors) {
        setErrors(res.data.errors);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ server: 'An unexpected error occurred. Please try again later.' });
      }
    }
  };

  useEffect(() => {
    valid.userName && valid.email && valid.password && valid.confirm ? setIsValid(true) : setIsValid(false);
  }, [valid, errors]);

  return (
    <div className="register-form">
      <h2 className="text-2xl font-bold mb-6">Register for Sewjo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700 font-bold mb-2">Username</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={user.userName}
            onChange={handleChange}
            autoComplete="userName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.userName === false && (
            <div className="text-red-500 text-sm mt-2">Username is required!</div>
          )}
          {(errors as any).userName && valid.userName && (
            <div className="text-red-500 text-sm mt-2">{(errors as any).userName.message}</div>
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
          {(errors as any).email && valid.email && (
            <div className="text-red-500 text-sm mt-2">{(errors as any).email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
          <div className="relative">
            <input
              type={passDict[visible.toString()][0]}
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
              {passDict[visible.toString()][1]}
            </button>
          </div>
          {valid.password === false ? (
            <div className="text-red-500 text-sm mt-2">
              Passwords must be at least 8 characters long and have a number and a symbol.
            </div>
          ) : (
            <div className="text-gray-500 text-sm mt-2">
              Passwords must be at least 8 characters long and have a number and a symbol.
            </div>
          )}
          {(errors as any).password && valid.password && (
            <div className="text-red-500 text-sm mt-2">{(errors as any).password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirm" className="block text-gray-700 font-bold mb-2">Confirm password</label>
          <input
            type={passDict[visible.toString()][0]}
            name="confirm"
            id="confirm"
            value={user.confirm}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {valid.confirm === false && (
            <div className="text-red-500 text-sm mt-2">The passwords must match!</div>
          )}
          {(errors as any).confirm && valid.confirm && (
            <div className="text-red-500 text-sm mt-2">{(errors as any).confirm.message}</div>
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
