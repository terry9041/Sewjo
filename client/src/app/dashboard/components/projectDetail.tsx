import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';

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

interface Pattern {
    id: number;
    imageId: number;
    patternFabrics: PatternFabrics[];
}

interface UserFabric {
    id: number;
    length: number;
    lengthInMeters: boolean;
    width: number;
    widthInCentimeters: boolean;
    forUse: string;
}

interface Project {
    id: number;
    name: string;
    instructions: string;
    patternId: number;
    readyFabrics: UserFabric[];
}

interface ProjectDetailProps {
    id: number;
    onClose: () => void;
}

export default function ProjectDetail({ id, onClose }: ProjectDetailProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [pattern, setPattern] = useState<Pattern | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Project | null>(null);
    const [userFabrics, setUserFabrics] = useState<UserFabric[]>([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${id}`, { withCredentials: true });
                setProject(response.data);
                setFormData(response.data);
                if (response.data.patternId) {
                    const patternResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/${response.data.patternId}`, { withCredentials: true });
                    console.log('Pattern:', patternResponse.data);
                    setPattern(patternResponse.data);
                }
                const userFabricsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/all`, { withCredentials: true });
                setUserFabrics(userFabricsResponse.data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchProject();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (formData) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/update/${id}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setProject(response.data);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating project:', error);
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/delete/${id}`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                setProject(null);
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => prevState && ({
            ...prevState,
            [name]: value,
        }));
    };

    if (!project) {
        return (
          <div className="fixed inset-0 flex items-center justify-center z-[101]">
           
              <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-4/5 overflow-y-auto relative text-center">
                
                Loading...
              </div>
            
          </div>
        );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[101]">
        <div
          className="fixed inset-0 bg-gray-800 opacity-50"
          onClick={onClose}
        ></div>
        <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-4/5 overflow-y-auto relative">
          <button
            className="absolute top-4 right-4 text-black"
            onClick={onClose}
          >
            X
          </button>
          {!isEditing ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
              <img
                src={
                  pattern?.imageId != null
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}`
                    : "/favicon.ico"
                }
                alt={project.name}
                width={500}
                height={500}
                className="w-full h-auto mb-4"
              />
              <p className="mb-4">{project.instructions}</p>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Ready Fabrics</h2>
                {project.readyFabrics.map((fabric, index) => (
                  <div key={index} className="mb-2">
                    <div>
                      <strong>Length:</strong> {fabric.length}
                    </div>
                    <div>
                      <strong>Length in Meters:</strong>{" "}
                      {fabric.lengthInMeters ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Width:</strong> {fabric.width}
                    </div>
                    <div>
                      <strong>Width in Centimeters:</strong>{" "}
                      {fabric.widthInCentimeters ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>For Use:</strong> {fabric.forUse}
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Matched Fabrics</h2>
                            {matchedFabrics.map((fabric, index) => (
                                <div key={index} className="mb-2">
                                    <div><strong>Length:</strong> {fabric.length}</div>
                                    <div><strong>Length in Meters:</strong> {fabric.lengthInMeters ? 'Yes' : 'No'}</div>
                                    <div><strong>Width:</strong> {fabric.width}</div>
                                    <div><strong>Width in Centimeters:</strong> {fabric.widthInCentimeters ? 'Yes' : 'No'}</div>
                                    <div><strong>For Use:</strong> {fabric.forUse}</div>
                                </div>
                            ))}
                        </div> */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </h1>
              <img
                src={
                  pattern?.imageId != null
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}`
                    : "/favicon.ico"
                }
                alt={project.name}
                width={500}
                height={500}
                className="w-full h-auto mb-4"
              />
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4"
                name="instructions"
                value={formData?.instructions}
                onChange={handleChange}
              ></textarea>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Ready Fabrics</h2>
                {formData?.readyFabrics.map((fabric, index) => (
                  <div key={index} className="mb-2">
                    <div>
                      <strong>Length:</strong>
                      <input
                        type="number"
                        name="length"
                        value={fabric.length}
                        onChange={(e) => {
                          const updatedFabrics = formData?.readyFabrics.map(
                            (f, i) =>
                              i === index
                                ? { ...f, length: Number(e.target.value) }
                                : f
                          );
                          setFormData(
                            (prevState) =>
                              prevState && {
                                ...prevState,
                                readyFabrics: updatedFabrics || [],
                              }
                          );
                        }}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <strong>Length in Meters:</strong>
                      <input
                        type="checkbox"
                        name="lengthInMeters"
                        checked={fabric.lengthInMeters}
                        onChange={(e) => {
                          const updatedFabrics = formData?.readyFabrics.map(
                            (f, i) =>
                              i === index
                                ? { ...f, lengthInMeters: e.target.checked }
                                : f
                          );
                          setFormData(
                            (prevState) =>
                              prevState && {
                                ...prevState,
                                readyFabrics: updatedFabrics || [],
                              }
                          );
                        }}
                        className="ml-2"
                      />
                    </div>
                    <div>
                      <strong>Width:</strong>
                      <input
                        type="number"
                        name="width"
                        value={fabric.width}
                        onChange={(e) => {
                          const updatedFabrics = formData?.readyFabrics.map(
                            (f, i) =>
                              i === index
                                ? { ...f, width: Number(e.target.value) }
                                : f
                          );
                          setFormData(
                            (prevState) =>
                              prevState && {
                                ...prevState,
                                readyFabrics: updatedFabrics || [],
                              }
                          );
                        }}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <strong>Width in Centimeters:</strong>
                      <input
                        type="checkbox"
                        name="widthInCentimeters"
                        checked={fabric.widthInCentimeters}
                        onChange={(e) => {
                          const updatedFabrics = formData?.readyFabrics.map(
                            (f, i) =>
                              i === index
                                ? { ...f, widthInCentimeters: e.target.checked }
                                : f
                          );
                          setFormData(
                            (prevState) =>
                              prevState && {
                                ...prevState,
                                readyFabrics: updatedFabrics || [],
                              }
                          );
                        }}
                        className="ml-2"
                      />
                    </div>
                    <div>
                      <strong>For Use:</strong>
                      <input
                        type="text"
                        name="forUse"
                        value={fabric.forUse}
                        onChange={(e) => {
                          const updatedFabrics = formData?.readyFabrics.map(
                            (f, i) =>
                              i === index ? { ...f, forUse: e.target.value } : f
                          );
                          setFormData(
                            (prevState) =>
                              prevState && {
                                ...prevState,
                                readyFabrics: updatedFabrics || [],
                              }
                          );
                        }}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveClick}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
}
