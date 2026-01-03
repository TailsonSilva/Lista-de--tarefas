"use server"

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTaskCompletion(id: number, currentStatus: boolean) {
    try {
        await db.tasks.update({
            where: { id: id },
            data: {
                completed: !currentStatus
            }
        });

        // Atualiza a página para refletir a mudança
        revalidatePath('/');
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error("Falha ao atualizar status da tarefa.");
    }
}