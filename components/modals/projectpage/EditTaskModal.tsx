import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useSessions } from "@/hooks/useSessions";
import MultiSelectAssignees from "@/components/select/MultiSelectAssignees";

export default function EditTaskModal({ isOpen, onClose, fetchTasks, taskId, taskName: initialTaskName, taskDescription: initialTaskDescription, selectedAssignees: initialSelectedAssignees, selectedEffort: initialSelectedEffort, users, fibonacci }) {
    const { loggedUser } = useSessions();
    const [taskName, setTaskName] = useState(initialTaskName);
    const [taskDescription, setTaskDescription] = useState(initialTaskDescription);
    const [selectedAssignees, setSelectedAssignees] = useState(initialSelectedAssignees);
    const [selectedEffort, setSelectedEffort] = useState(initialSelectedEffort);
    const [isResponseOk, setIsResponseOk] = useState(true);
    console.log(taskId,
        taskName,
        taskDescription,
        Array.from(selectedAssignees),
        selectedEffort)
    const handleEffortChange = (value) => {
        const selectedValue = fibonacci[value];
        console.log("Voici l'effort : " + selectedValue);
        setSelectedEffort(selectedValue);
    };
    const handleEditTask = async () => {
        try {
            const selectedEffortInt = parseInt(selectedEffort, 10);
            if (isNaN(selectedEffortInt)) {
                console.error('Valeur de selectedEffort invalide');
                return;
            }

            const response = await fetch('/api/tasks/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId,
                    taskName,
                    taskDescription,
                    selectedAssignees: Array.from(selectedAssignees),
                    selectedEffort: selectedEffortInt,
                }),
            });

            if (response.ok) {
                setIsResponseOk(true);
                onClose();
                await fetchTasks();
            } else {
                setIsResponseOk(false);
                console.error('Erreur lors de la mise à jour de la tâche');
            }
        } catch (error) {
            setIsResponseOk(false);
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    };

    return (
        <Modal classNames={{
            body: "dark",
            base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
            header: "border-b-[1px] border-[#292f46]",
            footer: "border-t-[1px] border-[#292f46]",
            closeButton: "hover:bg-white/5 active:bg-white/10",
        }} backdrop="blur" isOpen={isOpen} onClose={() => { onClose(); setIsResponseOk(true); }}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Modifier la tâche</ModalHeader>
                <ModalBody>
                    <Input isRequired autoFocus label="Nom de la tâche" variant="bordered" type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                    <Input isRequired label="Description de la tâche" type="text" variant="bordered" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
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
                    <MultiSelectAssignees users={users} selectedAssignees={selectedAssignees} setSelectedAssignees={setSelectedAssignees} />
                    {!isResponseOk && (<span className="text-red-500">Erreur lors de la mise à jour de la tâche. Veuillez réessayer.</span>)}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={() => { onClose(); setIsResponseOk(true); }}>Annuler</Button>
                    {(taskName.length>3 && taskDescription.length>3 && selectedEffort && Array.from(selectedAssignees).length>0) ?
                        <Button color="primary" onPress={handleEditTask}>Modifier</Button>
                        :
                        <Button isDisabled color="primary" >Modifier</Button>
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
