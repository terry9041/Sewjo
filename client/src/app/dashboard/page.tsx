"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The dashboard screen which the user sees after logging in
 * @returns The dashboard screen
 */
export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(err => router.push("/"));
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Sewjo Dashboard Placeholder</h1>
            <h2>Welcome back, {user?.userName}!</h2>
            <button  
                onClick={handleLogoutClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Click here to logout
            </button>
        </main>
    );
}
