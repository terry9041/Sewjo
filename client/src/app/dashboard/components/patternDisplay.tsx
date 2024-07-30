import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import PatternForm from './patternForm';
import PatternDetail from './patternDetail';

interface Pattern {
    id: number;
    name: string;
    imageId: number;
    description: string;
    patternType: string;
    sizeRange: string;
}

export default function PatternDisplay() {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedPatternId, setSelectedPatternId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/all`, { withCredentials: true });
                setLoading(false);
                setPatterns(response.data);
                console.log('Patterns:', response.data);
            } catch (error) {
                console.error('Error fetching patterns:', error);
            }
        };
        fetchPatterns();
    }, []);

    const handleSubmit = async (formData) => {
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response);
            if (response.status === 200) {
                setShowForm(false);
                setPatterns([...patterns, response.data]);
            }
        } catch (error) {
            console.error('Error creating pattern:', error.response ? error.response.data : error.message);
        }
    };

    const handlePatternClick = (id: number) => {
        setSelectedPatternId(id);
    };

    const handleCloseModal = () => {
        setSelectedPatternId(null);
    };

    const filteredPatterns = patterns.filter(pattern =>
        pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="flex max-w-6xl mx-auto p-4">
            <div className={`flex-1 ${showForm ? 'w-1/2' : 'w-full'} transition-width duration-300 ease-in-out ${selectedPatternId ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search patterns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded py-2 px-4 w-full sm:w-1/2"
                    />
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                    >
                        {showForm ? 'Close Form' : 'Add Pattern'}
                    </button>
                </div>
                {loading && <p>Loading patterns...</p>}
                {!loading && filteredPatterns.length === 0 && searchQuery !== "" && (
                    <p>No patterns found. Try a different search query.</p>
                )}
                {!loading && filteredPatterns.length === 0 && searchQuery === "" && (
                    <p>No patterns found. Click the button above to add a new pattern.</p>
                )}
                {!loading && filteredPatterns.length > 0 && (
                    <p className="text-muted-foreground mb-4">Click on a pattern to view more details.</p>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredPatterns
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((pattern) => (
                        <div
                            key={pattern.id}
                            className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
                            onClick={() => handlePatternClick(pattern.id)}
                        >
                            <Image
                                src={pattern.imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${pattern.imageId}` : "/favicon.ico"}
                                alt={pattern.name}
                                width={500}
                                height={500}
                                className="object-cover w-full aspect-square"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-lg font-bold">{pattern.name}</h3>
                                <p className="text-sm text-muted-foreground">{pattern.description}</p>
                                <p className="text-sm text-muted-foreground">Type: {pattern.patternType}</p>
                                <p className="text-sm text-muted-foreground">Size: {pattern.sizeRange}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showForm && (
                <div className="flex-1 w-1/2 transition-width duration-300 ease-in-out">
                    <PatternForm handleSubmit={handleSubmit} />
                </div>
            )}
            {selectedPatternId && (
                <PatternDetail id={selectedPatternId} onClose={handleCloseModal} />
            )}
        </section>
    );
}
