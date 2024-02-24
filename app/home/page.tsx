    'use client'
    import React, { useState, useEffect } from "react";
    import { useSearchParams } from 'next/navigation'
    import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Link,
        user
    } from "@nextui-org/react";
    import {
        Table,
        TableHeader,
        TableColumn,
        TableBody,
        TableRow,
        TableCell,
        User,
        Chip,
        Tooltip,
        NextUIProvider
    } from "@nextui-org/react";
    import { EyeIcon } from "@/components/EyeIcon";
    import { EditIcon } from "@/components/EditIcon";
    import { DeleteIcon } from "@/components/DeleteIcon";
    import {PlusIcon} from "@/components/PlusIcon";
    import {log} from "node:util";

    interface User {
        name: string; // Utiliser le nom comme clé unique
        projects: string[];
    }

    const columns = [
        { name: "Nom", uid: "name" },
        { name: "Projets", uid: "projects" },
    ];

    export default function App() {
        const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
        const [userName, setUserName] = useState('');
        const [password, setPassword] = useState('');
        const [users, setUsers] = useState<User[]>([]);
        const searchParams = useSearchParams();
        const [backdrop, setBackdrop] = React.useState('opaque')
        const loggedUserName = searchParams.get('name');

        useEffect(() => {

            const fetchData = async () => {
                const response = await fetch("/api/getusers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (data.users) {
                    setUsers(data.users);
                }
            };

            fetchData();
        }, []);

        const handleAddUser = async () => {
            const response = await fetch('/api/adduser', { // Remplacez '/api/your-endpoint' par votre route API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
            if (response.ok) {
                onClose(); // Ferme le modal
                setUserName(''); // Réinitialise le champ du nom
                setPassword(''); // Réinitialise le champ du mot de passe
            } else {
                // Gestion des erreurs
                console.error('Erreur lors de l’ajout de l’utilisateur');
            }
        };

        const renderCell = React.useCallback((user, columnKey) => {
            const cellValue = user[columnKey];

            switch (columnKey) {
                case "name":
                    return (
                        <User className="text-black"
                              name={cellValue}
                              avatarProps={{
                                  src: "https://www.cewe.fr/cdn/images/tl/j4/TlJ4aGc1YmJ3V2JXNitYNUswYk9QVTE5T1RPUHI4US9jTy9WejgxRXhrL2d3Q2lYMHc1VUd4Q0JlMkE1ZUhpQzYyT2Zoc2Vpc3Mrd1BuNDF1YnpzYys5QjM5NXNFNjdxNDVhTHlOc1lUa0k9"
                              }}
                        />);
                case "projects":
                    return cellValue ? (
                        <ul>
                            {cellValue.map((project, index) => (
                                <li key={index}>{project}</li>
                            ))}
                        </ul>
                    ) : null;
                case "actions":
                    return (
                        <div className="relative flex items-center gap-2">
                            <Tooltip content="Détails">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                            </Tooltip>
                            <Tooltip content="Modifier utilisateur">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                            </Tooltip>
                            <Tooltip color="danger" content="Supprimer utilisateur">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                            </Tooltip>
                        </div>
                    );
                default:
                    return cellValue;
            }
        }, []);

        return (
            <NextUIProvider>
                <main className="flex min-h-screen flex-col items-center justify-center p-24">
                    <div className="flex w-1/3">
                        <Table aria-label="Exemple de tableau avec des cellules personnalisées">
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={users}>
                                {(item) => (
                                    <TableRow key={item.name}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {loggedUserName === "admin" && (
                        <Button onPress={onOpen} color="primary" className="mt-2">
                            Ajouter un utilisateur
                        </Button>
                    )}
                    <Modal
                        backdrop={backdrop}
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus

                                            label="Nom"
                                            placeholder="Nom de l'utilisateur"
                                            variant="bordered"
                                            className="text-black"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        <Input

                                            label="Mot de passe"
                                            placeholder="Mot de passe de l'utilisateur"
                                            type="password"
                                            variant="bordered"
                                            className="text-black"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}

                                        />

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                            Fermer
                                        </Button>
                                        <Button color="primary" onPress={handleAddUser}>
                                            Ajouter
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </main>
            </NextUIProvider>
        );
    }
