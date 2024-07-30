import { useState, ChangeEvent, FormEvent } from 'react';

interface PatternFormData {
    name: string;
    brand: string[];
    description: string;
    patternType: string;
    format: string;
    difficulty: number;
    tags: string[];
    releaseDate: string; // Using string to handle input type date
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

interface PatternFormProps {
    handleSubmit: (formData: FormData) => void;
}

export default function PatternForm({ handleSubmit }: PatternFormProps) {
    const [formData, setFormData] = useState<PatternFormData>({
        name: '',
        brand: [],
        description: '',
        patternType: '',
        format: '',
        difficulty: 0,
        tags: [],
        releaseDate: '',
        free: false,
        outOfPrint: false,
        image: null,
        ageGroups: [],
        bodyType: '',
        sizeRange: '',
        cupSizes: [],
        bustMin: 0,
        bustMax: 0,
        hipMin: 0,
        hipMax: 0,
        isImperial: true,
        supplies: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prevState => ({
                ...prevState,
                image: e.target.files[0]
            }));
        }
    };

    const handleMultiChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value.split(',')
        }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key === 'image' && formData[key as keyof PatternFormData] instanceof File) {
                data.append(key, formData[key as keyof PatternFormData] as File);
            } else {
                data.append(key, formData[key as keyof PatternFormData] as string);
            }
        }
        handleSubmit(data);
    };

    return (
        <form onSubmit={onSubmit} className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl mb-6">Create Pattern</h2>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="brand">Brand</label>
                <input type="text" id="brand" name="brand" value={formData.brand.join(',')} onChange={handleMultiChange} className="w-full px-3 py-2 border rounded" />
                <span className="text-gray-500 text-xs italic">Comma separated values</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded"></textarea>
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="patternType">Pattern Type</label>
                <input type="text" id="patternType" name="patternType" value={formData.patternType} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="format">Format</label>
                <input type="text" id="format" name="format" value={formData.format} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="difficulty">Difficulty</label>
                <input type="number" id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="tags">Tags</label>
                <input type="text" id="tags" name="tags" value={formData.tags.join(',')} onChange={handleMultiChange} className="w-full px-3 py-2 border rounded" />
                <span className="text-gray-500 text-xs italic">Comma separated values</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="releaseDate">Release Date</label>
                <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="free">Free</label>
                <input type="checkbox" id="free" name="free" checked={formData.free} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="outOfPrint">Out of Print</label>
                <input type="checkbox" id="outOfPrint" name="outOfPrint" checked={formData.outOfPrint} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="image">Image</label>
                <input type="file" id="image" name="image" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="ageGroups">Age Groups</label>
                <input type="text" id="ageGroups" name="ageGroups" value={formData.ageGroups.join(',')} onChange={handleMultiChange} className="w-full px-3 py-2 border rounded" />
                <span className="text-gray-500 text-xs italic">Comma separated values</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="bodyType">Body Type</label>
                <input type="text" id="bodyType" name="bodyType" value={formData.bodyType} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="sizeRange">Size Range</label>
                <input type="text" id="sizeRange" name="sizeRange" value={formData.sizeRange} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="cupSizes">Cup Sizes</label>
                <input type="text" id="cupSizes" name="cupSizes" value={formData.cupSizes.join(',')} onChange={handleMultiChange} className="w-full px-3 py-2 border rounded" />
                <span className="text-gray-500 text-xs italic">Comma separated values</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="bustMin">Bust Min</label>
                <input type="number" id="bustMin" name="bustMin" value={formData.bustMin} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="bustMax">Bust Max</label>
                <input type="number" id="bustMax" name="bustMax" value={formData.bustMax} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="hipMin">Hip Min</label>
                <input type="number" id="hipMin" name="hipMin" value={formData.hipMin} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="hipMax">Hip Max</label>
                <input type="number" id="hipMax" name="hipMax" value={formData.hipMax} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="isImperial">Is Imperial</label>
                <input type="checkbox" id="isImperial" name="isImperial" checked={formData.isImperial} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="supplies">Supplies</label>
                <input type="text" id="supplies" name="supplies" value={formData.supplies.join(',')} onChange={handleMultiChange} className="w-full px-3 py-2 border rounded" />
                <span className="text-gray-500 text-xs italic">Comma separated values</span>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Pattern
            </button>
        </form>
    );
}
