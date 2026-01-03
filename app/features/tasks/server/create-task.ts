"use server";

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData): Promise<Tasks> {
    const text = formData.get('taskText') as string;

    // Validação básica para evitar tarefas vazias
    if (!text || text.trim() === '') {
        throw new Error('O texto da tarefa não pode estar vazio.');
    }

    try {
        // Criação da tarefa no banco de dados usando o Prisma
        const newTask = await db.tasks.create({
            data: {
                text: text.trim(),
                completed: false,
            },
        });

        // Força o Next.js a atualizar a lista na tela imediatamente
        revalidatePath('/');

        return newTask as Tasks;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw new Error('Falha ao criar tarefa no servidor.');
    }
}