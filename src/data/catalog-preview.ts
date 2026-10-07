export interface CatalogCopyInfo {
  id: string;
  label?: string;
  resolution?: string;
  sizeGiB?: number;
  audio?: string[];
  subtitles?: string[];
  edition?: string;
  format?: string;
}

export interface CatalogExternalLink {
  provider: 'Internet Archive' | 'Google Drive' | 'Outro';
  copyId?: string;
  url?: string;
}

export interface CatalogPreviewFilm {
  slug: string;
  title: string;
  originalTitle?: string;
  romanizedTitle?: string;
  director: string;
  year: number;
  country?: string;
  originalLanguages?: string[];
  runtimeMinutes?: number;
  genres?: string[];
  synopsis?: string;
  poster?: string;
  catalogCopyId?: string;
  searchable: string;
  collectionNote?: string;
  copies?: CatalogCopyInfo[];
  externalLinks?: CatalogExternalLink[];
  selections?: string[];
}

export const catalogPreview: CatalogPreviewFilm[] = [
  {
    slug: 'ikiru-1952',
    title: 'Ikiru',
    director: 'Akira Kurosawa',
    year: 1952,
    country: 'Japão',
    searchable: 'ikiru akira kurosawa 1952 japão',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        resolution: '1080p',
        audio: ['Japonês'],
        subtitles: ['Português (Brasil)', 'English'],
      },
    ],
    selections: [
      'Japão depois da guerra',
      'Cinema japonês',
      'Anos 1950',
    ],
  },
  {
    slug: 'tokyo-story-1953',
    title: 'Tokyo Story',
    originalTitle: '東京物語',
    romanizedTitle: 'Tōkyō monogatari',
    director: 'Yasujirō Ozu',
    year: 1953,
    country: 'Japão',
    runtimeMinutes: 136,
    genres: ['Drama'],
    synopsis:
      'Um casal idoso deixa Onomichi para visitar os filhos adultos em Tóquio. Ocupados com suas próprias vidas, eles têm pouco tempo para os pais; quem os acolhe com maior atenção é Noriko, a nora viúva.',
    searchable:
      'tokyo story 東京物語 tōkyō monogatari yasujirō ozu 1953 japão drama pt-br',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        subtitles: ['Português (Brasil)'],
      },
    ],
    selections: [
      'Japão depois da guerra',
      'Cinema japonês',
      'Anos 1950',
    ],
  },
  {
    slug: 'sansho-the-bailiff-1954',
    title: 'Sansho the Bailiff',
    director: 'Kenji Mizoguchi',
    year: 1954,
    searchable: 'sansho the bailiff kenji mizoguchi 1954 pt-br',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        subtitles: ['Português (Brasil)'],
      },
    ],
  },
  {
    slug: 'the-offence-1973',
    title: 'The Offence',
    director: 'Sidney Lumet',
    year: 1973,
    searchable: 'the offence sidney lumet 1973',
  },
  {
    slug: 'days-of-heaven-1978',
    title: 'Days of Heaven',
    director: 'Terrence Malick',
    year: 1978,
    searchable: 'days of heaven terrence malick 1978 2160p',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        resolution: '2160p',
      },
    ],
  },
  {
    slug: 'late-spring-1949',
    title: 'Late Spring',
    director: 'Yasujirō Ozu',
    year: 1949,
    searchable: 'late spring yasujirō ozu 1949 pt-br',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        subtitles: ['Português (Brasil)'],
      },
    ],
  },
  {
    slug: 'senso-1954',
    title: 'Senso',
    director: 'Luchino Visconti',
    year: 1954,
    searchable: 'senso luchino visconti 1954 2160p',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        resolution: '2160p',
      },
    ],
  },
  {
    slug: 'napoleon-1927',
    title: 'Napoléon',
    director: 'Abel Gance',
    year: 1927,
    country: 'França',
    searchable: 'napoléon napoleon abel gance 1927 frança',
    collectionNote:
      'Uma das cópias que estou revisando com mais cuidado no momento. A restauração, a duração e o trabalho de legenda tornam este um dos filmes mais trabalhosos — e interessantes — dentro do acervo.',
  },
  {
    slug: 'the-friends-1994',
    title: 'The Friends',
    director: 'Shinji Sōmai',
    year: 1994,
    searchable: 'the friends shinji sōmai somai 1994 pt-br',
    catalogCopyId: 'primary',
    copies: [
      {
        id: 'primary',
        subtitles: ['Português (Brasil)'],
      },
    ],
  },
  {
    slug: 'the-blue-dahlia-1946',
    title: 'The Blue Dahlia',
    director: 'George Marshall',
    year: 1946,
    searchable: 'the blue dahlia george marshall 1946',
  },
  {
    slug: 'the-letter-1940',
    title: 'The Letter',
    director: 'William Wyler',
    year: 1940,
    searchable: 'the letter william wyler 1940',
  },
];
