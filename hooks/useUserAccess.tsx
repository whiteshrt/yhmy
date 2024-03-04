import { useState, useEffect } from 'react';

export const useUserAccess = (userName, projectId) => {
    const [accessData, setAccessData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserAccess = async () => {
            if (!userName || !projectId) {
                console.log('userName and projectId are required');
                setError('userName and projectId are required');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/access/getuseraccess`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName, projectId }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAccessData(data);
            } catch (error) {
                console.error('Error fetching user access:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAccess();
    }, [userName, projectId]);

    return { accessData, isLoading, error };
};

export default useUserAccess;
