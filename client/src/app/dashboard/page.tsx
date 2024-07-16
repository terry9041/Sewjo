"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import FabricDisplay from './components/fabricDisplay';

/**
 * The dashboard screen which the user sees after logging in
 * @returns The dashboard screen
 */
export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [display, setDisplay] = useState("dashboard");

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(err => router.push("/auth"));
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
    }

    const displayHandler = (route: string) => {
        if (route === "patterns") {
            setDisplay("patterns");
        } else if (route === "projects") {
            setDisplay("projects");
        } else if (route === "fabrics") {
            setDisplay("fabrics");
        } else {
            router.push(`/${route}`);
        }
    }

    return (
        <main className="main-container min-h-screen bg-gray-100 pt-16 p-4"> {/* Added pt-16 to offset the content */}
            <Navbar showFullNav={true} isLoggedIn={true} user={user} displayHandler={displayHandler} />
            <div className="mt-8">
                {display === "dashboard" && (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4">Welcome back to sewjo, {user?.userName}!</h2>
                        <button  
                            onClick={handleLogoutClick}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Click here to logout
                        </button>
                    </div>
                )}
                {display === "fabrics" && (
                    <FabricDisplay />
                )}
                {display === "patterns" && (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4">Patterns</h2>
                        <p>Patterns content goes here...</p>
                    </div>
                )}
                {display === "projects" && (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4">Projects</h2>
                        <p>Projects content goes here...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
