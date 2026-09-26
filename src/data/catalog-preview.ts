export interface CatalogCopyInfo {
  video?: string;
  audio?: string[];
  subtitles?: string[];
  availability?: string;
}

export interface CatalogPreviewFilm {
  slug: string;
  title: string;
  originalTitle?: string;
  director: string;
  year: number;
  country?: string;
  availability: string;
  searchable: string;
  note?: string;
  copy?: CatalogCopyInfo;
  selections?: string[];
}

export const catalogPreview: CatalogPreviewFilm[] = [
  {
    slug: 'ikiru-1952',
    title: 'Ikiru',
    director: 'Akira Kurosawa',
    year: 1952,
    country: 'Japão',
    availability: 'Archive',
    searchable: 'ikiru akira kurosawa 1952 japão archive',
    note:
      'Um pequeno espaço para contexto pessoal sobre o filme, a cópia ou o motivo de ele aparecer no acervo.',
    copy: {
      video: '1080p',
      audio: ['Japonês'],
      subtitles: ['Português (Brasil)', 'English'],
      availability: 'Internet Archive',
    },
    selections: [
      'Japão depois da guerra',
      'Cinema japonês',
      'Anos 1950',
    ],
  },
  {
    slug: 'tokyo-story-1953',
    title: 'Tokyo Story',
    director: 'Yasujirō Ozu',
    year: 1953,
    availability: 'pt-BR',
    searchable: 'tokyo story yasujirō ozu 1953 pt-br',
  },
  {
    slug: 'sansho-the-bailiff-1954',
    title: 'Sansho the Bailiff',
    director: 'Kenji Mizoguchi',
    year: 1954,
    availability: 'pt-BR',
    searchable: 'sansho the bailiff kenji mizoguchi 1954 pt-br',
  },
  {
    slug: 'the-offence-1973',
    title: 'The Offence',
    director: 'Sidney Lumet',
    year: 1973,
    availability: 'Archive',
    searchable: 'the offence sidney lumet 1973 archive',
  },
  {
    slug: 'days-of-heaven-1978',
    title: 'Days of Heaven',
    director: 'Terrence Malick',
    year: 1978,
    availability: '2160p',
    searchable: 'days of heaven terrence malick 1978 2160p',
  },
  {
    slug: 'late-spring-1949',
    title: 'Late Spring',
    director: 'Yasujirō Ozu',
    year: 1949,
    availability: 'pt-BR',
    searchable: 'late spring yasujirō ozu 1949 pt-br',
  },
  {
    slug: 'senso-1954',
    title: 'Senso',
    director: 'Luchino Visconti',
    year: 1954,
    availability: '2160p',
    searchable: 'senso luchino visconti 1954 2160p',
  },
  {
    slug: 'napoleon-1927',
    title: 'Napoléon',
    director: 'Abel Gance',
    year: 1927,
    country: 'França',
    availability: 'em revisão',
    searchable: 'napoléon napoleon abel gance 1927 frança em revisão',
    note:
      'Uma das cópias que estou revisando com mais cuidado no momento. A restauração, a duração e o trabalho de legenda tornam este um dos filmes mais trabalhosos — e interessantes — dentro do acervo.',
  },
  {
    slug: 'the-friends-1994',
    title: 'The Friends',
    director: 'Shinji Sōmai',
    year: 1994,
    availability: 'pt-BR',
    searchable: 'the friends shinji sōmai somai 1994 pt-br',
  },
  {
    slug: 'the-blue-dahlia-1946',
    title: 'The Blue Dahlia',
    director: 'George Marshall',
    year: 1946,
    availability: 'Archive',
    searchable: 'the blue dahlia george marshall 1946 archive',
  },
  {
    slug: 'the-letter-1940',
    title: 'The Letter',
    director: 'William Wyler',
    year: 1940,
    availability: 'Archive',
    searchable: 'the letter william wyler 1940 archive',
  },
];
