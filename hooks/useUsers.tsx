// useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { IUser } from '@/types/interfaces';

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refetchIndex, setRefetchIndex] = useState<number>(0);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/getall');
            const data = await response.json();
            if (data && Array.isArray(data.users)) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refetchIndex]);

    const refetchUsers = useCallback(() => {
        setRefetchIndex(prevIndex => prevIndex + 1);
    }, []);

    return { users, isLoading, refetchUsers };
};
