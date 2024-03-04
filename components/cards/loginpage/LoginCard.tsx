// components/LoginCard.tsx
import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import VisibilityToggle from '../../icons/VisibilityToggle';
import Link from 'next/link';
import { useLoginForm } from '@/hooks/useLoginForm';

const LoginCard = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { username, setUsername, password, setPassword, message, loggedIn, handleSubmit } = useLoginForm();

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Card isBlurred className="border-none bg-slate-200 hover:scale-105 ease-in-out	" shadow="sm">
            <CardBody className="flex flex-col justify-center items-center">
                {}
                <h1 className="text-3xl font-bold">YHMY 💼</h1>
                <h3 className="mt-2 text-md">Entrez vos identifiants pour accéder à la plateforme.</h3>
                <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col justify-center">
                    {}
                    <Input clearable type="text" label="Nom d'utilisateur" variant="underlined" placeholder="Entrez votre nom d'utilisateur"
                           value={username} onChange={(e) => setUsername(e.target.value)} className="mt-10" />
                    <Input label="Mot de passe" variant="underlined" placeholder="Entrez votre mot de passe" type={isVisible ? "text" : "password"}
                           value={password} onChange={(e) => setPassword(e.target.value)} className="mt-5" clearable
                           endContent={<VisibilityToggle isVisible={isVisible} toggleVisibility={toggleVisibility} />} />
                    {loggedIn ? (
                        <Link className="flex justify-center items-center w-full" href="/home">
                            <Button color="success" className="mt-8 justify-center w-1/2 mx-auto">Accéder à mon espace</Button>
                        </Link>
                    ) : (
                        <Button type="submit" className="mt-8 justify-center w-1/2 mx-auto" color="primary">Se connecter</Button>
                    )}
                </form>
                {message && (
                    <span className={`mt-5 ${message.includes("Bienvenue") ? "text-green-600" : "text-red-600"}`}>{message}</span>
                )}
            </CardBody>
        </Card>
    );
};

export default LoginCard;
