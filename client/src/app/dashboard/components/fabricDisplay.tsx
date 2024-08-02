import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import FabricForm from "./fabricForm";
import FabricDetail from "./fabricDetail";

interface Fabric {
  id: number;
  name: string;
  imageId: number;
  description: string;
  length: number;
  lengthInMeters: boolean;
  width: number;
  widthInCentimeters: boolean;
}

export default function FabricDisplay() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedFabricId, setSelectedFabricId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/all`,
          { withCredentials: true }
        );
        setLoading(false);
        setFabrics(response.data);
        console.log("Fabrics:", response.data);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      }
    };
    fetchFabrics();
  }, []);

  const handleSubmit = async (formData) => {
    console.log("Form data:", formData);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response);
      if (response.status === 200) {
        setShowForm(false);
        setFabrics([...fabrics, response.data]);
      }
    } catch (error) {
      console.error(
        "Error creating fabric:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleFabricClick = (id: number) => {
    setSelectedFabricId(id);
  };

  const handleCloseModal = () => {
    setSelectedFabricId(null);
  };

  const filteredFabrics = fabrics.filter(
    (fabric) =>
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="flex max-w-6xl mx-auto p-4">
      <div
        className={`flex-1 ${showForm ? "w-1/2" : "w-full"} transition-width duration-300 ease-in-out ${selectedFabricId ? "pointer-events-none opacity-50" : ""}`}
      >
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search fabrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded py-2 px-4 w-full sm:w-1/2"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Add fabric
          </button>
        </div>
        {loading && <p>Loading fabrics...</p>}
        {!loading && filteredFabrics.length === 0 && searchQuery !== "" && (
          <p>No fabrics found. Try a different search query.</p>
        )}
        {!loading && filteredFabrics.length === 0 && searchQuery === "" && (
          <p>No fabrics found. Click the button above to add a new fabric.</p>
        )}
        {!loading && filteredFabrics.length > 0 && (
          <p className="text-muted-foreground mb-4">
            Click on a fabric to view more details.
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredFabrics
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((fabric) => (
              <div
                key={fabric.id}
                className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
                onClick={() => handleFabricClick(fabric.id)}
              >
                <img
                  src={
                    fabric.imageId != null
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${fabric.imageId}`
                      : "/favicon.ico"
                  }
                  alt={fabric.name}
                  width={500}
                  height={500}
                  className="object-cover w-full aspect-square"
                />
                <div className="p-4 bg-background">
                  <h3 className="text-lg font-bold">{fabric.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {fabric.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    L: {fabric.length} {fabric.lengthInMeters ? "m" : "yd(s)"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    W: {fabric.width} {fabric.widthInCentimeters ? "cm" : "in"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showForm && (
        <div className="flex-1 w-1/2 transition-width duration-300 ease-in-out">
          <FabricForm
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            isOpen={showForm}
          />
        </div>
      )}
      {selectedFabricId && (
        <FabricDetail id={selectedFabricId} onClose={handleCloseModal} />
      )}
    </section>
  );
}
