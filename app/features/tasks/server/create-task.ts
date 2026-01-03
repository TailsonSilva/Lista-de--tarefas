"use server";

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma"; // Use apenas este
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData): Promise<Tasks> {
    const text = formData.get('taskText') as string;

    if (!text || text.trim() === '') {
        throw new Error('O texto da tarefa não pode estar vazio.');
    }

    try {
        // Use "db" em vez de "prisma", pois foi assim que você importou na linha 4
        const newTask = await db.tasks.create({
            data: {
                text: text.trim(),
                completed: false,
            },
        });

        revalidatePath('/');
        return newTask as Tasks;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw new Error('Falha ao criar tarefa.');
    }
}