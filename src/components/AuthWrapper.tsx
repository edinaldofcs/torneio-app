"use client";

import { useState, useEffect } from "react";

const SENHA_CORRETA = process.env.NEXT_PUBLIC_APP_PASSWORD;

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");

  // Ao carregar, verifica se está autenticado na sessão
  useEffect(() => {
    const auth = sessionStorage.getItem("autenticado");
    if (auth === "true") {
      setAutenticado(true);
    }
  }, []);

  const handleLogin = () => {
    if (senha === SENHA_CORRETA) {
      setAutenticado(true);
      sessionStorage.setItem("autenticado", "true"); // salva o estado na sessão
    } else {
      alert("Senha incorreta");
    }
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center -z-2" />
        <div className="bg-black p-6 rounded-xl shadow-xl w-full max-w-sm border-4 border-gray-400">
          <h1 className="text-xl font-semibold mb-4 text-center text-white">
            Controle de Acesso – Informe sua senha
          </h1>
          <input
            type="password"
            placeholder="Digite a senha"
            className="w-full p-2 border border-gray-300 rounded mb-4 text-white"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={handleLogin}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
