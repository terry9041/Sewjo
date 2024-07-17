import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import FabricForm from './fabricForm';
import Image from 'next/image';

interface Fabric {
    id: number;
    name: string;
    image: string;
    description: string;
}

export default function FabricDisplay() {
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchFabrics = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/all`, { withCredentials: true });
                setFabrics(response.data);
            } catch (error) {
                console.error('Error fetching fabrics:', error);
            }
        };
        fetchFabrics();
    }, []);

    const handleSubmit = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            console.log('Response:', response);
            if (response.status === 200) {
                setShowForm(false); 
                setFabrics([...fabrics, response.data]);
            }
        } catch (error) {
            console.error('Error creating fabric:', error);
        }
    };

    return (
        <section className="flex max-w-6xl mx-auto p-4">
            <div className={`flex-1 ${showForm ? 'w-1/2' : 'w-full'} transition-width duration-300 ease-in-out`}>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showForm ? 'Close Form' : 'Add Fabric'}
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {fabrics.map((fabric) => (
                        <div key={fabric.id} className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                            <Link href={`/fabric/${fabric.id}`} className="absolute inset-0 z-10" prefetch={false}>
                                <span className="sr-only">View item</span>
                            </Link>
                            <Image
                                src={fabric.image || "/placeholder.svg"}
                                alt={fabric.name}
                                width={500}
                                height={500}
                                className="object-cover w-full aspect-square"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-lg font-bold">{fabric.name}</h3>
                                <p className="text-sm text-muted-foreground">{fabric.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showForm && (
                <div className="flex-1 w-1/2 transition-width duration-300 ease-in-out">
                    <FabricForm handleSubmit={handleSubmit} />
                </div>
            )}
        </section>
    );
}
