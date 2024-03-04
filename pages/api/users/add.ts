import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface AddUserResponse {
    name: string;
}

async function add(username: string, password: string): Promise<AddUserResponse> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
        data: {
            name: username,
            password: hashedPassword,
        },
    });

    return { name: user.name };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const { userName, password } = req.body;
        const user = await add(userName, password);
        res.status(200).json({ message: "Ajout réussi", user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Une erreur serveur s'est produite" });
    } finally {
        await prisma.$disconnect();
    }
}
