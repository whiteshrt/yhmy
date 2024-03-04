// ProjectInfoCard.tsx
import React from 'react';
import { Card, CardHeader, Divider, CardBody, Button, Image } from "@nextui-org/react";
import { IProject } from '@/types/interfaces';

interface ProjectInfoCardProps {
    project: IProject;
    isRightsModalOpen: boolean;
    rightsModalOnOpen: () => void;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project, isRightsModalOpen, rightsModalOnOpen }) => {
    return (
        <Card isBlurred className="border-none bg-slate-200 ease-in-out w-1/3" shadow="sm">
            <CardHeader className="flex gap-3">
                <Image
                    alt="project logo"
                    height={40}
                    radius="sm"
                    src="https://static-00.iconduck.com/assets.00/face-with-monocle-emoji-2048x2048-g2ada823.png"
                    width={40}
                    className="hover:rotate-360 ease-in-out"
                />
                <h1 className="text-2xl font-bold">Détails du projet</h1>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid justify-center w-full">
                    <p className="text-lg"><span className="font-semibold">Titre :</span> {project.title}</p>
                    <p className="text-lg mt-3"><span className="font-semibold">Description :</span> {project.description}</p>
                    <p className="text-lg mt-3"><span className="font-semibold">Manager :</span> {project.manager.name}</p>
                    <div className="flex justify-center mt-3">
                        <Button size="md" variant="shadow" color="primary" onClick={rightsModalOnOpen}>🔒 Gérer les accès</Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default ProjectInfoCard;
