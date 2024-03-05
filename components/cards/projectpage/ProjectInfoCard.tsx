import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    Divider,
    CardBody,
    Button,
    Image,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Pagination,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@nextui-org/react";
import RightsManagementModal from "@/components/modals/projectpage/RightsManagementModal";
import EditTaskModal from "@/components/modals/projectpage/EditTaskModal";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { IProject } from '@/types/interfaces';
import {useUsers} from "@/hooks/useUsers";

interface ProjectInfoCardProps {
    project: IProject;
    loggedUser: string;
    refetchProjectDetails: () => void;
    fibonacci: string[];
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
                                                             project,
                                                             loggedUser,
                                                             refetchProjectDetails,
                                                             fibonacci
                                                         }) => {
    const { users, isLoading: isLoadingUsers, error: usersError } = useUsers();
    const [isRightsModalOpen, setIsRightsModalOpen] = useState(false);
    const rightsModalOnOpen = () => setIsRightsModalOpen(true);
    const rightsModalOnClose = () => setIsRightsModalOpen(false);

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const editTaskModalOnOpen = () => setIsEditTaskModalOpen(true);
    const editTaskModalOnClose = () => setIsEditTaskModalOpen(false);

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 4;
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserNames, setSelectedUserNames] = useState([]);
    const [selectedEffort, setSelectedEffort] = useState('');

    const handleEditTask = (taskId: string) => {
        setSelectedTaskId(taskId);
        setIsEditTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const response = await fetch(`/api/tasks/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId }),
            });

            if (response.ok) {
                refetchProjectDetails();
                console.log("Tâche supprimée avec succès");
            } else {
                console.error("Erreur lors de la suppression de la tâche :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche :", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleStatusChange = async (value, taskId) => {
        try {
            const response = await fetch(`/api/tasks/updatestatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, newStatus: value }),
            });

            if (response.ok) {
                refetchProjectDetails();
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut de la tâche :", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (parseInt(status, 10)) {
            case 0:
                return "danger";
            case 1:
                return "primary";
            case 2:
                return "success";
            default:
                return "default";
        }
    };

    const getStatusString = (status: string) => {
        switch (parseInt(status, 10)) {
            case 0:
                return 'À faire';
            case 1:
                return 'En cours';
            case 2:
                return 'Fait';
            default:
                return 'Inconnu';
        }
    };

    return (
        <Card isBlurred className="border-none bg-slate-200 ease-in-out w-1/2" shadow="sm">
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
                        {loggedUser === project.manager.name && (
                            <Button size="md" variant="shadow" color="primary" onClick={rightsModalOnOpen}>
                                🔒 Gérer les accès
                            </Button>
                        )}
                    </div>
                    <RightsManagementModal isOpen={isRightsModalOpen} onClose={() => setIsRightsModalOpen(false)} projectId={project.id} loggedUser={loggedUser} />
                    <Divider className="mt-3" />
                    <span className="font-semibold text-lg mt-3 justify-center flex">Tâches :</span>
                    <Table className="mt-3 w-full" aria-label="Tableau des tâches du projet" fullWidth={true}>
                        <TableHeader>
                            <TableColumn>Titre</TableColumn>
                            <TableColumn>Description</TableColumn>
                            <TableColumn>Auteur</TableColumn>
                            <TableColumn>Difficulté</TableColumn>
                            <TableColumn>Assignés</TableColumn>
                            <TableColumn width="120">Statut</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {project.tasks.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.authorName}</TableCell>
                                    <TableCell>{task.effort}</TableCell>
                                    <TableCell>
                                        {task.assignees.map((assignee, index, array) => `${assignee.userName}${index < array.length - 1 ? ', ' : ''}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {loggedUser === project.managerName || loggedUser === task.authorName ? (
                                            <Dropdown className="text-black">
                                                <DropdownTrigger>
                                                    <Button color={getStatusColor(task.status)}>
                                                        {getStatusString(task.status)}
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label="Statut"
                                                    onAction={(key) => handleStatusChange(key, task.id)}
                                                >
                                                    <DropdownItem color={"danger"} key={0}>À faire</DropdownItem>
                                                    <DropdownItem color={"primary"} key={1}>En cours</DropdownItem>
                                                    <DropdownItem color={"success"} key={2}>Fait</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        ) : (
                                            <Button color={getStatusColor(task.status)}>
                                                {getStatusString(task.status)}
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(loggedUser === project.managerName || loggedUser === task.authorName || loggedUser === "admin") && (
                                            <div className="flex gap-2">
                                                <Tooltip color="default" className="text-black" content="Modifier la tâche">
                                                                        <span onClick={() => handleEditTask(task.id)} className="cursor-pointer">
                                                                            <EditIcon className="mt-2 ml-3" />
                                                                        </span>
                                                </Tooltip>
                                                {isEditTaskModalOpen && (
                                                    <EditTaskModal
                                                        isOpen={isEditTaskModalOpen}
                                                        onClose={editTaskModalOnClose}
                                                        fetchTasks={refetchProjectDetails}
                                                        taskId={selectedTaskId}
                                                        taskName={taskName}
                                                        taskDescription={taskDescription}
                                                        selectedAssignees={selectedUserNames}
                                                        selectedEffort={parseInt(selectedEffort)}
                                                        users={users}
                                                        fibonacci={fibonacci}
                                                        refetchProjectDetails={refetchProjectDetails}
                                                    />
                                                )}
                                                <Tooltip color="danger" content="Supprimer la tâche">
                                                                        <span onClick={() => handleDeleteTask(task.id)} className="cursor-pointer">
                                                                            <DeleteIcon className="mt-2 ml-3" color="red" />
                                                                        </span>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-center mt-5">
                        <Pagination
                            page={page}
                            total={Math.ceil(project.tasks.length / rowsPerPage)}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProjectInfoCard;
