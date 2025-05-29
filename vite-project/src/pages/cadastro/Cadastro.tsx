import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseconfig";

const Cadastro = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err: any) {
            console.error(err);
            switch (err.code) {
                case "auth/user-not-found":
                    setError("Usuário não encontrado.");
                    break;
                case "auth/invalid-credential":
                    setError("E-mail inexistente");
                    break;
                case "auth/email-already-in-use":
                    setError("E-mail já está em uso");
                    break;
                default:
                    setError("Erro inesperado");
            }
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
                    Cadastro
                </h2>
                {error && (
                    <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">
                        {error}
                    </div>
                )}
                <form onSubmit={handleCadastro} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        cadastrar
                    </button>

                </form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Ja possui uma conta?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Voltar
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Cadastro;
