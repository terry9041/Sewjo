"use client";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/auth');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sewjo Main Page Placeholder</h1>
      <button 
        onClick={handleLoginClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        click here to login
      </button>
    </main>
  );
}
