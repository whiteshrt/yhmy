import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import {useSessions} from "@/hooks/useSessions";

export default function CreateProjectModal({ isOpen, onClose, fetchProjects }) {

    const { loggedUser } = useSessions();
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [isResponseOk, setIsResponseOk] = useState(true)
    const handleCreateProject = async () => {
        const response = await fetch('/api/projects/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectTitle, projectDesc, loggedUser }),
        });
        if (response.ok) {
            setIsResponseOk(true);
            onClose();
            setProjectTitle('');
            setProjectDesc('');
            await fetchProjects();
        } else {
            setIsResponseOk(false);
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
        }} backdrop="blur" isOpen={isOpen} onClose={() => {onClose();setProjectTitle('');setProjectDesc(''); setIsResponseOk(true);}} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Créer un projet <span className="font-light text-sm">Vous êtes le créateur de ce projet. Vous en serez donc le manager par défaut.</span>
                </ModalHeader>
                <ModalBody>
                    <Input autoFocus label="Titre" placeholder="Titre du projet" variant="bordered" type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                    <Input label="Description" placeholder="Description du projet" type="text" variant="bordered" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
                    {!isResponseOk && (<span className="text-red-500">Error lors de la création du projet. Vérifiez que son nom n'existe pas déjà.</span>)}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={() => {onClose();setProjectTitle('');setProjectDesc(''); setIsResponseOk(true)}}>
                        Annuler
                    </Button>
                    {projectTitle.length<3 || projectDesc.length<3 ?
                        <Button color="primary" isDisabled onPress={handleCreateProject}>
                            Remplir les champs
                        </Button>

                        :
                        <Button color="primary" onPress={handleCreateProject}>
                            Créer
                        </Button>

                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
