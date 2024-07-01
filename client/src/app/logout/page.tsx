"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The logout screen which the user gets after logging out of the application
 * @returns The logout screen
 */
export default function Logout() {
    const [counter, setCounter] = useState(3);
    const router = useRouter();

    useEffect(() => {
        if (counter === 3) {
            axios.get("http://localhost:8080/api/user/logout", { withCredentials: true })
                .then(res => console.log("Logged out!"))
                .catch(err => console.log(err));
        }
        if (counter === 0) router.push("/");
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter, router]);

    return (
        <div className="logged-out">
            <div className="logged-out-cont">
                <h1>You have been logged out. Returning to login page in {counter} seconds...</h1>
            </div>
        </div>
    );
}
