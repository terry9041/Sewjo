"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
// import { useRouter } from 'next/navigation'; 

interface Fabric {
    id: number;
    name: string;
    imageId: number;
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

interface FabricFormData {
    name: string;
    length: number;
    lengthInMeters: boolean;
    width: number;
    widthInCentimeters: boolean;
    remnant: boolean;
    image: File | null;
    composition: string;
    structure: string;
    color: string;
    print: string;
    description: string;
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
    onClose: () => void;
}

const FabricDetail = ({ id, onClose }: FabricDetailProps) => {

    // const router = useRouter();

    const [fabric, setFabric] = useState<Fabric | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FabricFormData | null>(null);

    useEffect(() => {
        const fetchFabric = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/${id}`, { withCredentials: true });
                setFabric(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching fabric:', error);
            }
        };
        fetchFabric();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (formData) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/update/${id}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setFabric(response.data);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating fabric:', error);
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/delete/${id}`, {
            withCredentials: true,
            // headers: {
            //     'Content-Type': 'application/json',
            // },
        });
        if (response.status === 200) {
            setFabric(null); 
            setIsEditing(false);
            window.location.reload();
        }
    } catch (error) {
        console.error('Error deleting fabric:', error);
    }
};


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prevState) => ({ ...prevState, image: file }));
        }
    };

    const handleUnitChange = (name: string, value: boolean) => {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: checked }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    if (!fabric) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 opacity-50" onClick={onClose}></div>
            <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-4/5 overflow-y-auto relative">
                <button className="absolute top-4 right-4 text-black" onClick={onClose}>X</button>
                {!isEditing ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">{fabric.name}</h1>
                        <img
                            src={fabric.imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${fabric.imageId}` : "/favicon.ico"}
                            alt={fabric.name}
                            width={500}
                            height={500}
                            className="w-full h-auto mb-4"
                        />
                        <p className="mb-4">{fabric.description}</p>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Details</h2>
                            <div><strong>Length:</strong> {fabric.length} {fabric.lengthInMeters ? 'meters' : 'yards'}</div>
                            <div><strong>Width:</strong> {fabric.width} {fabric.widthInCentimeters ? 'centimeters' : 'inches'}</div>
                            <div><strong>Remnant:</strong> {fabric.remnant ? 'Yes' : 'No'}</div>
                            <div><strong>Composition:</strong> {fabric.composition}</div>
                            <div><strong>Structure:</strong> {fabric.structure}</div>
                            <div><strong>Color:</strong> {fabric.color}</div>
                            <div><strong>Print:</strong> {fabric.print}</div>
                            <div><strong>Brand:</strong> {fabric.brand}</div>
                            <div><strong>Shrinkage:</strong> {fabric.shrinkage}%</div>
                            <div><strong>Pre-washed:</strong> {fabric.preWashed ? 'Yes' : 'No'}</div>
                            <div><strong>Care Instructions:</strong> {fabric.careInstructions}</div>
                            <div><strong>Location:</strong> {fabric.location}</div>
                            <div><strong>Stretch:</strong> {fabric.stretch ? 'Yes' : 'No'}</div>
                            <div><strong>Sheerness:</strong> {fabric.sheerness}</div>
                            <div><strong>Drape:</strong> {fabric.drape}</div>
                            <div><strong>Weight:</strong> {fabric.weight}</div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>Edit</button>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </h1>
                        <img
                            src={fabric.imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${fabric.imageId}` : "/favicon.ico"}
                            alt={fabric.name}
                            width={500}
                            height={500}
                            className="w-full h-auto mb-4"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="mb-4"
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Details</h2>
                            <div>
                                <strong>Length:</strong>
                                <input
                                    type="number"
                                    name="length"
                                    value={formData?.length || 0}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded ${formData?.lengthInMeters ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleUnitChange('lengthInMeters', true)}
                                    >
                                        Meters
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded ${!formData?.lengthInMeters ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleUnitChange('lengthInMeters', false)}
                                    >
                                        Yards
                                    </button>
                                </div>
                            </div>
                            <div>
                                <strong>Width:</strong>
                                <input
                                    type="number"
                                    name="width"
                                    value={formData?.width || 0}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded ${formData?.widthInCentimeters ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleUnitChange('widthInCentimeters', true)}
                                    >
                                        Centimeters
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded ${!formData?.widthInCentimeters ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        onClick={() => handleUnitChange('widthInCentimeters', false)}
                                    >
                                        Inches
                                    </button>
                                </div>
                            </div>
                            <div>
                                <strong>Remnant:</strong>
                                <input
                                    type="checkbox"
                                    name="remnant"
                                    checked={formData.remnant}
                                    onChange={handleCheckboxChange}
                                    className="ml-2"
                                />
                            </div>
                            <div><strong>Composition:</strong> <input type="text" name="composition" value={formData.composition} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Structure:</strong> <input type="text" name="structure" value={formData.structure} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Color:</strong> <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Print:</strong> <input type="text" name="print" value={formData.print} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Brand:</strong> <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Shrinkage:</strong> <input type="number" name="shrinkage" value={formData.shrinkage} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Pre-washed:</strong> 
                                <input 
                                    type="checkbox" 
                                    name="preWashed" 
                                    checked={formData.preWashed} 
                                    onChange={handleCheckboxChange} 
                                    className="ml-2" 
                                />
                            </div>
                            <div><strong>Care Instructions:</strong> <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Location:</strong> <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Stretch:</strong> 
                                <input 
                                    type="checkbox" 
                                    name="stretch" 
                                    checked={formData.stretch} 
                                    onChange={handleCheckboxChange} 
                                    className="ml-2" 
                                />
                            </div>
                            <div><strong>Sheerness:</strong> <input type="number" name="sheerness" value={formData.sheerness} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Drape:</strong> <input type="number" name="drape" value={formData.drape} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                            <div><strong>Weight:</strong> <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" /></div>
                        </div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveClick}>Save</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteClick}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FabricDetail;
