import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useSessions } from '@/hooks/useSessions';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { projectTitle, projectDesc } = req.body;
    const { loggedUser } = req.body;

    try {
        const project = await prisma.project.create({
            data: {
                title: projectTitle as string,
                description: projectDesc as string,
                managerName: loggedUser as string
            },
        });

        return res.status(201).json({ message: 'Project added successfully', project });
    } catch (error) {
        console.error('Error adding project:', error);
        return res.status(500).json({ error: 'An error occurred while adding project' });
    }
}
