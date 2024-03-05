import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    Divider,
    CardBody,
    Button,
    Image,
    Input,
    Select,
    SelectItem
} from "@nextui-org/react";
import MultiSelectAssignees from "@/components/select/MultiSelectAssignees";
import {IUser} from "@/types/interfaces";



interface TaskFormProps {
    projectId: string;
    refetchProjectDetails: () => void;
    loggedUser:string
    fibonacci: number[];
    users: IUser[];
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, refetchProjectDetails, loggedUser, fibonacci, users }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserNames, setSelectedUserNames] = useState([]);
    const [selectedEffort, setSelectedEffort] = useState('');
    const [error, setError] = useState('');


    const handleEffortChange = (value) => {
        const selectedValue = fibonacci[value];
        console.log("Voici l'effort : " + selectedValue);
        setSelectedEffort(selectedValue);
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

    return (
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
                                onChange={(e) => setTaskName(e.target.value)} required
                            />
                        </div>
                        <div className="mt-3">
                            <Input
                                isRequired
                                type="text"
                                label="Description de la tâche"
                                className="max-w-xs"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                required
                            />
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
                            <MultiSelectAssignees
                                users={users}
                                selectedAssignees={selectedUserNames}
                                setSelectedAssignees={setSelectedUserNames}
                            />
                        </div>
                        <div className="mt-3 flex justify-center items-center">
                            <Button size="md" variant="shadow" color="primary" type="submit" className="btn btn-primary">🚀 Ajouter la tâche</Button>
                        </div>
                        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    </form>
                </div>
            </CardBody>
        </Card>
    );
};

export default TaskForm;
