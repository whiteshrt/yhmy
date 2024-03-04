// AddTaskForm.tsx
import React, { useState } from 'react';
import { Button, Card, CardHeader, Divider, CardBody, Input, Select, SelectItem } from "@nextui-org/react";
import MultiSelectAssignees from '@/components/select/MultiSelectAssignees';
import {IUser} from "@/types/interfaces";

interface AddTaskFormProps {
    users: IUser[];
    onSubmit: (data: { taskName: string; taskDescription: string; selectedUserNames: string[]; selectedEffort: number }) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ users, onSubmit }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
    const [selectedEffort, setSelectedEffort] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            taskName,
            taskDescription,
            selectedUserNames,
            selectedEffort: parseInt(selectedEffort),
        });
    };

    return (
        <Card isBlurred className="border-none bg-slate-200 ease-in-out w-1/3 ml-20" shadow="sm">
            <CardHeader className="flex gap-3">
                <h1 className="text-2xl font-bold">Ajouter une tâche</h1>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit}>
                    <Input clearable bordered label="Nom de la tâche" placeholder="Nom" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                    <Input clearable bordered label="Description de la tâche" placeholder="Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                    <Select clearable bordered label="Effort" placeholder="Sélectionnez l'effort" value={selectedEffort} onChange={(e) => setSelectedEffort(e.target.value)}>
                        {/* Les valeurs ici pourraient être dynamiques ou prédéfinies */}
                    </Select>
                    <MultiSelectAssignees users={users} selectedAssignees={selectedUserNames} setSelectedAssignees={setSelectedUserNames} />
                    <Button auto type="submit" className="mt-4">
                        Ajouter la tâche
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}

export default AddTaskForm;
