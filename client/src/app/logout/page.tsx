"use client";
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The logout screen which logs the user out and redirects to the home page
 * @returns null
 */
export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/logout`, {}, { withCredentials: true })
            .then(() => {
                router.push("/");
            })
            .catch(err => {
                console.error("Logout error:", err);
                router.push("/");
            });
    }, [router]);

    return null;
}
