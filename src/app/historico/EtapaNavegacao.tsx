interface Props {
  etapaAtualIndex: number;
  totalEtapas: number;
  setEtapaAtualIndex: (index: number) => void;
}

export default function EtapaNavegacao({
  etapaAtualIndex,
  totalEtapas,
  setEtapaAtualIndex,
}: Props) {
  return (
    <nav className="flex justify-center flex-wrap gap-4 mt-6 max-w-[700px] bg-white p-2 rounded shadow">
      <button
        onClick={() => setEtapaAtualIndex(0)}
        disabled={etapaAtualIndex === 0}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
      >
        Primeira
      </button>

      <button
        onClick={() => setEtapaAtualIndex(Math.max(etapaAtualIndex - 1, 0))}
        disabled={etapaAtualIndex === 0}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
      >
        Anterior
      </button>

      <span className="flex items-center font-semibold text-gray-700">
        Etapa {etapaAtualIndex + 1} de {totalEtapas}
      </span>

      <button
        onClick={() =>
          setEtapaAtualIndex(Math.min(etapaAtualIndex + 1, totalEtapas - 1))
        }
        disabled={etapaAtualIndex === totalEtapas - 1}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
      >
        Próximo
      </button>

      <button
        onClick={() => setEtapaAtualIndex(totalEtapas - 1)}
        disabled={etapaAtualIndex === totalEtapas - 1}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
      >
        Última
      </button>
    </nav>
  );
}
