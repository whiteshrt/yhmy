// hooks/useLoginForm.ts
import { useState } from "react";
import { IUserLoginResponse } from '@/types/logintypes';

export const useLoginForm = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/users/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data: IUserLoginResponse = await response.json();
        if (data.message && data.user) {
            setMessage(`${data.message}. Bienvenue ${data.user.name} !`);
            setLoggedIn(data.user.name);
            sessionStorage.setItem('userName', data.user.name);
        } else if (data.error) {
            setMessage(data.error);
        }
    };

    return { username, setUsername, password, setPassword, message, loggedIn, handleSubmit };
};
