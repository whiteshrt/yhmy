import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

export default function AddUserModal({ isOpen, onClose, fetchUsers }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isResponseOk, setIsResponseOk] = useState(true)
    const handleAddUser = async () => {
        const response = await fetch('/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, password }),
        });
        if (response.ok) {
            setIsResponseOk(true)
            onClose();
            setUserName('');
            setPassword('');
            await fetchUsers();
        } else {
            setIsResponseOk(false)
            console.error('Erreur lors de l’ajout de l’utilisateur');
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
           isOpen={isOpen} onClose={() => {onClose();setIsResponseOk(true);setUserName('');setPassword('');}} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Ajouter un utilisateur <span className="font-light text-sm">Le mot de passe doit contenir minimum 8 caractères, une majuscule et un caractère spécial.</span></ModalHeader>
                <ModalBody>
                    <Input autoFocus label="Nom" placeholder="Nom de l'utilisateur" variant="bordered" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <Input label="Mot de passe" placeholder="Mot de passe de l'utilisateur" type="password" variant="bordered" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!isResponseOk && (<span className="text-red-500">Error lors de l'ajout de l'utilisateur. Vérifiez que le nom n'existe pas déjà.</span>)}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={() => {onClose();setIsResponseOk(true);setUserName('');setPassword('');}}>
                        Annuler
                    </Button>
                    {!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password)) ?
                        <Button isDisabled color="primary" onPress={handleAddUser}>
                            Mot de passe non conforme
                        </Button> :
                        <Button color="primary" onPress={handleAddUser}>
                    Ajouter
                </Button>
                    }

                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
