// pages/api/adduser.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addUser(username: string, password: string) {
    // Cette fonction devrait idéalement utiliser des pratiques de sécurité robustes pour le stockage et la vérification des mots de passe
    return prisma.user.create({
        data: {
            name: username,
            // Dans une application réelle, le mot de passe devrait être haché
            password: password,
        },
    });
}

// Fonction de gestion d'API exportée par défaut, en suivant la convention de Next.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const { userName, password } = req.body;
        const user = await addUser(userName, password);
        if (user) {
            res.status(200).json({ message: "Ajout réussi", user });
        } else {
            res
                .status(401)
                .json({ error: "Informations non valides" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Une erreur serveur s'est produite" });
    } finally {
        await prisma.$disconnect();
    }
}
