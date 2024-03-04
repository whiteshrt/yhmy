// useProjectDetails.ts
import { useState, useEffect, useCallback } from 'react';
import { IProject } from '@/types/interfaces';

export function useProjectDetails(projectId: string) {
    const [project, setProject] = useState<IProject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchIndex, setRefetchIndex] = useState<number>(0);

    const fetchProjectDetails = useCallback(async () => {
        if (!projectId) {
            setError('Project ID is required');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/details?projectId=${projectId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setProject(data);
        } catch (error: any) {
            console.error('Error fetching project details:', error);
            setError('Failed to fetch project details');
        } finally {
            setIsLoading(false);
        }
    }, [projectId, refetchIndex]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const refetchProjectDetails = useCallback(() => {
        setRefetchIndex((prevIndex) => prevIndex + 1);
    }, []);

    return { project, isLoading, error, refetchProjectDetails };
}
