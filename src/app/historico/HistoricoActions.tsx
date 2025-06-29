interface Props {
  onExport: () => void;
  onClear: () => void;
}

export default function HistoricoActions({ onExport, onClear }: Props) {
  return (
    <div className="w-full flex justify-end mt-2 gap-2">
      <button
        onClick={onExport}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Exportar CSV
      </button>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Limpar Histórico
      </button>
    </div>
  );
}
