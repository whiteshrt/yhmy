// pages/api/check.ts
import { PrismaClient } from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

async function getall() {
    return prisma.user.findMany();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const users = await getall();
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
