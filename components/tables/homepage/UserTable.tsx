    import React, {useEffect, useState} from "react";
    import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Tooltip,
        NextUIProvider
} from "@nextui-org/react";
    import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
    import { DeleteIcon } from "@/components/icons/DeleteIcon";

    export default function UserTable({ users, refetchUsers }) {
        const {isOpen, onOpen, onOpenChange} = useDisclosure();

        const usersColumns = [
            { name: "Nom", uid: "name" },
            { name: "Projets", uid: "projects" },
            { name: "Actions", uid: "actions" },
        ];
        useEffect(() => {
            console.log('Users updated', users);
        }, [users]);
        const handleDeleteUser = async (userName:string) => {
            try {
                const response = await fetch(`/api/users/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userName}),
                });

                if (response.ok) {
                    refetchUsers();
                    console.log("Utilisateur supprimé avec succès");
                } else {
                    onOpen();

                }
            }
            catch(error) {
                console.error(error)
            }
        }

        const renderCell = (user, columnKey) => {
            let cellValue = user[columnKey];
            switch (columnKey) {
                case "name":
                    return (
                        <User
                              name={cellValue}
                              avatarProps={{
                                  src: "https://www.cewe.fr/cdn/images/tl/j4/TlJ4aGc1YmJ3V2JXNitYNUswYk9QVTE5T1RPUHI4US9jTy9WejgxRXhrL2d3Q2lYMHc1VUd4Q0JlMkE1ZUhpQzYyT2Zoc2Vpc3Mrd1BuNDF1YnpzYys5QjM5NXNFNjdxNDVhTHlOc1lUa0k9"
                              }}
                        />
                    );
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
                            {user.name !== "admin" && (
                                <Tooltip color="danger" content="Supprimer utilisateur">
                    <span onClick={() => handleDeleteUser(user.name)} className="cursor-pointer">
                      <DeleteIcon color="red" />
                    </span>
                                </Tooltip>
                            )}
                        </div>
                    );
                default:
                    return cellValue;
            }
        };

        return (
            <NextUIProvider>
            <Table isBlurred aria-label="Liste des utilisateurs">
                <TableHeader>
                    {usersColumns.map((column) => (
                        <TableColumn key={column.uid}>{column.name}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.name}>
                            {usersColumns.map((column) => (
                                <TableCell key={column.uid}>{renderCell(user, column.uid)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

                <Modal classNames={{
                    body: "dark",
                    base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }} backdrop="blur"
                       className="text-white" isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Erreur lors de la suppresion</ModalHeader>
                                <ModalBody>
                                    <p>
                                           ❌ Cet utilisateur est lié à un projet. Vous ne pouvez pas le supprimer.
                                            Veuillez rééssayer.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onPress={onClose}>
                                        Fermer
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            </NextUIProvider>
        );
    }
