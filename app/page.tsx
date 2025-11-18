'use client';

import React, { useState } from 'react';

// O componente principal da nossa ToDo List
export default function ToDoList() {

    // 1. CORREÇÃO: Nomeando o estado principal como 'tasks' (plural)
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');

    // Função para Adicionar Tarefa
    const handleAddTask = () => {
        if (newTaskText.trim() === '') {
            alert('Por favor, digite o nome da tarefa.');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: newTaskText,
            completed: false,
        };

        // 2. CORREÇÃO: Sintaxe correta para adicionar o novo item ao array
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskText('');
    };

    // 3. IMPLEMENTAÇÃO: Marcar/Desmarcar como Concluído (APENAS LÓGICA DE DADOS)
    const handleToggleTask = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                // APENAS RETORNA o NOVO OBJETO com o status invertido
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        // Atualiza o estado
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (taskId) => {
        // Implementaremos no próximo passo
        const remainingTasks = tasks.filter((task) => task.id !== taskId);

        setTasks(remainingTasks);
    };

    return(
        <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Lista de Tarefas (Next/React)</h1>

            {/* Área de Criação de Tarefa */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="Nova tarefa..."
                    style={{ padding: '10px', flexGrow: 1 }}
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button
                    onClick={handleAddTask}
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Adicionar
                </button>
            </div>

            {/* Área de Listagem de Tarefas */}
            <ul style={{ listStyle: 'none', padding:0 }}>
                {tasks.map((task) => ( // 4. CORREÇÃO: Usando o .map() corretamente
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
                                color: task.completed ? '#aaa' : '#000',
                                flexGrow: 1,
                                marginRight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {task.completed && (
                                <span role="img" aria-label="Concluído">
                                    ✅
                                </span>
                            )}
                            {task.text}
                        </span>
                        {/* Ações (botões de concluir e Excluir) */}
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                                onClick={() => handleToggleTask(task.id)}
                                style={{ padding: '5px 10px', cursor: 'pointer' }}
                            >
                                {/* Lógica Condicional para o Botão */}
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
                
                {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#555' }}>Nenhuma tarefa adicionada ainda.</p>}
            </ul>
        </main>
    );
};