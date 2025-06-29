// components/ui/Acoes.tsx
import React from "react";

interface AcoesProps {
  etapaAtual: number;
  duplasCount: number;
  onSortear: () => void;
  onGravar: () => void;
}

export function Acoes({ etapaAtual, duplasCount, onSortear, onGravar }: AcoesProps) {
  return (
    <section className="flex flex-col justify-between h-1/2 text-black">
      <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-4">Ação</h2>
          <p className="text-gray-600 mb-6">Etapa atual: {etapaAtual}</p>
          <button
            onClick={onSortear}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded mb-4"
          >
            Sortear Duplas
          </button>
          <button
            onClick={onGravar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded"
            disabled={duplasCount === 0}
          >
            Gravar Histórico
          </button>
        </div>
       
      </div>
    </section>
  );
}
