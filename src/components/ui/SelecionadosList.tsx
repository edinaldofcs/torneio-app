// components/ui/SelecionadosList.tsx
import React from "react";

interface Jogador {
  id: number;
  nome: string;
}

interface SelecionadosListProps {
  selecionados: Jogador[];
  onRemover: (jogador: Jogador) => void;
}

export function SelecionadosList({ selecionados, onRemover }: SelecionadosListProps) {
  return (
    <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh] text-black">
      <h2 className="text-lg font-semibold mb-4">Selecionados</h2>
      {selecionados.length === 0 ? (
        <p className="text-gray-500">Nenhum selecionado.</p>
      ) : (
        <ul className="space-y-2">
          {selecionados.map((j, i) => (
            <li key={j.id} className="flex items-center justify-between">
              <span>
                {i + 1}. {j.nome}
              </span>
              <button
                onClick={() => onRemover(j)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
