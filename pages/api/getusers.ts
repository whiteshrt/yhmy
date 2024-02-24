// pages/api/usercheck.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers() {
    return prisma.user.findMany();
}

// Fonction de gestion d'API exportée par défaut, en suivant la convention de Next.js
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const users = await getUsers();
        if (users.length > 0) {
            res.status(200).json({ users: users });
        } else {
            res.status(404).json({ error: "Aucun utilisateur trouvé" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Une erreur serveur s'est produite" });
    } finally {
        await prisma.$disconnect();
    }
}
