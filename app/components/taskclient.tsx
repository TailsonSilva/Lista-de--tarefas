"use client";

import { useState } from "react";
import { createTask } from "../features/tasks/server/create-task";
import { deleteTask } from "../features/tasks/server/delete-task";
import { updateTaskCompletion } from "../features/tasks/server/completed-task";
import { Tasks } from "../generated/prisma/client";
import { useRouter } from "next/navigation";

interface TaskClientProps {
    initialTasks: Tasks[];
}

export default function TaskClient({ initialTasks }: TaskClientProps) {
    const [text, setText] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleAddTask = async () => {
        if (!text.trim() || isPending) return;
        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append('taskText', text);
            await createTask(formData);
            setText("");
            router.refresh();
        } catch (error) {
            alert("Erro ao adicionar tarefa");
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTask(id);
            router.refresh();
        } catch (error) {
            alert("Erro ao eliminar tarefa");
        }
    };

    const handleToggle = async (id: number, currentStatus: boolean) => {
        try {
            await updateTaskCompletion(id, currentStatus);
            router.refresh();
        } catch (error) {
            alert("Erro ao atualizar tarefa");
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto mt-10 px-4">
            {/* Input de Tarefa com Efeito Glow */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                        placeholder="O que precisa ser feito?"
                        className="flex-1 bg-transparent border-none text-zinc-100 focus:ring-0 px-4 py-3 outline-none placeholder:text-zinc-600"
                    />
                    <button
                        onClick={handleAddTask}
                        disabled={isPending}
                        className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? "..." : "Adicionar"}
                    </button>
                </div>
            </div>

            {/* Lista de Tarefas */}
            <div className="flex flex-col gap-3">
                {initialTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 text-zinc-500">
                        <p>A sua lista está vazia.</p>
                    </div>
                ) : (
                    initialTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 rounded-xl transition-all group"
                        >
                            {/* Área de Clique para Alternar Estado */}
                            <div
                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                onClick={() => handleToggle(task.id, task.completed)}
                            >
                                {/* Checkbox Customizado */}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
                                    ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                    : 'border-zinc-700 bg-zinc-800 group-hover:border-zinc-500'
                                    }`}>
                                    {task.completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>

                                <span className={`transition-all duration-300 ${task.completed
                                    ? 'line-through text-zinc-600 italic'
                                    : 'text-zinc-300 group-hover:text-white'
                                    }`}>
                                    {task.text}
                                </span>
                            </div>

                            {/* Botão Deletar */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita que clique no botão dispare o handleToggle
                                    handleDelete(task.id);
                                }}
                                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}