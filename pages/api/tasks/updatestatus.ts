import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface TaskUpdateStatusRequest {
    taskId: string;
    newStatus: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskId, newStatus }: TaskUpdateStatusRequest = req.body;
    try {
        const taskIdInt = parseInt(taskId, 10);
        if (isNaN(taskIdInt)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskIdInt },
            data: {
                status: newStatus,
            },
        });

        res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
    } catch (error: any) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'An error occurred while updating task status' });
    }
}
