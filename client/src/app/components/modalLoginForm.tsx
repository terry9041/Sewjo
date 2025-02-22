import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Image from 'next/image';
import openEyeIcon from '../icons/open_eye.png';
import closedEyeIcon from '../icons/closed_eye.png';

export default function ModalLoginForm({ swapReg }) {
  const initFormState = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(initFormState);
  const [visible, setVisible] = useState(false);
  const [valid, setValid] = useState(true);
  const router = useRouter();

  const passDict = {
    true: ['text', 'Hide Password!', openEyeIcon],
    false: ['password', 'Show Password!', closedEyeIcon]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const showPass = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, user, {
        withCredentials: true,
        // headers: {
        //   'Content-Type': 'application/json',
        // }
      })
      .then((res) => {
        router.push("/dashboard");
        console.log(res);
      })
      .catch((err) => {
        setValid(false);
        setUser(initFormState);
        console.error(err);
      });
  };

  return (
    <div className="login-form w-full">
      <h2 className="text-3xl font-bold mb-6 w-full">Sign in </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {!valid && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
            Username or password incorrect!
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            autoComplete="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
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
              className="absolute right-2 top-2 bg-white-300 py-1 px-2"
            >
              <Image src={passDict[visible.toString()][2]} alt={passDict[visible.toString()][1]} width={15} height={15} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-6">
        Don&apos;t have an account?{" "}
        <button onClick={swapReg} className="text-blue-500 hover:text-blue-700">
          Register here!
        </button>
      </p>
    </div>
  );
}
