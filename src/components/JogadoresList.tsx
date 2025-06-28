interface Jogador {
  id: number;
  nome: string;
}

interface Props {
  jogadores: Jogador[];
}

export default function JogadoresList({ jogadores }: Props) {
  if (jogadores.length === 0) return <p>Nenhum jogador cadastrado ainda.</p>;

  return (
    <ul className="list-disc pl-5 space-y-1">
      {jogadores.map((jogador) => (
        <li key={jogador.id}>{jogador.nome}</li>
      ))}
    </ul>
  );
}
