import type { CountryStat, FilmSummary, SelectionSummary } from '../lib/types';

export const featuredFilm = {
  title: 'Napoléon',
  director: 'Abel Gance',
  year: 1927,
  country: 'França',
  note:
    'Uma das cópias que estou revisando com mais cuidado no momento. A restauração, a duração e o trabalho de legenda tornam este um dos filmes mais trabalhosos — e interessantes — dentro do acervo.',
  href: '/filmes/napoleon-1927/',
};

export const recentFilms: FilmSummary[] = [
  {
    title: 'The Blue Dahlia',
    director: 'George Marshall',
    year: 1946,
    status: 'Archive',
    href: '/filmes/the-blue-dahlia-1946/',
  },
  {
    title: 'The Letter',
    director: 'William Wyler',
    year: 1940,
    status: 'Archive',
    href: '/filmes/the-letter-1940/',
  },
  {
    title: 'The Friends',
    director: 'Shinji Sōmai',
    year: 1994,
    status: 'pt-BR',
    href: '/filmes/the-friends-1994/',
  },
  {
    title: 'Napoléon',
    director: 'Abel Gance',
    year: 1927,
    status: 'em revisão',
    href: '/filmes/napoleon-1927/',
  },
];

export const interestSelections: SelectionSummary[] = [
  {
    title: 'Japão depois da guerra',
    description: 'Ozu, Mizoguchi, Kurosawa, Naruse e outros',
    count: '18 filmes',
    href: '/selecoes/#japao-depois-da-guerra',
  },
  {
    title: 'Sidney Lumet',
    description: 'instituições, culpa e conflito moral',
    count: '11 filmes',
    href: '/selecoes/#sidney-lumet',
  },
  {
    title: 'Noir americano',
    description: 'crime, fatalismo e cidades noturnas',
    count: '24 filmes',
    href: '/selecoes/#noir-americano',
  },
];

export const copySelections: SelectionSummary[] = [
  {
    title: 'Com legendas em português',
    description: 'filmes com pt-BR comprovado no acervo',
    count: '81',
    href: '/selecoes/#legendas-em-portugues',
  },
  {
    title: 'Disponíveis no Internet Archive',
    description: 'cópias públicas já verificadas',
    count: '310',
    href: '/selecoes/#internet-archive',
  },
  {
    title: 'Em 4K',
    description: 'cópias principais em 2160p',
    count: '52',
    href: '/selecoes/#4k',
  },
];

export const countryStats: CountryStat[] = [
  { label: 'Cinema japonês', value: 84 },
  { label: 'Cinema francês', value: 62 },
  { label: 'Norte-americano', value: 58 },
  { label: 'Cinema italiano', value: 41 },
];

export const collectionStats = {
  films: 424,
  archive: 310,
  ptBr: 81,
  uhd: 52,
};
