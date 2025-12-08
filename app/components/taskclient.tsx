// TaskClient.tsx (Client Component)

'use client';

import React, { useState } from 'react';
// Usando a tipagem do Prisma
import { Tasks } from '../generated/prisma/client'; 
// Assumindo que o caminho para suas Server Actions está correto
import { updateTaskCompletion } from '../features/tasks/server/completed-task';
import { deleteTask } from '../features/tasks/server/delete-task';
import { createTask } from '../features/tasks/server/create-task';

interface TaskClientProps {
    initialTasks: Tasks[];
}

export default function TaskClient({ initialTasks }: TaskClientProps) {

    const [tasks, setTasks] = useState<Tasks[]>(initialTasks);
    const [newTaskText, setNewTaskText] = useState('');

    // ... (handleAddTask - A ser preenchida com a Server Action de criação) ...
    const handleAddTask = async (event: React.FormEvent) => { // 👈 Adicionamos o bloco de chaves {} aqui
    
    event.preventDefault(); // Impede o recarregamento da página

    if (!newTaskText || newTaskText.trim() === '') {
        alert('Por favor, digite o nome da tarefa.');
        return;
    }

    // Cria um objeto FormData
    const formData = new FormData();
    formData.append('taskText', newTaskText); 

    try {
        // Chama a Server Action e espera a nova tarefa criada do banco
        const createdTask = await createTask(formData);
        
        // Atualiza o estado local com a nova tarefa retornada
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTaskText(''); // Limpa o input
    } catch (error) {
        console.error("Erro ao adicionar a tarefa:", error);
        alert('Erro ao adicionar a tarefa: ' + (error as Error).message);
    }
};

    // 🔄 FUNÇÃO DE CONCLUIR (Correta e Assíncrona)
    const handleToggleTask = async (taskId: number) => {
        
        const taskToToggle = tasks.find(task => task.id === taskId);
        
        if (!taskToToggle) return;

        const newCompletedStatus = !taskToToggle.completed;

        try {
            const updatedTaskFromDB = await updateTaskCompletion(taskId, newCompletedStatus);
            
            setTasks((prevTasks) => 
                prevTasks.map((task) => 
                    task.id === taskId ? updatedTaskFromDB : task
                )
            );
            
        } catch (error) {
            console.error("Erro ao concluir a tarefa:", error);
            alert('Erro ao atualizar o status da tarefa. Por favor, tente novamente.');
        }
    };


    // ✅ FUNÇÃO DE EXCLUIR (Corrigida e Assíncrona)
    const handleDeleteTask = async (taskId: number) => {
        try {
            // 1. Chama a Server Action para excluir a tarefa no BD
            // Assumimos que a Server Action retorna o ID da tarefa excluída
            const deletedId = await deleteTask(taskId);

            // 2. Atualiza o estado local, removendo a tarefa
            setTasks((prevTasks) => 
                prevTasks.filter((task) => task.id !== deletedId)
            );

        } catch (error) {
            console.error("Erro ao excluir a tarefa:", error);
            alert('Erro ao excluir a tarefa. Por favor, tente novamente.');
        }
    };
    
    return(
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Lista de Tarefas (Next/React)</h1>

        {/* ÁREA CORRIGIDA: Restore o input e o button */}
        <form onSubmit={handleAddTask}> 
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <input
                    type="text"
                    name="taskText" 
                    placeholder="Nova tarefa..."
                    style={{ padding: '10px', flexGrow: 1 }}
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button
                    type="submit" 
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Adicionar
                </button>
            </div>
        </form>

        {/* Área de Listagem de Tarefas (O restante do código da lista) */}
        <ul style={{ listStyle: 'none', padding:0 }}>
             {tasks.map((task) => ( 
                <li
                    key={task.id}
                    style={{
                        display:'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: "1px solid #eee"
                    }}
                >
            {/* Exibição do texto */}
            <span
                style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#fff' : '#fff',
                    flexGrow: 1,
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {task.completed && (
                    <span role="img" aria-label="Concluído">✅</span>
                )}
                {task.text}
            </span>
            
            {/* Ações (botões de concluir e Excluir) */}
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => handleToggleTask(task.id)}
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                >
                    {task.completed ? 'Desfazer' : 'Concluir'}
                </button>
                <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none' }}
                >
                    Excluir
                </button>
            </div>
        </li>
    ))}
    
    {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#fff' }}>Nenhuma tarefa adicionada ainda.</p>}
        </ul>
    </main>
    );
};