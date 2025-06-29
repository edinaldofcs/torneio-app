import { Jogador } from "@/lib/useJogadores";

interface Props {
  jogadores: Jogador[];
  editId: number | null;
  editNome: string;
  setEditNome: (nome: string) => void;
  startEdit: (j: Jogador) => void;
  cancelEdit: () => void;
  saveEdit: (id: number) => void;
  deleteJogador: (id: number) => void;
  downloadCSV: () => void;
  loading: boolean;
}

export default function JogadorLista({
  jogadores,
  editId,
  editNome,
  setEditNome,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteJogador,
  downloadCSV,
  loading,
}: Props) {
  return (
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
  );
}
