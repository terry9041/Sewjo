"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Pattern {
    id: number;
    name: string;
    brand: string[];
    description: string;
    patternType: string;
    format: string;
    difficulty: number;
    tags: string[];
    releaseDate: string;
    free: boolean;
    outOfPrint: boolean;
    imageId: number;
    ageGroups: string[];
    bodyType: string;
    sizeRange: string;
    cupSizes: string[];
    bustMin: number;
    bustMax: number;
    hipMin: number;
    hipMax: number;
    isImperial: boolean;
    supplies: string[];
}

interface PatternFormData {
    name: string;
    brand: string[];
    description: string;
    patternType: string;
    format: string;
    difficulty: number;
    tags: string[];
    releaseDate: string;
    free: boolean;
    outOfPrint: boolean;
    image: File | null;
    ageGroups: string[];
    bodyType: string;
    sizeRange: string;
    cupSizes: string[];
    bustMin: number;
    bustMax: number;
    hipMin: number;
    hipMax: number;
    isImperial: boolean;
    supplies: string[];
}

interface PatternDetailProps {
    id: number;
    onClose: () => void;
}

const PatternDetail = ({ id, onClose }: PatternDetailProps) => {
    const [pattern, setPattern] = useState<Pattern | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<PatternFormData | null>(null);

    useEffect(() => {
        const fetchPattern = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/${id}`, { withCredentials: true });
                setPattern(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching pattern:', error);
            }
        };
        fetchPattern();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (formData) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/update/${id}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setPattern(response.data);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating pattern:', error);
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/delete/${id}`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setPattern(null);
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting pattern:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prevState) => ({ ...prevState, image: file }));
        }
    };

    const handleMultiChange = (name: string, value: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: value.split(',') }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: checked }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    if (!pattern) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 opacity-50" onClick={onClose}></div>
            <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-4/5 overflow-y-auto relative">
                <button className="absolute top-4 right-4 text-black" onClick={onClose}>X</button>
                {!isEditing ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">{pattern.name}</h1>
                        <Image
                            src={pattern.imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}` : "/favicon.ico"}
                            alt={pattern.name}
                            width={500}
                            height={500}
                            className="w-full h-auto mb-4"
                        />
                        <p className="mb-4">{pattern.description}</p>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Details</h2>
                            <div><strong>Pattern Type:</strong> {pattern.patternType}</div>
                            <div><strong>Format:</strong> {pattern.format}</div>
                            <div><strong>Difficulty:</strong> {pattern.difficulty}</div>
                            <div><strong>Tags:</strong> {pattern.tags.join(', ')}</div>
                            <div><strong>Release Date:</strong> {new Date(pattern.releaseDate).toLocaleDateString()}</div>
                            <div><strong>Free:</strong> {pattern.free ? 'Yes' : 'No'}</div>
                            <div><strong>Out of Print:</strong> {pattern.outOfPrint ? 'Yes' : 'No'}</div>
                            <div><strong>Brand:</strong> {pattern.brand.join(', ')}</div>
                            <div><strong>Age Groups:</strong> {pattern.ageGroups.join(', ')}</div>
                            <div><strong>Body Type:</strong> {pattern.bodyType}</div>
                            <div><strong>Size Range:</strong> {pattern.sizeRange}</div>
                            <div><strong>Cup Sizes:</strong> {pattern.cupSizes.join(', ')}</div>
                            <div><strong>Bust Min:</strong> {pattern.bustMin}</div>
                            <div><strong>Bust Max:</strong> {pattern.bustMax}</div>
                            <div><strong>Hip Min:</strong> {pattern.hipMin}</div>
                            <div><strong>Hip Max:</strong> {pattern.hipMax}</div>
                            <div><strong>Is Imperial:</strong> {pattern.isImperial ? 'Yes' : 'No'}</div>
                            <div><strong>Supplies:</strong> {pattern.supplies.join(', ')}</div>
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
                        <Image
                            src={pattern.imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}` : "/favicon.ico"}
                            alt={pattern.name}
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
                                <strong>Pattern Type:</strong>
                                <input
                                    type="text"
                                    name="patternType"
                                    value={formData.patternType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Format:</strong>
                                <input
                                    type="text"
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Difficulty:</strong>
                                <input
                                    type="number"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Tags:</strong>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags.join(',')}
                                    onChange={(e) => handleMultiChange('tags', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <span className="text-gray-500 text-xs italic">Comma separated values</span>
                            </div>
                            <div>
                                <strong>Release Date:</strong>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Free:</strong>
                                <input
                                    type="checkbox"
                                    name="free"
                                    checked={formData.free}
                                    onChange={handleCheckboxChange}
                                    className="ml-2"
                                />
                            </div>
                            <div>
                                <strong>Out of Print:</strong>
                                <input
                                    type="checkbox"
                                    name="outOfPrint"
                                    checked={formData.outOfPrint}
                                    onChange={handleCheckboxChange}
                                    className="ml-2"
                                />
                            </div>
                            <div>
                                <strong>Brand:</strong>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand.join(',')}
                                    onChange={(e) => handleMultiChange('brand', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <span className="text-gray-500 text-xs italic">Comma separated values</span>
                            </div>
                            <div>
                                <strong>Age Groups:</strong>
                                <input
                                    type="text"
                                    name="ageGroups"
                                    value={formData.ageGroups.join(',')}
                                    onChange={(e) => handleMultiChange('ageGroups', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <span className="text-gray-500 text-xs italic">Comma separated values</span>
                            </div>
                            <div>
                                <strong>Body Type:</strong>
                                <input
                                    type="text"
                                    name="bodyType"
                                    value={formData.bodyType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Size Range:</strong>
                                <input
                                    type="text"
                                    name="sizeRange"
                                    value={formData.sizeRange}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Cup Sizes:</strong>
                                <input
                                    type="text"
                                    name="cupSizes"
                                    value={formData.cupSizes.join(',')}
                                    onChange={(e) => handleMultiChange('cupSizes', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <span className="text-gray-500 text-xs italic">Comma separated values</span>
                            </div>
                            <div>
                                <strong>Bust Min:</strong>
                                <input
                                    type="number"
                                    name="bustMin"
                                    value={formData.bustMin}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Bust Max:</strong>
                                <input
                                    type="number"
                                    name="bustMax"
                                    value={formData.bustMax}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Hip Min:</strong>
                                <input
                                    type="number"
                                    name="hipMin"
                                    value={formData.hipMin}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Hip Max:</strong>
                                <input
                                    type="number"
                                    name="hipMax"
                                    value={formData.hipMax}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <strong>Is Imperial:</strong>
                                <input
                                    type="checkbox"
                                    name="isImperial"
                                    checked={formData.isImperial}
                                    onChange={handleCheckboxChange}
                                    className="ml-2"
                                />
                            </div>
                            <div>
                                <strong>Supplies:</strong>
                                <input
                                    type="text"
                                    name="supplies"
                                    value={formData.supplies.join(',')}
                                    onChange={(e) => handleMultiChange('supplies', e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <span className="text-gray-500 text-xs italic">Comma separated values</span>
                            </div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveClick}>Save</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteClick}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PatternDetail;
