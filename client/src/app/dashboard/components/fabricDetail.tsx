import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Fabric {
    id: number;
    name: string;
    image: string;
    description: string;
    length: number;
    lengthInMeters: boolean;
    width: number;
    widthInCentimeters: boolean;
    remnant: boolean;
    composition: string;
    structure: string;
    color: string;
    print: string;
    brand: string;
    shrinkage: number;
    preWashed: boolean;
    careInstructions: string;
    location: string;
    stretch: boolean;
    sheerness: number;
    drape: number;
    weight: number;
}

interface FabricDetailProps {
    id: number;
}

const FabricDetail = ({ id }: FabricDetailProps) => {
    const [fabric, setFabric] = useState<Fabric | null>(null);

    useEffect(() => {
        const fetchFabric = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/${id}`, { withCredentials: true });
                setFabric(response.data);
            } catch (error) {
                console.error('Error fetching fabric:', error);
            }
        };
        fetchFabric();
    }, [id]);

    if (!fabric) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{fabric.name}</h1>
            <Image src={fabric.image || "/placeholder.svg"} alt={fabric.name} className="w-full h-auto mb-4" />
            <p className="mb-4">{fabric.description}</p>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Details</h2>
                <p><strong>Length:</strong> {fabric.length} {fabric.lengthInMeters ? 'meters' : 'yards'}</p>
                <p><strong>Width:</strong> {fabric.width} {fabric.widthInCentimeters ? 'centimeters' : 'inches'}</p>
                <p><strong>Remnant:</strong> {fabric.remnant ? 'Yes' : 'No'}</p>
                <p><strong>Composition:</strong> {fabric.composition}</p>
                <p><strong>Structure:</strong> {fabric.structure}</p>
                <p><strong>Color:</strong> {fabric.color}</p>
                <p><strong>Print:</strong> {fabric.print}</p>
                <p><strong>Brand:</strong> {fabric.brand}</p>
                <p><strong>Shrinkage:</strong> {fabric.shrinkage}%</p>
                <p><strong>Pre-washed:</strong> {fabric.preWashed ? 'Yes' : 'No'}</p>
                <p><strong>Care Instructions:</strong> {fabric.careInstructions}</p>
                <p><strong>Location:</strong> {fabric.location}</p>
                <p><strong>Stretch:</strong> {fabric.stretch ? 'Yes' : 'No'}</p>
                <p><strong>Sheerness:</strong> {fabric.sheerness}</p>
                <p><strong>Drape:</strong> {fabric.drape}</p>
                <p><strong>Weight:</strong> {fabric.weight}</p>
            </div>
        </div>
    );
};

export default FabricDetail;
