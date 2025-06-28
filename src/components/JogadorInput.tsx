import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onAdd: (nome: string) => void;
}

export default function JogadorInput({ onAdd }: Props) {
  const [nome, setNome] = useState('');

  const adicionar = () => {
    if (nome.trim()) {
      onAdd(nome.trim());
      setNome('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Nome do jogador"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <Button onClick={adicionar}>Adicionar</Button>
    </div>
  );
}
