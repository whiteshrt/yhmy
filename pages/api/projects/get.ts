import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { projectId } = req.query;

    try {
        const parsedProjectId = parseInt(projectId as string, 10);
        if (isNaN(parsedProjectId)) {
            return res.status(400).json({ error: 'Invalid projectId' });
        }

        const project = await prisma.project.findUnique({
            where: { id: parsedProjectId },
            include: {
                manager: { select: { name: true } },
                tasks: {
                    include: { assignees: { include: { user: true } } },
                },
            }
        });

        if (!project) {
            return res.status(401).json({ error: 'Project doesn\'t exist' });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ error: 'An error occurred while fetching project' });
    }
}
