interface Dupla {
  jogador1: string;
  jogador2: string;
}

interface Etapa {
  numero: number;
  duplas: Dupla[];
}

interface Props {
  etapas: Etapa[];
}

export default function EtapasList({ etapas }: Props) {
  return (
    <div className="space-y-4">
      {etapas.map((etapa) => (
        <div key={etapa.numero} className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Etapa {etapa.numero}</h2>
          <ul className="list-disc pl-5">
            {etapa.duplas.map((dupla, i) => (
              <li key={i}>
                {dupla.jogador1} & {dupla.jogador2}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
