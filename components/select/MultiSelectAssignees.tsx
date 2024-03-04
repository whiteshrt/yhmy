import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface User {
    name: string;
}

interface MultiSelectAssigneesProps {
    users: User[];
    selectedAssignees: string[];
    setSelectedAssignees: (selected: string[]) => void;
}

const MultiSelectAssignees: React.FC<MultiSelectAssigneesProps> = ({ users, selectedAssignees, setSelectedAssignees }) => {
    return (
        <Select
            value={selectedAssignees}
            selectionMode="multiple"
            onSelectionChange={setSelectedAssignees}
            required
            isRequired
            className="max-w-xs"
            label="Salarié"
            placeholder="Salarié à qui assigner la tâche"
        >
            {users.map(user => (
                <SelectItem className="text-black" key={user.name} value={user.name}>
                    {user.name}
                </SelectItem>
            ))}
        </Select>
    );
}

export default MultiSelectAssignees;
