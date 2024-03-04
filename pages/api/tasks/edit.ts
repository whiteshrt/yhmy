import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const {
            taskId,
            taskName,
            taskDescription,
            selectedAssignees,
            selectedEffort
        } = req.body;

        // Validate and parse selectedEffort
        const selectedEffortInt = parseInt(selectedEffort, 10);
        if (isNaN(selectedEffortInt)) {
            return res.status(400).json({ error: 'Invalid selectedEffort value' });
        }

        // Update the task
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: taskName,
                description: taskDescription,
                effort: selectedEffortInt,
            },
        });

        // Delete existing task assignments
        await prisma.taskAssignment.deleteMany({
            where: { taskId: taskId },
        });

        // Create new task assignments
        const createdAssignees = await Promise.all(selectedAssignees.map(async (assignee) => {
            const createdAssignee = await prisma.taskAssignment.create({
                data: {
                    taskId: taskId,
                    userName: assignee,
                },
            });
            return createdAssignee;
        }));

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'An error occurred while updating task' });
    }
}
