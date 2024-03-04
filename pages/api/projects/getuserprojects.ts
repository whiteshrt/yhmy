import { PrismaClient } from "@prisma/client";
import {useSessions} from "@/hooks/useSessions";
import type {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

async function getUserProjects(userName: string) {
    if (userName === "admin") {
        return await prisma.project.findMany();
    }

    const managedProjects = await prisma.project.findMany({
        where: { managerName: userName },
    });

    const accessProjects = await prisma.access.findMany({
        where: {
            AND: [
                { employeeName: userName },
                { OR: [{ accessType: "ls" }, { accessType: "le" }] },
            ],
        },
        include: {
            project: true,
        },
    });

    const projectsFromAccess = accessProjects.map(access => access.project);
    const uniqueAccessProjectIds = [...new Set(projectsFromAccess.map(project => project.id))];
    const uniqueAccessProjects = uniqueAccessProjectIds.map(id => projectsFromAccess.find(project => project.id === id));

    const combinedProjectsMap = new Map(managedProjects.concat(uniqueAccessProjects).map(project => [project.id, project]));
    const combinedProjects = Array.from(combinedProjectsMap.values());

    return combinedProjects;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const { loggedUserName } = req.body;
        console.log('ROUTE GETUSERSPROJECTS / LOGGEDUSERNAME : ' + loggedUserName)
        const projects = await getUserProjects(loggedUserName);
        res.status(200).json({ projects });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Une erreur serveur s'est produite" });
    } finally {
        await prisma.$disconnect();
    }
}
