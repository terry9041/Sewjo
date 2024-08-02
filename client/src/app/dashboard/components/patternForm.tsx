import { useState, ChangeEvent, FormEvent, useRef } from "react";
import React, { CSSProperties } from "react";

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
  releaseDate: string;
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
  setShowForm: (showForm: boolean) => void;
  isOpen: boolean;
}

export default function PatternForm({
  handleSubmit,
  setShowForm,
  isOpen,
}: PatternFormProps) {
  const [formData, setFormData] = useState<PatternFormData>({
    name: "",
    brand: [],
    description: "",
    patternType: "",
    format: "",
    difficulty: 0,
    tags: [],
    releaseDate: "",
    free: false,
    outOfPrint: false,
    image: null,
    ageGroups: [],
    bodyType: "",
    cupSizes: [],
    bustMin: 0,
    bustMax: 0,
    hipMin: 0,
    hipMax: 0,
    isImperial: true,
    supplies: [],
    patternFabrics: [],
    sizeRange: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const [ocrData, setOcrData] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selection, setSelection] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const drawSelection = (
    ctx: CanvasRenderingContext2D,
    selection: { startX: number; startY: number; endX: number; endY: number }
  ) => {
    const canvas = canvasRef.current;
    if (canvas && image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(image, 0, 0); // Redraw the image
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        selection.startX,
        selection.startY,
        selection.endX - selection.startX,
        selection.endY - selection.startY
      );
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // console.log('Image loaded:', img);
          // console.log('Image dimensions:', img.width, img.height);
          setImage(img); // Store the image in state
          setWidth(img.width);
          setHeight(img.height);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
              ctx.drawImage(img, 0, 0); // Draw the image
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setSelection({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      });
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSelecting) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newSelection = {
          ...selection,
          endX: e.clientX - rect.left,
          endY: e.clientY - rect.top,
        };
        setSelection(newSelection);

        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          drawSelection(ctx, newSelection);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const MODAL_STYLES: CSSProperties = {
    position: "absolute",
    backgroundColor: "#FFF",
    zIndex: 1000, // zIndex should be a number
    width: "40%",
    minWidth: "326px",
    borderRadius: ".5em",
    top: "20px",
  };

  const OVERLAY_STYLE: CSSProperties = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0, .8)",
    zIndex: "1000",
    overflowY: "auto",
  };

  const handleOcrUpload = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = Math.abs(selection.endX - selection.startX);
      const height = Math.abs(selection.endY - selection.startY);
      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx?.drawImage(canvas, x, y, width, height, 0, 0, width, height);

      tempCanvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append("test", blob, "selected-image.png");

          try {
            console.log("Sending POST request to /api/upload");
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);
            if (data.success) {
              setOcrData(data.data);
            } else {
              console.error("OCR failed:", data.error);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      });
    }
  };

  const handleMultiChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.split(","),
    }));
  };

  const handlePatternFabricChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newPatternFabrics = [...formData.patternFabrics];
    newPatternFabrics[index] = {
      ...newPatternFabrics[index],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: newPatternFabrics,
    }));
  };

  const handleSimpleFabricChange = (
    pfIndex: number,
    sfIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    const newPatternFabrics = [...formData.patternFabrics];
    newPatternFabrics[pfIndex].fabrics[sfIndex] = {
      ...newPatternFabrics[pfIndex].fabrics[sfIndex],
      [name]: newValue,
    };
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: newPatternFabrics,
    }));
  };

  const addPatternFabric = () => {
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: [...prevState.patternFabrics, { size: "", fabrics: [] }],
    }));
  };

  const removePatternFabric = (pfIndex: number) => {
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: prevState.patternFabrics.filter(
        (_, index) => index !== pfIndex
      ),
    }));
  };

  const addSimpleFabric = (pfIndex: number) => {
    const newPatternFabrics = [...formData.patternFabrics];
    newPatternFabrics[pfIndex].fabrics = [
      ...newPatternFabrics[pfIndex].fabrics,
      {
        length: 0,
        lengthInMeters: true,
        width: 0,
        widthInCentimeters: true,
        forUse: "",
      },
    ];
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: newPatternFabrics,
    }));
  };

  const removeSimpleFabric = (pfIndex: number, sfIndex: number) => {
    const newPatternFabrics = [...formData.patternFabrics];
    newPatternFabrics[pfIndex].fabrics = newPatternFabrics[
      pfIndex
    ].fabrics.filter((_, index) => index !== sfIndex);
    setFormData((prevState) => ({
      ...prevState,
      patternFabrics: newPatternFabrics,
    }));
  };

  const calculateSizeRange = (patternFabrics: PatternFabrics[]) => {
    if (!patternFabrics.length) {
      return "";
    }
    const sizes = patternFabrics.map((pf) => pf.size);
    const minSize = Math.min(...sizes.map(Number));
    const maxSize = Math.max(...sizes.map(Number));
    return `${minSize} - ${maxSize}`;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      const updatedFormData = {
        ...formData,
        sizeRange: calculateSizeRange(formData.patternFabrics),
      };
      const data = new FormData();
      for (const key in updatedFormData) {
        if (key === "image" && updatedFormData[key]) {
          data.append(key, updatedFormData[key]);
        } else if (Array.isArray(updatedFormData[key])) {
          data.append(key, JSON.stringify(updatedFormData[key]));
        } else {
          data.append(
            key,
            updatedFormData[key] !== null ? updatedFormData[key].toString() : ""
          );
        }
      }
      handleSubmit(data);
    }
  };

  return (
    <div>
      {isOpen && (
        <div style={OVERLAY_STYLE}>
          <form
            onSubmit={onSubmit}
            className="max-w-xl mx-auto pt-12 p-8 bg-white shadow-lg rounded-lg relative"
            style={MODAL_STYLES}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 50 50"
              stroke="gray"
              onClick={() => setShowForm(false)}
              className="cursor-pointer absolute top-9 right-9"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
            <h2 className="text-2xl mb-6  font-medium">Create Pattern</h2>
            <label className="block mb-2" htmlFor="ocrImage">
              OCR Image
            </label>
            <input
              type="file"
              id="ocrImage"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
            />

            <div className="mb-4">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                width={width}
                height={height}
              />
              <button
                type="button"
                onClick={handleOcrUpload}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
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
              <label className="block mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="brand">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand.join(",")}
                onChange={handleMultiChange}
                className="w-full px-3 py-2 border rounded"
              />
              <span className="text-gray-500 text-xs italic">
                Comma separated values
              </span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              ></textarea>
              <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="patternType">
                Pattern Type
              </label>
              <input
                type="text"
                id="patternType"
                name="patternType"
                value={formData.patternType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <span className="text-red-500 text-xs italic">*required</span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="format">
                Format
              </label>
              <input
                type="text"
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="difficulty">
                Difficulty
              </label>
              <input
                type="number"
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="tags">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(",")}
                onChange={handleMultiChange}
                className="w-full px-3 py-2 border rounded"
              />
              <span className="text-gray-500 text-xs italic">
                Comma separated values
              </span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="releaseDate">
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="free">
                Free
              </label>
              <input
                type="checkbox"
                id="free"
                name="free"
                checked={formData.free}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="outOfPrint">
                Out of Print
              </label>
              <input
                type="checkbox"
                id="outOfPrint"
                name="outOfPrint"
                checked={formData.outOfPrint}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="image">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="ageGroups">
                Age Groups
              </label>
              <input
                type="text"
                id="ageGroups"
                name="ageGroups"
                value={formData.ageGroups.join(",")}
                onChange={handleMultiChange}
                className="w-full px-3 py-2 border rounded"
              />
              <span className="text-gray-500 text-xs italic">
                Comma separated values
              </span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="bodyType">
                Body Type
              </label>
              <input
                type="text"
                id="bodyType"
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="cupSizes">
                Cup Sizes
              </label>
              <input
                type="text"
                id="cupSizes"
                name="cupSizes"
                value={formData.cupSizes.join(",")}
                onChange={handleMultiChange}
                className="w-full px-3 py-2 border rounded"
              />
              <span className="text-gray-500 text-xs italic">
                Comma separated values
              </span>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="bustMin">
                Bust Min
              </label>
              <input
                type="number"
                id="bustMin"
                name="bustMin"
                value={formData.bustMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="bustMax">
                Bust Max
              </label>
              <input
                type="number"
                id="bustMax"
                name="bustMax"
                value={formData.bustMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="hipMin">
                Hip Min
              </label>
              <input
                type="number"
                id="hipMin"
                name="hipMin"
                value={formData.hipMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="hipMax">
                Hip Max
              </label>
              <input
                type="number"
                id="hipMax"
                name="hipMax"
                value={formData.hipMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="isImperial">
                Is Imperial
              </label>
              <input
                type="checkbox"
                id="isImperial"
                name="isImperial"
                checked={formData.isImperial}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="supplies">
                Supplies
              </label>
              <input
                type="text"
                id="supplies"
                name="supplies"
                value={formData.supplies.join(",")}
                onChange={handleMultiChange}
                className="w-full px-3 py-2 border rounded"
              />
              <span className="text-gray-500 text-xs italic">
                Comma separated values
              </span>
            </div>
            {formData.patternFabrics.map((pf, pfIndex) => (
              <div key={pfIndex} className="mb-6">
                <h3 className="text-xl mb-2">Pattern Fabric {pfIndex + 1}</h3>
                <div className="mb-4">
                  <label
                    className="block mb-2"
                    htmlFor={`patternFabrics-${pfIndex}-size`}
                  >
                    Size
                  </label>
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
                    <h4 className="text-lg mb-2">
                      Simple Fabric {sfIndex + 1}
                    </h4>
                    <div className="mb-2">
                      <label
                        className="block mb-2"
                        htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-length`}
                      >
                        Length
                      </label>
                      <input
                        type="number"
                        id={`simpleFabric-${pfIndex}-${sfIndex}-length`}
                        name="length"
                        value={sf.length}
                        onChange={(e) =>
                          handleSimpleFabricChange(pfIndex, sfIndex, e)
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className="block mb-2"
                        htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-lengthInMeters`}
                      >
                        Length in Meters
                      </label>
                      <input
                        type="checkbox"
                        id={`simpleFabric-${pfIndex}-${sfIndex}-lengthInMeters`}
                        name="lengthInMeters"
                        checked={sf.lengthInMeters}
                        onChange={(e) =>
                          handleSimpleFabricChange(pfIndex, sfIndex, e)
                        }
                        className="mr-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className="block mb-2"
                        htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-width`}
                      >
                        Width
                      </label>
                      <input
                        type="number"
                        id={`simpleFabric-${pfIndex}-${sfIndex}-width`}
                        name="width"
                        value={sf.width}
                        onChange={(e) =>
                          handleSimpleFabricChange(pfIndex, sfIndex, e)
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className="block mb-2"
                        htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-widthInCentimeters`}
                      >
                        Width in Centimeters
                      </label>
                      <input
                        type="checkbox"
                        id={`simpleFabric-${pfIndex}-${sfIndex}-widthInCentimeters`}
                        name="widthInCentimeters"
                        checked={sf.widthInCentimeters}
                        onChange={(e) =>
                          handleSimpleFabricChange(pfIndex, sfIndex, e)
                        }
                        className="mr-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className="block mb-2"
                        htmlFor={`simpleFabric-${pfIndex}-${sfIndex}-forUse`}
                      >
                        For Use
                      </label>
                      <input
                        type="text"
                        id={`simpleFabric-${pfIndex}-${sfIndex}-forUse`}
                        name="forUse"
                        value={sf.forUse}
                        onChange={(e) =>
                          handleSimpleFabricChange(pfIndex, sfIndex, e)
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSimpleFabric(pfIndex, sfIndex)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                    >
                      Remove Simple Fabric
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSimpleFabric(pfIndex)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                >
                  Add Simple Fabric
                </button>
                <button
                  type="button"
                  onClick={() => removePatternFabric(pfIndex)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2"
                >
                  Remove Pattern Fabric
                </button>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={addPatternFabric}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
              >
                Add Pattern Fabric
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Pattern
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
