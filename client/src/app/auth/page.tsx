"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import axios from 'axios';

export default function Auth() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, { withCredentials: true })
          .then(res => router.push("/dashboard"))
          .catch(err => console.log(err));
    }, [router]);

  const swapReg = () => {
    setShowLogin(!showLogin);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {showLogin ? (
        <LoginForm swapReg={swapReg} />
      ) : (
        <RegisterForm swapReg={swapReg} />
      )}
    </main>
  );
}
