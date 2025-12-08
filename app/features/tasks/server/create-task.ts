"use server"

import { Tasks } from "@/app/generated/prisma/client";
import db from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData): Promise<Tasks> {
    
    // 1. Extrair os dados do FormData
    const text = formData.get('taskText') as string;

    // 2. Validação básica (garante que o texto não está vazio)
    if (!text || text.trim() === '') {
        // Em um ambiente de produção, você lançaria um erro mais específico
        throw new Error('O texto da tarefa não pode estar vazio.');
    }

    try {
        // 3. Interação com o Prisma (Criação da Tarefa)
        const newTask = await db.tasks.create({
            data: {
                text: text.trim(), // Salva o texto da tarefa, removendo espaços em branco
                completed: false, // O default do banco é false, mas definimos por clareza
            },
        });

        // 4. Revalidação de Cache (Opcional, mas recomendado para Next.js)
        // Se você estiver usando o 'use client' para listar as tarefas, pode pular isso.
        // Se a listagem estiver em um Server Component, descomente.
        revalidatePath('/'); 

        // 5. Retorna a tarefa criada
        // Note que o tipo de retorno do Prisma.tasks.create é compatível com nossa interface Task.
        return newTask as Tasks; 

    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        // Lança um erro que pode ser capturado pelo lado do cliente ou servidor
        throw new Error('Falha na comunicação com o banco de dados ao criar a tarefa.');
    }
}