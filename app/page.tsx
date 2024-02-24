"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/EyeSlashFilledIcon";
import { NextUIProvider } from "@nextui-org/react";
import Link from 'next/link'; // Importation du composant Link de Next.js

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // État pour stocker le message de succès ou d'erreur
  const [loggedIn, setLoggedIn] = useState(""); // État pour stocker le nom de l'utilisateur connecté

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/usercheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.message) {
      setMessage(data.message + ". Bienvenue " + data.user.name + " !");
      setLoggedIn(data.user.name); // Stockez le nom de l'utilisateur connecté
    } else if (data.error) {
      setMessage(data.error);
    }
  };

  return (
      <NextUIProvider>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-3xl font-bold">YHMY 💼</h1>
          <h3 className="mt-2 text-md">
            Entrez vos identifiants pour accéder à la plateforme.
          </h3>
          <form
              onSubmit={handleSubmit}
              className="w-full max-w-xs flex flex-col justify-center"
          >
            <Input
                clearable
                type="text"
                label="Username"
                variant="bordered"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-10"
            />
            <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-5"
                clearable
                endContent={
                  <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                  >
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
            />
            {loggedIn ? ( // Si l'utilisateur est connecté
                <Link href={{ pathname: "/home", query: { name: loggedIn }}}>
                  <Button
                      className="mt-8 justify-center w-1/2 mx-auto"
                      color="success"
                  >
                    Accéder à mon espace
                  </Button>
                </Link>
            ) : (
                <Button
                    type="submit"
                    className="mt-8 justify-center w-1/2 mx-auto"
                    color="primary"
                >
                  Login
                </Button>
            )}
          </form>
          {message && (
              <span
                  className={`mt-5 ${
                      message.includes("Bienvenue") ? "text-green-600" : "text-red-600"
                  }`}
              >
            {message}
          </span>
          )}
        </main>
      </NextUIProvider>
  );
}
