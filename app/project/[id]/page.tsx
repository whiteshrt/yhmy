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

    NextUIProvider,
} from "@nextui-org/react";
import ProjectInfoCard from "@/components/cards/projectpage/ProjectInfoCard";
import TaskForm from "@/components/forms/projectpage/TaskForm";

export default function ProjectDetails({ params }) {
    const projectId = params.id;
    const router = useRouter();
    const { project, isLoading: isLoadingProject, refetchProjectDetails, error: projectError } = useProjectDetails(projectId);
    const { loggedUser } = useSessions();
    const { accessData, isLoading: isLoadingAccess, error: accessError } = useUserAccess(loggedUser, projectId);
    console.log(accessData)
    const { users, isLoading: isLoadingUsers, error: usersError } = useUsers();
    const fibonacci = ["1", "2", "3", "5", "8", "13", "21"];
    useEffect(() => {
        if (loggedUser === null) {
            router.push('/');
        }
    }, [loggedUser, router]);


    return (
        <NextUIProvider className=" bg-gradient-to-r from-blue-600 to-violet-600 min-h-screen">
            <Button onClick={() => router.push(`/home`)}
                    className="mt-5 ml-5" size='md' radius="full" color="secondary">
                ⬅ Retourner aux projets
            </Button>
            <main className="overflow-hidden dark flex items-start mt-5 justify-start ">
                <div className="app-container w-full flex justify-center items-center">
                    {isLoadingProject || isLoadingUsers ? (
                        <div>Loading...</div>
                    ) : projectError || usersError ? (
                        <div>Error: {projectError || usersError}</div>
                    ) : (
                        <>
                            <ProjectInfoCard project={project} loggedUser={loggedUser} refetchProjectDetails={refetchProjectDetails} fibonacci={fibonacci} />
                    {
                        (!isLoadingProject && !isLoadingAccess && project &&
                        (accessData?.accesses?.some(access => access.accessType === "le") || project.manager.name === loggedUser)) && (
                            <TaskForm
                                projectId={projectId}
                                refetchProjectDetails={refetchProjectDetails}
                                loggedUser={loggedUser}
                                fibonacci={fibonacci}
                                users={users}
                            />
    )}
</>
)}
</div>

</main>
</NextUIProvider>
);

}