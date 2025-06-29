interface Props {
  nome: string;
  setNome: (nome: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  msg: string;
}

export default function JogadorForm({
  nome,
  setNome,
  onSubmit,
  loading,
  msg,
}: Props) {
  return (
    <section className="w-full max-w-[500px] md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Cadastrar Novo Jogador
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
  );
}
