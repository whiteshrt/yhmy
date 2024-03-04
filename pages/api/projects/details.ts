import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface ProjectDetailsResponse {
    id: number;
    title: string;
    description: string;
    manager: { name: string };
    tasks: {
        id: number;
        title: string;
        description: string | null;
        assignees: { user: { name: string } }[];
    }[];
    accesses: {
        projectId: number;
        employeeName: string;
        accessType: string;
    }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProjectDetailsResponse | { error: string }>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { projectId } = req.query;

    try {
        const parsedProjectId = parseInt(projectId as string, 10); // Parse projectId as an integer
        if (isNaN(parsedProjectId)) {
            return res.status(400).json({ error: 'Invalid projectId' }); // Handle invalid projectId
        }

        const project = await prisma.project.findUnique({
            where: { id: parsedProjectId },
            include: {
                manager: { select: { name: true } }, // Include the manager's name
                tasks: {
                    include: {
                        assignees: {
                            include: {
                                user: {
                                    select: { name: true } // Include the name of the user assigned to the task
                                }
                            }
                        }
                    }
                },
                accesses: true
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
