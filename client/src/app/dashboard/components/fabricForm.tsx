import { useState, ChangeEvent, FormEvent } from 'react';

interface FabricFormData {
    name: string;
    length: number;
    lengthInMeters: boolean;
    width: number;
    widthInCentimeters: boolean;
    remnant: boolean;
    image: string;
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

interface FabricFormProps {
    handleSubmit: (formData: FabricFormData) => void;
}

export default function FabricForm({ handleSubmit }: FabricFormProps) {
    const [formData, setFormData] = useState<FabricFormData>({
        name: '',
        length: 0,
        lengthInMeters: false,
        width: 0,
        widthInCentimeters: false,
        remnant: false,
        image: '',
        composition: '',
        structure: '',
        color: '',
        print: '',
        description: '',
        brand: '',
        shrinkage: 0,
        preWashed: false,
        careInstructions: '',
        location: '',
        stretch: false,
        sheerness: 0.0,
        drape: 0.5,
        weight: 0.5
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) : value);
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: parseFloat(value)
        }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <form onSubmit={onSubmit} className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl mb-6">Create Fabric</h2>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="length">Length</label>
                <input type="number" id="length" name="length" value={formData.length} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="lengthInMeters">Length in Meters</label>
                <input type="checkbox" id="lengthInMeters" name="lengthInMeters" checked={formData.lengthInMeters} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="width">Width</label>
                <input type="number" id="width" name="width" value={formData.width} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="widthInCentimeters">Width in Centimeters</label>
                <input type="checkbox" id="widthInCentimeters" name="widthInCentimeters" checked={formData.widthInCentimeters} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="remnant">Remnant</label>
                <input type="checkbox" id="remnant" name="remnant" checked={formData.remnant} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="image">Image URL</label>
                <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="composition">Composition</label>
                <input type="text" id="composition" name="composition" value={formData.composition} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="structure">Structure</label>
                <input type="text" id="structure" name="structure" value={formData.structure} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="color">Color</label>
                <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="print">Print</label>
                <input type="text" id="print" name="print" value={formData.print} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded"></textarea>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="brand">Brand</label>
                <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="shrinkage">Shrinkage</label>
                <input
                    type="range"
                    id="shrinkage"
                    name="shrinkage"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.shrinkage}
                    onChange={handleSliderChange}
                    className="w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="preWashed">Pre-washed</label>
                <input type="checkbox" id="preWashed" name="preWashed" checked={formData.preWashed} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="careInstructions">Care Instructions</label>
                <textarea id="careInstructions" name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full px-3 py-2 border rounded"></textarea>
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="stretch">Stretch</label>
                <input type="checkbox" id="stretch" name="stretch" checked={formData.stretch} onChange={handleChange} className="mr-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="sheerness">Sheerness</label>
                <input type="range" id="sheerness" name="sheerness" min="0" max="1" step="0.01" value={formData.sheerness} onChange={handleSliderChange} className="w-full" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="drape">Drape</label>
                <input type="range" id="drape" name="drape" min="0" max="1" step="0.01" value={formData.drape} onChange={handleSliderChange} className="w-full" />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="weight">Weight</label>
                <input type="range" id="weight" name="weight" min="0" max="1" step="0.01" value={formData.weight} onChange={handleSliderChange} className="w-full" />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Fabric
            </button>
        </form>
    );
}
