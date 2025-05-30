import { useEffect, useState } from "react";
import { db } from "../../services/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseconfig";
import { LogOut } from "lucide-react";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { Plus, Trash2, CheckCircle } from "lucide-react";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const todosCollection = collection(db, "todos");

    // Carregar tarefas do Firebase
    const loadTodos = async () => {
        const data = await getDocs(todosCollection);
        const todosList = data.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Todo, "id">),
        }));
        setTodos(todosList);
    };

    useEffect(() => {
        loadTodos();
    }, []);

    // Adicionar tarefa
    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const docRef = await addDoc(todosCollection, {
            text: input,
            completed: false,
        });

        setTodos([...todos, { id: docRef.id, text: input, completed: false }]);
        setInput("");
    };

    // Deletar tarefa
    const deleteTodo = async (id: string) => {
        await deleteDoc(doc(db, "todos", id));
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Alternar concluído
    const toggleComplete = async (id: string, completed: boolean) => {
        const todoDoc = doc(db, "todos", id);
        await updateDoc(todoDoc, { completed: !completed });

        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !completed } : todo
            )
        );
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
            <button
                onClick={handleLogout}
                className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:cursor-pointer transition"
            >
                <LogOut size={20} />
                Sair
            </button>
            <div className="w-full max-w-md p-6 rounded-2xl bg-slate-950 shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center">📋 Já organizou seus deveres hoje? 😃</h1>

                <form onSubmit={addTodo} className="flex mb-4 gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Adicionar tarefa..."
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer px-4 py-2 rounded-lg flex items-center justify-center"
                    >
                        <Plus size={20} />
                    </button>
                </form>

                <ul className="space-y-3">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg ${todo.completed
                                    ? "bg-slate-700 line-through opacity-60"
                                    : "bg-slate-800"
                                }`}
                        >
                            <span>{todo.text}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleComplete(todo.id, todo.completed)}
                                    className={`${todo.completed
                                            ? "text-green-400 hover:text-green-500"
                                            : "text-slate-400 hover:text-slate-200"
                                        }`}
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-red-400 hover:text-red-500"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
