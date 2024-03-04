    import React, { useEffect } from "react";
    import { useRouter } from 'next/navigation';
    import {
        Table,
        TableHeader,
        TableColumn,
        TableBody,
        TableRow,
        TableCell,
        Tooltip,
        NextUIProvider,
    } from "@nextui-org/react";
    import { DeleteIcon } from "@/components/icons/DeleteIcon";
    import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
    import {useSessions} from "@/hooks/useSessions";
    export default function ProjectsTable({ projects, refetchProjects }) {
        const {loggedUser} = useSessions();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const router = useRouter();
        const projectsColumns = [
            { name: "Id du projet", uid: "id" },
            { name: "Nom du Projet", uid: "title" },
            { name: "Description", uid: "description" },
            { name: "Manager", uid: "managerName" },
            { name: "Actions", uid: "actions" },
        ];

        useEffect(() => {
            console.log('Projects updated', projects);
        }, [projects]);

        const handleDeleteProject = async (projectId) => {
            console.log('id : ' + projectId)
            try {
                const response = await fetch(`/api/projects/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectId }),
                });

                if (response.ok) {
                    refetchProjects();
                    console.log("Projet supprimé avec succès");
                } else {
                    onOpen();
                }
            } catch (error) {
                console.error("Erreur lors de la suppression du projet :", error);
                onOpen();
            }
        };

        const renderCell = (project, columnKey) => {
            const cellValue = project[columnKey];
            switch (columnKey) {
                case "actions":
                    return (
                        <div className="flex justify-center">
                        <Button size="sm" onClick={() => router.push(`/project/${project.id}`)}>Ouvrir</Button>
                            {(loggedUser===project.managerName || loggedUser === "admin") && (
                                <Tooltip color="danger" content="Supprimer projet">
                            <span onClick={() => handleDeleteProject(project.id)} className="cursor-pointer">
                                <DeleteIcon className="mt-2 ml-3" color="red" />
                            </span>
                        </Tooltip> )}
                        </div>
                    );
                default:
                    return cellValue;
            }
        };

        return (
            <NextUIProvider>
                <Table aria-label="Liste des projets"
                       color="secondary">
                    <TableHeader>
                        {projectsColumns.map((column) => (
                            <TableColumn key={column.uid}>{column.name}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                {projectsColumns.map((column) => (
                                    <TableCell key={column.uid}>{renderCell(project, column.uid)}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Modal open={isOpen} onClose={onClose}>
                    <ModalHeader>Erreur de Suppression</ModalHeader>
                    <ModalBody>
                        <p>❌ Ce projet est actuellement lié à des utilisateurs ou des tâches. Vous ne pouvez pas le supprimer.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button auto onClick={onClose} color="error">
                            Fermer
                        </Button>
                    </ModalFooter>
                </Modal>
            </NextUIProvider>
        );
    }
