"use server"

import db from "@/app/lib/prisma";

export async function deleteTask(id: number): Promise<number> {
    try {
        // Interação com o Prisma (Exclusão da Tarefa)
        await db.tasks.delete({
            where: { id },
        });

        return id;
    } catch (error) {
        console.error("Erro ao excluir a tarefa:", error);
        throw new Error(`Falha ao excluir a tarefa com ID ${id}.`);
    }
}