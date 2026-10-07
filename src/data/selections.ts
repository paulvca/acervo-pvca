import {catalogPreview} from './catalog-preview';
import {catalogCopy, hasPtBr} from '../lib/catalog';
const definitions = [
  {id: 'japao-depois-da-guerra', title: 'Japão depois da guerra', description: 'Família, trabalho, deslocamento e mudança social entre o fim dos anos 1940 e os anos 1960.'},
  {id: 'sidney-lumet', title: 'Sidney Lumet', description: 'Instituições, culpa, responsabilidade e conflito moral.'},
  {id: 'noir-americano', title: 'Noir americano', description: 'Crime, fatalismo, luzes noturnas e personagens encurralados.'},
  {id: 'legendas-em-portugues', title: 'Com legendas em português', description: 'Filmes com legendas em Português (Brasil) na cópia selecionada.'},
  {id: '4k', title: 'Em 4K', description: 'Filmes com uma cópia selecionada em 2160p.'},
  {id: 'cinema-japones', title: 'Cinema japonês', description: 'Um percurso pelos filmes japoneses desta prévia.'},
  {id: 'anos-1950', title: 'Anos 1950', description: 'Retratos de um período de transição, dentro e fora do cinema.'},
];
export const selections = definitions.map(selection => ({...selection, films: catalogPreview.filter(film => {
  if (selection.id === 'legendas-em-portugues') return hasPtBr(film);
  if (selection.id === '4k') return catalogCopy(film)?.resolution === '2160p';
  if (selection.id === 'sidney-lumet') return film.director === 'Sidney Lumet';
  return film.selections?.includes(selection.title);
})}));
