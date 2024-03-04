import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface AccessUpdateResponse {
    message: string;
    newAccess: {
        projectId: number;
        employeeName: string;
        accessType: string;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AccessUpdateResponse | { error: string }>) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { assigneeName, accessType, projectId } = req.body;

    try {
        const projectIdInt = parseInt(projectId, 10);
        if (isNaN(projectIdInt)) {
            return res.status(400).json({ error: 'Invalid projectId' });
        }
        await prisma.access.deleteMany({
            where: {
                projectId: projectIdInt,
                employeeName: assigneeName
            }
        });

        // Then, create a new record with the updated accessType
        const newAccess = await prisma.access.create({
            data: {
                projectId: projectIdInt,
                employeeName: assigneeName,
                accessType
            }
        });

        res.status(200).json({ message: 'Access type updated successfully', newAccess });
    } catch (error) {
        console.error('Error updating access type:', error);
        res.status(500).json({ error: 'An error occurred while updating access type' });
    }
}
