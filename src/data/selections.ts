export interface SelectionPreview {
  id: string;
  title: string;
  description: string;
  count: string;
}

export const selections: SelectionPreview[] = [
  {
    id: 'japao-depois-da-guerra',
    title: 'Japão depois da guerra',
    description:
      'Família, trabalho, deslocamento e mudança social entre o fim dos anos 1940 e os anos 1960.',
    count: '18 filmes',
  },
  {
    id: 'sidney-lumet',
    title: 'Sidney Lumet',
    description: 'Instituições, culpa, responsabilidade e conflito moral.',
    count: '11 filmes',
  },
  {
    id: 'noir-americano',
    title: 'Noir americano',
    description:
      'Crime, fatalismo, luzes noturnas e personagens encurralados.',
    count: '24 filmes',
  },
  {
    id: 'legendas-em-portugues',
    title: 'Com legendas em português',
    description:
      'Filmes com uma faixa pt-BR comprovada em pelo menos uma cópia inspecionada.',
    count: '81 filmes',
  },
  {
    id: 'internet-archive',
    title: 'Disponíveis no Internet Archive',
    description: 'Cópias públicas já verificadas no Internet Archive.',
    count: '310 filmes',
  },
  {
    id: '4k',
    title: 'Em 4K',
    description: 'Cópias principais em 2160p.',
    count: '52 filmes',
  },
];
