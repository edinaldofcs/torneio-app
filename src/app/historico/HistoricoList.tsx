import { Historico } from "@/lib/useHistorico";

interface Props {
  confrontos: Historico[];
}

export default function HistoricoList({ confrontos }: Props) {
  return (
    <section className="mt-2 min-w-[700px] w-[50%] border border-gray-300 rounded-lg p-2 shadow-lg bg-white">
      <ul>
        {confrontos.map((item) => (
          <li
            key={item.id}
            className="p-[4px] border-b flex items-center gap-2"
          >
            <span className="font-semibold text-gray-900 flex-1 text-right">
              {item.jogador1.nome}
            </span>
            <span className="font-bold text-lg text-indigo-600 px-2 text-center w-[30px]">
              &
            </span>
            <span className="font-semibold text-gray-900 flex-1 text-left">
              {item.jogador2.nome}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
