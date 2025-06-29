"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Jogador = {
  id: number;
  nome: string;
};

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");

  async function fetchJogadores() {
    const { data, error } = await supabase
      .from("jogadores")
      .select("id, nome")
      .order("nome", { ascending: true });

    if (error) {
      setMsg(`Erro ao carregar jogadores: ${error.message}`);
    } else {
      setJogadores(data || []);
      setMsg("");
    }
  }

  useEffect(() => {
    fetchJogadores();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.from("jogadores").insert([{ nome }]);

    setLoading(false);

    if (error) {
      setMsg(`Erro: ${error.message}`);
    } else {
      setMsg("Jogador cadastrado com sucesso!");
      setNome("");
      fetchJogadores();
    }
  }

  function startEdit(jogador: Jogador) {
    setEditId(jogador.id);
    setEditNome(jogador.nome);
    setMsg("");
  }

  function cancelEdit() {
    setEditId(null);
    setEditNome("");
    setMsg("");
  }

  async function saveEdit(id: number) {
    if (!editNome.trim()) {
      setMsg("Nome não pode ser vazio");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("jogadores")
      .update({ nome: editNome.trim() })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setMsg(`Erro ao atualizar: ${error.message}`);
    } else {
      setMsg("Jogador atualizado com sucesso!");
      setEditId(null);
      setEditNome("");
      fetchJogadores();
    }
  }

  async function deleteJogador(id: number) {
    if (!confirm("Tem certeza que deseja deletar este jogador?")) return;

    setLoading(true);
    const { error } = await supabase.from("jogadores").delete().eq("id", id);
    setLoading(false);

    if (error) {
      setMsg(`Erro ao deletar: ${error.message}`);
    } else {
      setMsg("Jogador deletado com sucesso!");
      fetchJogadores();
    }
  }

  // Gera CSV a partir do array jogadores
  function gerarCSV(jogadores: Jogador[]) {
    const headers = ["id", "nome"];
    const linhas = jogadores.map((j) => [
      j.id.toString(),
      `"${j.nome.replace(/"/g, '""')}"`
    ]);

    return [headers, ...linhas]
      .map((linha) => linha.join(","))
      .join("\r\n");
  }

  // Dispara download do CSV
  function downloadCSV() {
    const csv = gerarCSV(jogadores);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "jogadores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="w-full mx-auto p-6 flex flex-col justify-between gap-10 md:flex-row">
      <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />
      {/* Lista numerada e editável */}
      <section className="w-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-6 overflow-auto max-h-[600px]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex justify-between items-center">
          Jogadores Cadastrados
          <button
            onClick={downloadCSV}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition"
            title="Exportar lista como CSV"
          >
            Exportar CSV
          </button>
        </h2>
        {jogadores.length === 0 ? (
          <p className="text-gray-500">Nenhum jogador cadastrado.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-2">
            {jogadores.map((j, i) => (
              <li
                key={j.id}
                className="flex items-center gap-3 bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition border"
              >
                {editId === j.id ? (
                  <>
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      className="flex-grow border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(j.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded-md transition"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={loading}
                      className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-3 py-1 rounded-md transition"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow text-gray-900 font-medium">
                      {i + 1}. {j.nome}
                    </span>
                    <button
                      onClick={() => startEdit(j)}
                      className="bg-blue-600 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteJogador(j.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                    >
                      Deletar
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Formulário de cadastro */}
      <section className="w-full max-w-[500px] h-1/2 md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Cadastrar Novo Jogador
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Nome do jogador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        {msg && (
          <p
            className={`mt-4 text-center font-medium ${
              msg.startsWith("Erro") ? "text-red-600" : "text-green-600"
            }`}
          >
            {msg}
          </p>
        )}
      </section>
    </main>
  );
}
