import { PrismaClient } from '@prisma/client';
import type {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

interface TaskCreateRequest {
    taskName: string;
    taskDescription: string;
    selectedEffort: string;
    projectId: string;
    loggedInUser: string;
    selectedUserNames: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskName, taskDescription, selectedEffort, projectId, loggedInUser, selectedUserNames }: TaskCreateRequest = req.body;

    try {
        const effortInt = parseInt(selectedEffort, 10);
        if (isNaN(effortInt)) {
            return res.status(400).json({ error: 'Invalid effort value' });
        }

        const projectIdInt = parseInt(projectId, 10);
        if (isNaN(projectIdInt)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        const result = await prisma.$transaction(async (prisma) => {
            const newTask = await prisma.task.create({
                data: {
                    title: taskName,
                    description: taskDescription,
                    effort: effortInt,
                    status: '0',
                    project: {
                        connect: { id: projectIdInt },
                    },
                    author: {
                        connect: { name: loggedInUser },
                    },
                },
            });

            await Promise.all(selectedUserNames.map(async (userName) => {
                await prisma.taskAssignment.create({
                    data: {
                        taskId: newTask.id,
                        userName,
                    },
                });
            }));

            await Promise.all(selectedUserNames.map(async (userName) => {
                const existingAccess = await prisma.access.findFirst({
                    where: {
                        employeeName: userName,
                        projectId: projectIdInt,
                    },
                });

                if (!existingAccess) {
                    await prisma.access.create({
                        data: {
                            employeeName: userName,
                            projectId: projectIdInt,
                            accessType: 'ls',
                        },
                    });
                }
            }));

            return newTask;
        });

        res.status(201).json({ message: 'Task created successfully', task: result });
    } catch (error: any) {
        console.error('Error creating task:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'An entry with the same ID already exists.' });
        }
        res.status(500).json({ error: 'Error creating task' });
    }
}
