import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Pattern {
    id: number;
    name: string;
    imageId: number;
    description: string;
    patternType: string;
    sizeRange: string;
}

interface ProjectFormData {
    name: string;
    instructions: string;
    patternId: number;
}

interface ProjectFormProps {
    handleSubmit: (formData: FormData) => void;
}

export default function ProjectForm({ handleSubmit }: ProjectFormProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        instructions: '',
        patternId: 0,
    });
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPatternId, setSelectedPatternId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/all`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setLoading(false);
                setPatterns(response.data);
            } catch (error) {
                console.error('Error fetching patterns:', error);
            }
        };
        fetchPatterns();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const selectPattern = (patternId: number) => {
        setSelectedPatternId(patternId);
        setFormData(prevState => ({
            ...prevState,
            patternId: patternId
        }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('instructions', formData.instructions);
        data.append('patternId', formData.patternId.toString());
        handleSubmit(data);
    };

    return (
        <form onSubmit={onSubmit} className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl mb-6">Create Project</h2>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="instructions">Instructions</label>
                <textarea id="instructions" name="instructions" value={formData.instructions} onChange={handleChange} className="w-full px-3 py-2 border rounded" required></textarea>
                <span className="text-red-500 text-xs italic">*required</span>
            </div>

            <div className="mb-4">
                <label className="block mb-2">Select a Pattern</label>
                {loading && <p>Loading patterns...</p>}
                {!loading && patterns.length === 0 && <p>No patterns found. Please create a pattern first.</p>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {patterns.map((pattern) => (
                        <div
                            key={pattern.id}
                            className={`p-2 border rounded ${pattern.id === selectedPatternId ? 'border-blue-500' : 'border-gray-300'}`}
                            onClick={() => selectPattern(pattern.id)}
                        >
                            <img
                                src={pattern.imageId ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}` : "/favicon.ico"}
                                alt={pattern.name}
                                width={100}
                                height={100}
                                className="w-full h-auto mb-2"
                            />
                            <h3 className="text-sm font-bold">{pattern.name}</h3>
                        </div>
                    ))}
                </div>
                <span className="text-red-500 text-xs italic">*required</span>
            </div>

            <div className="mt-6">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Project
                </button>
            </div>
        </form>
    );
}
