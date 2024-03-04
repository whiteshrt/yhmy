import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface UserWithPermission {
    userName: string;
    accessType: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserWithPermission[] | { error: string }>) {
    const { projectId } = req.query;

    try {
        const projectIdInt = parseInt(projectId as string, 10);
        if (isNaN(projectIdInt)) {
            res.status(400).json({ error: 'Invalid project ID' });
            return;
        }

        const assignees = await prisma.access.findMany({
            where: {
                projectId: projectIdInt,
            },
            include: {
                employee: true,
            },
            distinct: ['employeeName'],
            orderBy: {
                employeeName: 'asc',
            },
        });

        const usersWithPermissions = assignees.map(assignee => ({
            userName: assignee.employeeName,
            accessType: assignee.accessType,
        }));

        res.status(200).json(usersWithPermissions);
    } catch (error) {
        console.error('Error fetching assignees:', error);
        res.status(500).json({ error: 'An error occurred while fetching assignees' });
    }
}
