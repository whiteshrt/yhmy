'use client'
import React, { useState, useEffect } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { useUsers } from '@/hooks/useUsers';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { useUserAccess }from '@/hooks/useUserAccess';
import MultiSelectAssignees from '@/components/select/MultiSelectAssignees';
import {useRouter} from 'next/navigation'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    NextUIProvider,
    Image,
    Divider,
    Input,
    Select,
    SelectItem,
    TableCell, TableColumn, TableHeader, Table, TableBody, TableRow, Tooltip, Pagination,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import RightsManagementModal from "@/components/modals/projectpage/RightsManagementModal";
import {EditIcon} from "@/components/icons/EditIcon";
import {DeleteIcon} from "@/components/icons/DeleteIcon";
import EditTaskModal from "@/components/modals/projectpage/EditTaskModal";

export default function ProjectDetails({ params }) {
    const projectId = params.id;
    const router = useRouter();

    const { project, isLoading: isLoadingProject, refetchProjectDetails, error: projectError } = useProjectDetails(projectId);
    const { loggedUser } = useSessions();
    const { accessData, isLoading: isLoadingAccess, error: accessError } = useUserAccess(loggedUser, projectId);
console.log(accessData)
    const { users, isLoading: isLoadingUsers, error: usersError } = useUsers();
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    useEffect(() => {
        if (loggedUser === null) {
            router.push('/');
        }
    }, [loggedUser, router]);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserNames, setSelectedUserNames] = useState([]);
    const [selectedEffort, setSelectedEffort] = useState('');
    const [error, setError] = useState('');

    const [isRightsModalOpen, setIsRightsModalOpen] = useState(false);
    const rightsModalOnOpen = () => setIsRightsModalOpen(true);
    const rightsModalOnClose = () => setIsRightsModalOpen(false);


    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const editTaskModalOnOpen = () => setIsEditTaskModalOpen(true);
    const editTaskModalOnClose = () => setIsEditTaskModalOpen(false);


    const fibonacci = ["1", "2", "3", "5", "8", "13", "21"];

    const handleEffortChange = (value) => {
        const selectedValue = fibonacci[value];
        console.log("Voici l'effort : " + selectedValue);
        setSelectedEffort(selectedValue);
    };

    const handleEditTask = (taskId) => {
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
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche :", error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/tasks/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskName,
                    taskDescription,
                    selectedUserNames: Array.from(selectedUserNames),
                    selectedEffort: parseInt(selectedEffort),
                    projectId,
                    loggedInUser: loggedUser
                }),
            });

            if (response.ok) {
                refetchProjectDetails();
            } else {
                setError('Error creating task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setError('An error occurred while creating task');
        }
    };
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const handlePageChange = (page) => {
        setPage(page);
    };
    const handleStatusChange = async (value,taskId) => {
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


    return (
        <NextUIProvider className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Button onClick={() => router.push(`/home`)}
                    className="mt-5 ml-5" size='md' radius="full" color="secondary">
                ⬅ Retourner aux projets
            </Button>
            <main className="dark flex items-start justify-start mt-28 min-h-screen">
                <div className="app-container w-full flex justify-center items-center">
                    {isLoadingProject || isLoadingUsers ? (
                        <div>Loading...</div>
                    ) : projectError || usersError ? (
                        <div>Error: {projectError || usersError}</div>
                    ) : (
                        <>
                            <Card isBlurred className="border-none bg-slate-200 ease-in-out w-1/2" shadow="sm">
                                <CardHeader className="flex gap-3">
                                    <Image
                                        alt="nextui logo"
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
                                        <RightsManagementModal isOpen={isRightsModalOpen} onClose={rightsModalOnClose} projectId={projectId} loggedUser={loggedUser} />
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
                                                {project.tasks
                                                    .slice((page - 1) * rowsPerPage, page * rowsPerPage);
                                                    .map((task) => (
                                                        <TableRow key={task.id}>
                                                            <TableCell>{task.title}</TableCell>
                                                            <TableCell>{task.description}</TableCell>
                                                            <TableCell>{task.authorName}</TableCell>
                                                            <TableCell>{task.effort}</TableCell>
                                                            <TableCell>
                                                                {task.assignees.map((assignee, index, array) =>
                                                                    `${assignee.userName}${index < array.length - 1 ? ', ' : ''}`
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
                                        {/* Pagination */}
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

                            {
                                (!isLoadingProject && !isLoadingAccess && project &&
                                    (accessData?.accesses?.some(access => access.accessType === "le") || project.manager.name === loggedUser)) && (
                                <Card isBlurred className="border-none bg-slate-200 ease-in-out w-1/3 ml-20 " shadow="sm">
                                    <CardHeader className="flex gap-3">
                                        <Image
                                            alt="nextui logo"
                                            height={40}
                                            radius="sm"
                                            src="https://images.emojiterra.com/twitter/v14.0/512px/1f3af.png"
                                            width={40}
                                            className="hover:rotate-360 ease-in-out"
                                        />
                                        <h1 className="text-2xl font-bold">Ajouter une tâche</h1>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className="flex flex-col justify-center items-center">
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="mt-3">
                                                    <Input
                                                        isRequired
                                                        type="text"
                                                        label="Nom de la tâche"
                                                        className="max-w-xs"
                                                        value={taskName}
                                                        onChange={(e) => setTaskName(e.target.value)} required />
                                                </div>
                                                <div className="mt-3">
                                                    <Input
                                                        isRequired
                                                        type="text"
                                                        label="Description de la tâche"
                                                        className="max-w-xs"
                                                        value={taskDescription}
                                                        onChange={(e) => setTaskDescription(e.target.value)}
                                                        required />
                                                </div>
                                                <div className="mt-3">
                                                    <Select
                                                        placeholder="Effort de la tâche"
                                                        label="Effort de la tâche"
                                                        className="dark text-white max-w-xs"
                                                        value={selectedEffort}
                                                        onChange={(e) => handleEffortChange(e.target.value)}
                                                        isRequired
                                                    >
                                                        {fibonacci.map((number, index) => (
                                                            <SelectItem className="text-black" key={index} value={number}>
                                                                {number}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </div>

                                                <div className="mt-3">
                                                    <MultiSelectAssignees users={users}
                                                                          selectedAssignees={selectedUserNames}
                                                                          setSelectedAssignees={setSelectedUserNames} />
                                                </div>
                                                <div className="mt-3 flex justify-center items-center">
                                                    <Button size="md" variant="shadow" color="primary" type="submit" className="btn btn-primary">🚀 Ajouter la tâche</Button>
                                                </div>
                                                {error &&
                                                    <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                                            </form>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </>
                    )}
                </div>

            </main>
        </NextUIProvider>
    );

    function getStatusString(status) {
        switch (parseInt(status)) {
            case 0:
                return 'À faire';
            case 1:
                return 'En cours';
            case 2:
                return 'Fait';
            default:
                return 'Inconnu';
        }
    }
    function getStatusColor(status) {
        switch (parseInt(status)) {
            case 0:
                return "danger";
            case 1:
                return "primary";
            case 2:
                return "success";
            default:
                return "default";
        }
    }

}
