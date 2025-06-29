// components/ui/DuplasList.tsx
import React from "react";

interface Jogador {
  id: number;
  nome: string;
}

interface Dupla {
  jogador1: Jogador;
  jogador2: Jogador;
}

interface DuplasListProps {
  duplas: Dupla[];
}

export function DuplasList({ duplas }: DuplasListProps) {
  return (
    <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh] text-black">
      <h2 className="text-lg font-semibold mb-4">Duplas Sorteadas</h2>
      {duplas.length === 0 ? (
        <p className="text-gray-500">Nenhuma dupla sorteada ainda.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-1">
          {duplas.map((d, idx) => (
            <li key={idx}>
              {d.jogador1.nome} &amp; {d.jogador2.nome}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
