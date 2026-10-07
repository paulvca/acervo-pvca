import {catalogPreview} from './catalog-preview';
export const featuredFilm = catalogPreview.find(film => film.slug === 'napoleon-1927')!;
const recentSlugs = ['the-blue-dahlia-1946', 'the-letter-1940', 'the-friends-1994', 'napoleon-1927'];
export const recentFilms = recentSlugs.map(slug => catalogPreview.find(film => film.slug === slug)!);
