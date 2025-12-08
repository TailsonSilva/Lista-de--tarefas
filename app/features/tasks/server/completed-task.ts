"use server"

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma";

export async function updateTaskCompletion(id: number, completed: boolean): Promise<Tasks> {
    try {
        const updatedTask = await db.tasks.update({
            where: { id },
            data: { completed: completed }, // Define o novo status
        });

        // revalidatePath('/'); // Opcional: descomente se a listagem for Server Component

        return updatedTask as Tasks;
    } catch (error) {
        console.error("Erro ao atualizar o status da tarefa:", error);
        throw new Error(`Falha ao atualizar a tarefa com ID ${id}.`);
    }
}