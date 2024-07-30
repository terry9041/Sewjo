import { useState, ChangeEvent, FormEvent } from 'react';

//TODO: Integrate OCR into this form

interface SimpleFabric {
    length: number;
    lengthInMeters: boolean;
    width: number;
    widthInCentimeters: boolean;
    forUse: string;
}

interface PatternFabrics {
    size: string;
    fabrics: SimpleFabric[];
}

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
    cupSizes: string[];
    bustMin: number;
    bustMax: number;
    hipMin: number;
    hipMax: number;
    isImperial: boolean;
    supplies: string[];
    patternFabrics: PatternFabrics[];
    sizeRange: string;
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
        cupSizes: [],
        bustMin: 0,
        bustMax: 0,
        hipMin: 0,
        hipMax: 0,
        isImperial: true,
        supplies: [],
        patternFabrics: [],
        sizeRange: ''
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
        console.log('formData:', formData.cupSizes);
    };

    const handlePatternFabricChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newPatternFabrics = [...formData.patternFabrics];
        newPatternFabrics[index] = {
            ...newPatternFabrics[index],
            [name]: value
        };
        setFormData(prevState => ({
            ...prevState,
            patternFabrics: newPatternFabrics
        }));
    };

    const handleSimpleFabricChange = (pfIndex: number, sfIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        const newPatternFabrics = [...formData.patternFabrics];
        newPatternFabrics[pfIndex].fabrics[sfIndex] = {
            ...newPatternFabrics[pfIndex].fabrics[sfIndex],
            [name]: newValue
        };
        setFormData(prevState => ({
            ...prevState,
            patternFabrics: newPatternFabrics
        }));
    };

    const addPatternFabric = () => {
        setFormData(prevState => ({
            ...prevState,
            patternFabrics: [...prevState.patternFabrics, { size: '', fabrics: [] }]
        }));
    };

    const addSimpleFabric = (pfIndex: number) => {
        const newPatternFabrics = [...formData.patternFabrics];
        newPatternFabrics[pfIndex].fabrics = [...newPatternFabrics[pfIndex].fabrics, {
            length: 0,
            lengthInMeters: true,
            width: 0,
            widthInCentimeters: true,
            forUse: ''
        }];
        setFormData(prevState => ({
            ...prevState,
            patternFabrics: newPatternFabrics
        }));
    };

    const calculateSizeRange = (patternFabrics: PatternFabrics[]) => {
        if (!patternFabrics.length) {
            return '';
        }
        const sizes = patternFabrics.map(pf => pf.size);
        const minSize = Math.min(...sizes.map(Number));
        const maxSize = Math.max(...sizes.map(Number));
        return `${minSize} - ${maxSize}`;
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            // console.log('formData:', formData);
            const updatedFormData = { ...formData, sizeRange: calculateSizeRange(formData.patternFabrics) };
            // console.log('updatedFormData:', updatedFormData);
            const data = new FormData();
            for (const key in updatedFormData) {
                if (key === 'image' && updatedFormData[key]) {
                    data.append(key, updatedFormData[key]);
                } else if (Array.isArray(updatedFormData[key])) {
                    data.append(key, JSON.stringify(updatedFormData[key]));
                } else {
                    data.append(key, updatedFormData[key] !== null ? updatedFormData[key].toString() : '');
                }
            }
            // console.log('data:', data);
            handleSubmit(data);
        }
    }


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

            {formData.patternFabrics.map((pf, pfIndex) => (
                <div key={pfIndex} className="mb-6">
                    <h3 className="text-xl mb-2">Pattern Fabric {pfIndex + 1}</h3>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor={`patternFabrics-${pfIndex}-size`}>Size</label>
                        <input
                            type="text"
                            id={`patternFabrics-${pfIndex}-size`}
                            name="size"
                            value={pf.size}
                            onChange={(e) => handlePatternFabricChange(pfIndex, e)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {pf.fabrics.map((sf, sfIndex) => (
                        <div key={sfIndex} className="mb-4">
                            <h4 className="text-lg mb-2">Simple Fabric {sfIndex + 1}</h4>
                            <div className="mb-2">
                                <label className="block mb-2" htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-length`}>Length</label>
                                <input
                                    type="number"
                                    id={`simpleFabric-${pfIndex}-${sfIndex}-length`}
                                    name="length"
                                    value={sf.length}
                                    onChange={(e) => handleSimpleFabricChange(pfIndex, sfIndex, e)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-2" htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-lengthInMeters`}>Length in Meters</label>
                                <input
                                    type="checkbox"
                                    id={`simpleFabric-${pfIndex}-${sfIndex}-lengthInMeters`}
                                    name="lengthInMeters"
                                    checked={sf.lengthInMeters}
                                    onChange={(e) => handleSimpleFabricChange(pfIndex, sfIndex, e)}
                                    className="mr-2"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-2" htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-width`}>Width</label>
                                <input
                                    type="number"
                                    id={`simpleFabric-${pfIndex}-${sfIndex}-width`}
                                    name="width"
                                    value={sf.width}
                                    onChange={(e) => handleSimpleFabricChange(pfIndex, sfIndex, e)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-2" htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-widthInCentimeters`}>Width in Centimeters</label>
                                <input
                                    type="checkbox"
                                    id={`simpleFabric-${pfIndex}-${sfIndex}-widthInCentimeters`}
                                    name="widthInCentimeters"
                                    checked={sf.widthInCentimeters}
                                    onChange={(e) => handleSimpleFabricChange(pfIndex, sfIndex, e)}
                                    className="mr-2"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-2" htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-forUse`}>For Use</label>
                                <input
                                    type="text"
                                    id={`simpleFabric-${pfIndex}-${sfIndex}-forUse`}
                                    name="forUse"
                                    value={sf.forUse}
                                    onChange={(e) => handleSimpleFabricChange(pfIndex, sfIndex, e)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addSimpleFabric(pfIndex)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">
                        Add Simple Fabric
                    </button>
                </div>
            ))}

            <div>
            <button type="button" onClick={addPatternFabric} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6">
                Add Pattern Fabric
                </button>
            </div>
            
            <div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Pattern
                </button>
            </div>
        </form>
    );
}
