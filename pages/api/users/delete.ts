import { PrismaClient } from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

async function deleteU(username: string) {
    return prisma.user.delete({
        where: {
            name: username,
        },
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const { userName } = req.body;
        const deletion = await deleteU(userName);
        if (deletion) {
            res.status(200).json({ message: "Suppression réussie", deletion });
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
