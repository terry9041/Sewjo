import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ProjectForm from './projectForm';
import ProjectDetail from './projectDetail';

interface Project {
    id: number;
    name: string;
    instructions: string;
    patternId: number;
    readyFabrics: any[];
}

export default function ProjectDisplay() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/all`, { withCredentials: true });
                setLoading(false);
                setProjects(response.data);
                console.log('Projects:', response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        console.log('Form data:', formData);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response);
            if (response.status === 200 || response.status === 201) {
                setShowForm(false);
                setProjects([...projects, response.data]);
            }
        } catch (error) {
            console.error('Error creating project:', error.response ? error.response.data : error.message);
        }
    };

    const handleProjectClick = (id: number) => {
        setSelectedProjectId(id);
    };

    const handleCloseModal = () => {
        setSelectedProjectId(null);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.instructions.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="flex max-w-6xl mx-auto p-4">
            <div className={`flex-1 ${showForm ? 'w-1/2' : 'w-full'} transition-width duration-300 ease-in-out ${selectedProjectId ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded py-2 px-4 w-full sm:w-1/2"
                    />
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                    >
                        {showForm ? 'Close Form' : 'Add Project'}
                    </button>
                </div>
                {loading && <p>Loading projects...</p>}
                {!loading && filteredProjects.length === 0 && searchQuery !== "" && (
                    <p>No projects found. Try a different search query.</p>
                )}
                {!loading && filteredProjects.length === 0 && searchQuery === "" && (
                    <p>No projects found. Click the button above to add a new project.</p>
                )}
                {!loading && filteredProjects.length > 0 && (
                    <p className="text-muted-foreground mb-4">Click on a project to view more details.</p>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredProjects
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((project) => (
                        <div
                            key={project.id}
                            className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <ProjectImage patternId={project.patternId} />
                            <div className="p-4 bg-background">
                                <h3 className="text-lg font-bold">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">{project.instructions}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showForm && (
                <div className="flex-1 w-1/2 transition-width duration-300 ease-in-out">
                    <ProjectForm handleSubmit={handleSubmit} />
                </div>
            )}
            {selectedProjectId && (
                <ProjectDetail id={selectedProjectId} onClose={handleCloseModal} />
            )}
        </section>
    );
}

interface ProjectImageProps {
    patternId: number;
}

const ProjectImage = ({ patternId }: ProjectImageProps) => {
    const [imageId, setImageId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPatternImage = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/${patternId}`, { withCredentials: true });
                setImageId(response.data.imageId);
            } catch (error) {
                console.error('Error fetching pattern image:', error);
            }
        };
        fetchPatternImage();
    }, [patternId]);

    return (
        <Image
            src={imageId != null ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${imageId}` : "/favicon.ico"}
            alt="Project Pattern"
            width={500}
            height={500}
            className="object-cover w-full aspect-square"
        />
    );
};
