import TaskClient from "./components/taskclient";
import { getTasks } from "./features/tasks/server/get-tasks";
import { Tasks } from "./generated/prisma/client";

export default async function ToDoList() {
    // 1. Chama a Server Action para buscar os dados diretamente do banco
    const initialTasks: Tasks[] = await getTasks(); 

    // 2. Renderiza o componente cliente, passando as tarefas como prop
    return <TaskClient initialTasks={initialTasks} />;
}