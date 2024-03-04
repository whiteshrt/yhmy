    import { PrismaClient } from '@prisma/client';
    import type { NextApiRequest, NextApiResponse } from 'next';

    const prisma = new PrismaClient();
    interface AccessDetailsResponse {
        accesses: {
            projectId: number;
            employeeName: string;
            accessType: string;
            project?: {
                id: number;
                title: string;
                description: string;
                managerName: string;
            };
        }[];
    }

    export default async function handler(req: NextApiRequest, res: NextApiResponse<AccessDetailsResponse | { error: string }>) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { userName, projectId } = req.body;

        if (!userName || !projectId) {
            return res.status(400).json({ error: 'Missing userName or projectId' });
        }

        try {
            const accesses = await prisma.access.findMany({
                where: {
                    AND: [
                        { employeeName: userName },
                        { projectId: parseInt(projectId, 10) },
                    ],
                },
                include: {
                    project: true,
                },
            });

            if (accesses.length === 0) {
                return res.status(404).json({ error: 'No access found for the given userName and projectId' });
            }

            return res.status(200).json({ accesses });
        } catch (error) {
            console.error('Error fetching user access:', error);
            return res.status(500).json({ error: 'An error occurred while fetching user access' });
        }
    }
