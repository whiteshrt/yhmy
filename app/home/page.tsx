    'use client'
    import React, {useEffect, useState} from 'react';
    import { useProjects } from '@/hooks/useProjects';
    import { useSessions } from '@/hooks/useSessions';
    import { useUsers } from '@/hooks/useUsers';
    import ProjectsTable from '@/components/tables/homepage/ProjectsTable';
    import UserTable from '@/components/tables/homepage/UserTable';
    import AddUserModal from '@/components/modals/homepage/AddUserModal';
    import {Button, Card, CardBody, CardHeader, Divider, Image, NextUIProvider} from '@nextui-org/react';
    import CreateProjectModal from '@/components/modals/homepage/CreateProjectModal';
    import {useRouter} from "next/navigation";



    export default function Page() {
        const { loggedUser } = useSessions();
        const router = useRouter();
        useEffect(() => {
            if (!loggedUser) {
                router.push('/');
            }
        }, [loggedUser, router]);

        const { users, isLoading: isLoadingUsers, refetchUsers } = useUsers();
        const { projects, isLoading: isLoadingProjects, refetchProjects } = useProjects(loggedUser);
        const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
        const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
        const [hoverText, setHoverText] = useState("Se déconnecter");

        const addUserModalOnOpen = () => setIsAddUserModalOpen(true);
        const addUserModalOnClose = () => setIsAddUserModalOpen(false);
        const addProjectModalOnOpen = () => setIsAddProjectModalOpen(true);
        const addProjectModalOnClose = () => setIsAddProjectModalOpen(false);

        return (
            <NextUIProvider className="bg-gradient-to-r from-blue-600 to-violet-600 min-h-screen">
                <Button
                    className="mt-3 ml-3"
                    color="danger"
                    onClick={() => {sessionStorage.clear(); window.location.reload()}}
                    onMouseOver={() => setHoverText("Vous êtes vraiment sûr ? 😔")}
                    onMouseLeave={() => setHoverText("Se déconnecter")}
                >
                    {hoverText}
                </Button>
                <main className="dark flex flex-col items-center justify-center mt-28 ml-14">
                    <div className="app-container w-full flex items-center justify-center">
                        {loggedUser === 'admin' && (
                            <Card isBlurred className="border-none bg-slate-200 ease-in-out my-5 mr-20" shadow="sm">
                                <CardHeader className="flex gap-3">
                                    <Image
                                        height={40}
                                        radius="sm"
                                        src="https://images.emojiterra.com/google/android-pie/512px/1f468-1f4bc.png"
                                        className="hover:rotate-360 ease-in-out"
                                        width={40}
                                    />
                                    <h1 className="text-2xl font-bold">Liste des employés</h1>
                                </CardHeader>
                                <Divider />
                                <CardBody className="flex flex-col justify-center items-center w-full">
                                    <UserTable users={users} isLoading={isLoadingUsers} refetchUsers={refetchUsers} />
                                    <Button onClick={addUserModalOnOpen} color="primary" variant="shadow" className="mt-4" size="lg">
                                        Ajouter un utilisateur
                                    </Button>
                                    <AddUserModal isOpen={isAddUserModalOpen} onClose={addUserModalOnClose} fetchUsers={refetchUsers} />
                                </CardBody>
                            </Card>
                        )}

                        <Card isBlurred className="border-none bg-slate-200 ease-in-out my-5" shadow="sm">
                            <CardHeader className="flex gap-3">
                                <Image
                                    height={40}
                                    radius="sm"
                                    src="https://static-00.iconduck.com/assets.00/waving-hand-sign-emoji-2048x2048-r71rstzv.png"
                                    className="hover:rotate-360 ease-in-out"
                                    width={40}
                                />
                                <div>
                                    <h1 className="text-2xl font-bold">Bienvenue {loggedUser}, voici vos projets disponibles:</h1>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <ProjectsTable projects={projects} isLoading={isLoadingProjects} refetchProjects={refetchProjects}/>
                                <div className="flex justify-center mt-4">
                                    <Button onClick={addProjectModalOnOpen} color="primary" variant="shadow" size="lg">
                                        🗓️ Créer un projet
                                    </Button>
                                </div>
                                <CreateProjectModal isOpen={isAddProjectModalOpen} onClose={addProjectModalOnClose} fetchProjects={refetchProjects}/>
                            </CardBody>
                        </Card>
                    </div>
                </main>
            </NextUIProvider>
        );
    }
