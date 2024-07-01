"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function Auth() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);

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
