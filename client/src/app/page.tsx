"use client";
import { useRouter } from 'next/navigation';
import Navbar from './components/navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AuthModal from './components/authModal';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginClick = () => {
      setShowAuthModal(true);
  };

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, { withCredentials: true })
      .then(res => { setUser(res.data), setIsLoggedIn(true) })
      .catch(err => console.log(err));
  }, [router]);

  const handleLogoutClick = () => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/logout`, {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        router.push("/");
      })
      .catch(err => {
        console.error("Logout error:", err);
      });
  };

  const displayHandler = (route: string) => {
    if (route === "auth") {
      setShowAuthModal(true);
    } else {
      router.push(`/${route}`);
    }
  }

  return (
    <main className="main-container bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <Navbar showFullNav={false} isLoggedIn={isLoggedIn} user={user} displayHandler={displayHandler} />
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome to Sewjo</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Centralized Fabric and Pattern Management</h2>
          <p className="text-gray-700 mt-4">
            Sewjo is your all-in-one platform for managing your sewing resources. Whether you&apos;re an experienced sewer or just getting started, Sewjo helps you keep track of your fabrics, patterns, and projects in one convenient place.
          </p>
          <p className="text-gray-700 mt-4">
            No more scattered notes or complicated spreadsheets. Sewjo makes it easy to organize, search, and share your sewing inventory.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Why Choose Sewjo?</h2>
          <ul className="list-disc pl-5 text-gray-700 inline-block text-left">
            <li className="mb-2">Easily manage your fabrics, patterns, and projects</li>
            <li className="mb-2">Upload and digitize patterns with our OCR technology</li>
            <li className="mb-2">Join a community of sewing enthusiasts</li>
            <li className="mb-2">Find and share patterns and projects</li>
            <li className="mb-2">Add notes and collaborate with others</li>
            <li className="mb-2">Integrate with Google Maps to find and purchase fabrics from partnered stores</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Get Started with Sewjo</h2>
          <p className="text-gray-700 mt-4">
            Ready to streamline your sewing projects? Join Sewjo today and take the first step towards a more organized and enjoyable sewing experience.
          </p>
          {!isLoggedIn && (
            <button
              onClick={handleLoginClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Click here to login
            </button>
          )}
        </section>
      </div>
      {showAuthModal && <AuthModal setShowAuthModal={setShowAuthModal} />}
    </main>
  );
}
