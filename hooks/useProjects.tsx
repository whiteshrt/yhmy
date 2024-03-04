// useProjects.ts
import { useState, useEffect, useCallback } from 'react';
import { IProject } from '@/types/interfaces';

export const useProjects = (loggedUserName: string|null) => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refetchIndex, setRefetchIndex] = useState<number>(0);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/getuserprojects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loggedUserName }),
            });
            const data = await response.json();
            if (data && Array.isArray(data.projects)) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoading(false);
        }
    }, [loggedUserName]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, refetchIndex]);

    const refetchProjects = useCallback(() => {
        setRefetchIndex(prevIndex => prevIndex + 1);
    }, []);

    return { projects, isLoading, refetchProjects };
};
