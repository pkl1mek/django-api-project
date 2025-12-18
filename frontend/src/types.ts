export interface ProjectImage {
    id: number;
    image: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    images: ProjectImage[];
    created_at: string;
}