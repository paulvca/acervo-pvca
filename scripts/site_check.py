"""Validate generated bilingual routes, assets and public boundaries."""
from argparse import ArgumentParser
from html.parser import HTMLParser
from pathlib import Path
import json
from urllib.parse import urlsplit, unquote, urljoin

parser = ArgumentParser()
parser.add_argument('--base', default='/')
args = parser.parse_args()
prefix = args.base.rstrip('/')

class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=set(); self.links=[]; self.assets=[]; self.lang=None; self.text=[]; self.skip=False
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='html': self.lang=attrs.get('lang')
  if 'id' in attrs: self.ids.add(attrs['id'])
  if tag=='a' and 'href' in attrs: self.links.append(attrs['href'])
  if tag in ('img','script') and 'src' in attrs: self.assets.append(attrs['src'])
  if tag=='link' and attrs.get('rel') in ('stylesheet','modulepreload'): self.assets.append(attrs['href'])
  if tag in ('script','style'): self.skip=True
 def handle_endtag(self,tag):
  if tag in ('script','style'): self.skip=False
 def handle_data(self,text):
  if not self.skip: self.text.append(text)

root=Path('dist'); pages={}
for file in root.rglob('*.html'):
 page=Page(); page.feed(file.read_text()); pages['/'+str(file.relative_to(root)).removesuffix('index.html')]=page
errors=[]; links=0; assets=0

def local_path(href,route):
 url=urlsplit(href)
 if url.scheme or url.netloc: return None, None
 target=unquote(urljoin(prefix+route,url.path))
 if prefix and not target.startswith(prefix+'/'):
  errors.append(f'{route}: URL outside deployment base: {href}')
  return None, None
 return target[len(prefix):] or '/', url.fragment

for route,page in pages.items():
 expected='en' if route.startswith('/en/') else 'pt-BR'
 if page.lang!=expected: errors.append(f'{route}: wrong language')
 if '/admin/' in route: errors.append('Admin route exposed')
 for phrase in ['Não há acesso público','Somente no acervo','Disponíveis no Internet Archive','Painel local']:
  if phrase in ''.join(page.text): errors.append(f'{route}: forbidden public text')
 for href in page.links:
  target,fragment=local_path(href,route)
  if target is None: continue
  if not target.endswith('/'): target+='/'
  if target not in pages: errors.append(f'{route}: broken link {href}')
  elif fragment and unquote(fragment) not in pages[target].ids: errors.append(f'{route}: missing anchor {href}')
  links+=1
 for href in page.assets:
  target,_=local_path(href,route)
  if target is not None:
   if not (root/target.lstrip('/')).is_file(): errors.append(f'{route}: missing asset {href}')
   assets+=1
 counterpart=route.removeprefix('/en') if route.startswith('/en/') else '/en'+route
 if counterpart not in pages: errors.append(f'{route}: missing translation counterpart')
assert not errors,errors
records=json.loads(Path('data/public/catalog.json').read_text()) or json.loads(Path('data/public/catalog.preview.json').read_text())
assert len(pages)==2*(len(records)+4),(len(pages),'unexpected route count')
print({'routes':len(pages),'internal_links':links,'assets':assets,'base':args.base,'errors':errors})
