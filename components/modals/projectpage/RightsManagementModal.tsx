import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Radio, RadioGroup } from "@nextui-org/react";
import {useSessions} from "@/hooks/useSessions";
interface UserWithPermission {
    userName: string;
    accessType: string;
}

interface RightsManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const RightsManagementModal: React.FC<RightsManagementModalProps> = ({ isOpen, onClose, projectId }) => {
    const { loggedUser } = useSessions();
    const [usersWithPermissions, setUsersWithPermissions] = useState<UserWithPermission[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const fetchUsersWithPermissions = async (projectId: string) => {
        try {
            const response = await fetch(`/api/projects/getassigned?projectId=${projectId}`);
            if (response.ok) {
                const usersData: UserWithPermission[] = await response.json();
                setUsersWithPermissions(usersData);
            } else {
                setError('Error fetching users');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setError('An error occurred while fetching users');
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchUsersWithPermissions(projectId);
        }
    }, [projectId]);

    const handlePermissionChange = async (userName: string, accessType: string) => {
        try {
            const response = await fetch('/api/projects/editrights', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assigneeName: userName, accessType, projectId }),
            });
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
            fetchUsersWithPermissions(projectId);
            setSuccess("Les droits d'accès ont bien été mis à jour.");
            setTimeout(() => setSuccess(''), 5000);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <Modal classNames={{
            body: "dark",
            base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
            header: "border-b-[1px] border-[#292f46]",
            footer: "border-t-[1px] border-[#292f46]",
            closeButton: "hover:bg-white/5 active:bg-white/10",
        }} backdrop="blur"
               isOpen={isOpen} onClose={() => {onClose()}} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Gestion des accès</ModalHeader>
                <ModalBody>
                    {usersWithPermissions.map(({ userName, accessType }) => (
                        <div key={userName} className="mb-4">
                            <p>User: {userName}</p>
                            {loggedUser !== userName ? (
                                <RadioGroup
                                    value={accessType}
                                    onValueChange={(value) => handlePermissionChange(userName, value)}
                                    row
                                >
                                    <Radio value="ls">Lecture seule</Radio>
                                    <Radio value="le">Lecture et écriture</Radio>
                                </RadioGroup>
                            ) : (
                                <p>Vous ne pouvez pas modifier vos propres accès.</p>
                            )}
                        </div>
                    ))}
                    {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                    {success && <div style={{ color: 'green' }}>Success: {success}</div>}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RightsManagementModal;
