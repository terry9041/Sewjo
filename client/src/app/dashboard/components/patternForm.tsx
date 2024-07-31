import { useState, ChangeEvent, FormEvent, useRef } from 'react';

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
    
    //ocr
    const [useOcr, setUseOcr] = useState(false);
    const [ocrStep, setOcrStep] = useState(0); // 0: initial, 1: table selection, 2: image selection
    const [tableSelection, setTableSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
    const [imageSelection, setImageSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
    const [ocrData, setOcrData] = useState<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
    const [isSelecting, setIsSelecting] = useState(false);
    
    const drawSelectionRect = (ctx: CanvasRenderingContext2D, selection: { startX: number, startY: number, endX: number, endY: number }) => {
        const { startX, startY, endX, endY } = selection;
        const width = endX - startX;
        const height = endY - startY;
        
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
    };
    
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const ctx = canvas.getContext('2d');
                        const scale = Math.min(800 / img.width, 600 / img.height);
                        canvas.width = img.width * scale;
                        canvas.height = img.height * scale;
                        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleOcrUpload = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const processSelection = async (selection, type) => {
                const width = Math.abs(selection.endX - selection.startX);
                const height = Math.abs(selection.endY - selection.startY);
                const x = Math.min(selection.startX, selection.endX);
                const y = Math.min(selection.startY, selection.endY);
                
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx?.drawImage(canvas, x, y, width, height, 0, 0, width, height);
                
                tempCanvas.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append('image', blob, `${type}-image.png`);
                        formData.append('type', type);
                        
                        try {
                            const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                            });
                            const data = await response.json();
                            if (data.success) {
                                return data.data;
                            } else {
                                console.error(`${type} OCR failed:`, data.error);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }
                });
                return null;
            };
            const tableData = await processSelection(tableSelection, 'table');
            const imageData = await processSelection(imageSelection, 'image');
            
            if (tableData) {
                fillFormFromOcr(tableData);
            }
            if (imageData) {
                setFormData(prevState => ({ ...prevState, image: imageData }));
            }
            
            setOcrStep(0);
            setUseOcr(false);
        }
    }
    
    const fillFormFromOcr = (ocrData) => {
        setFormData(prevState => ({
            ...prevState,
            name: ocrData.name || prevState.name,
            brand: ocrData.brand ? [ocrData.brand] : prevState.brand,
            description: ocrData.description || prevState.description,
            patternType: ocrData.patternType || prevState.patternType,
        }));
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsSelecting(true);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            if (ocrStep === 0) {
                setTableSelection({ startX, startY, endX: startX, endY: startY });
            } else {
                setImageSelection({ startX, startY, endX: startX, endY: startY });
            }
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isSelecting) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                const rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    if (ocrStep === 0) {
                        drawSelectionRect(ctx, { ...tableSelection, endX, endY });
                    } else {
                        drawSelectionRect(ctx, { ...imageSelection, endX, endY });
                    }
                };
                img.src = canvas.toDataURL();
                
                if (ocrStep === 0) {
                    setTableSelection(prev => ({ ...prev, endX, endY }));
                } else {
                    setImageSelection(prev => ({ ...prev, endX, endY }));
                }
            }
        }
    };
    
    const handleMouseUp = () => {
        setIsSelecting(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            if (ocrStep === 0) {
                drawSelectionRect(ctx, tableSelection);
            } else {
                drawSelectionRect(ctx, imageSelection);
            }
        }
        setOcrStep(prev => prev + 1);
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
           <label className="block mb-2" htmlFor="ocrImage">OCR Image</label>
           <input type="file" id="ocrImage" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
           <canvas
           ref={canvasRef}
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           className="border border-gray-300 mt-2"
           width={800}
           height={600}
           />
           <button type="button" onClick={handleOcrUpload} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
           Process OCR
           </button>
        </div>
        {ocrData && (
        <div className="mb-4">
           <h3 className="text-xl mb-2">OCR Results</h3>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                 {JSON.stringify(ocrData, null, 2)}
                 </pre>
        </div>
        )}
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
