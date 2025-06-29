// components/ui/CadastroList.tsx
import React from "react";

interface Jogador {
  id: number;
  nome: string;
}

interface CadastroListProps {
  cadastrados: Jogador[];
  selecionados: Jogador[];
  onAdicionar: (jogador: Jogador, ctrlKey: boolean) => void;
}

export function CadastroList({ cadastrados, selecionados, onAdicionar }: CadastroListProps) {
  return (
    <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh] text-black">
      <h2 className="text-lg font-semibold mb-4">Cadastrados</h2>
      <ul className="space-y-2">
        {cadastrados.map((j) => {
          const selecionado = selecionados.some((s) => s.id === j.id);
          return (
            <li key={j.id} className="flex items-center justify-between">
              <span>{j.nome}</span>
              <button
                onClick={(e) => onAdicionar(j, e.ctrlKey)}
                disabled={selecionado}
                className={`px-2 py-1 rounded text-sm text-white transition ${
                  selecionado ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {selecionado ? "Adicionado" : "Adicionar"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
