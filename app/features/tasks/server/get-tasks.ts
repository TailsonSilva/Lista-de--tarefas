"use server"

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma";

export async function getTasks(): Promise<Tasks[]> {
    try {
        const tasks = await db.tasks.findMany({
            // Opcional: Ordena as tarefas pelo ID para manter a ordem de criação
            orderBy: {
                id: 'asc',
            },
        });
        
        // Retorna os dados tipados
        return tasks as Tasks[]; 

    } catch (error) {
        console.error("Erro ao buscar tarefas do banco de dados:", error);
        // Em caso de falha, retorne um array vazio para não quebrar a aplicação.
        return []; 
    }
}