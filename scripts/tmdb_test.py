"""Deterministic TMDB adapter tests; no network or real catalog writes."""
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import tmdb_bridge as bridge

class AdapterTests(unittest.TestCase):
    def test_original_language_poster_precedes_neutral_and_english(self):
        images=[{'file_path':'/en.jpg','iso_639_1':'en','aspect_ratio':.66,'width':1000,'vote_count':100},
                {'file_path':'/ja.jpg','iso_639_1':'ja','aspect_ratio':.66,'width':500,'vote_count':1},
                {'file_path':'/neutral.jpg','iso_639_1':None,'aspect_ratio':.66,'width':800,'vote_count':10}]
        self.assertEqual(bridge.select_poster(images,'ja')['file_path'],'/ja.jpg')
        self.assertEqual(bridge.select_poster(images,'fr')['file_path'],'/neutral.jpg')
        self.assertIsNone(bridge.select_poster([{'file_path':'/backdrop.jpg','iso_639_1':'ja','aspect_ratio':1.8,'width':1000}],'ja'))

    def test_two_official_locales_and_public_metadata_are_cached_locally(self):
        requests=[]
        base={'id':42,'original_title':'Original','original_language':'ja','release_date':'1953-11-03','runtime':136,'production_countries':[{'iso_3166_1':'JP','name':'Japan'}],'genres':[{'id':18,'name':'Drama'}]}
        pt={**base,'title':'Título oficial','overview':'Sinopse oficial em português','credits':{'crew':[{'id':77,'name':'Test Director','job':'Director'}]},'external_ids':{'imdb_id':'tt12345'}}
        en={**base,'title':'Official title','overview':'Official English synopsis'}
        class Opener:
            def open(self,request,timeout):
                requests.append(request)
                url=request.full_url
                if 'image.tmdb.org' in url:return io.BytesIO(b'\xff\xd8synthetic jpeg test fixture')
                if '/configuration' in url:result={'images':{'secure_base_url':'https://image.tmdb.org/t/p/','poster_sizes':['w500']}}
                elif '/images' in url:result={'posters':[{'file_path':'/fixture.jpg','iso_639_1':'ja','aspect_ratio':.66,'width':500}]}
                else:result=pt if 'pt-BR' in url else en
                return io.BytesIO(json.dumps(result).encode())
        with tempfile.TemporaryDirectory() as temp,patch.object(bridge,'credential',return_value='SYNTHETIC_TEST_ONLY'),patch.object(bridge.urllib.request,'build_opener',return_value=Opener()):
            result=bridge.enrich(42,temp)
            self.assertEqual(result['translations']['pt-BR']['synopsis'],pt['overview'])
            self.assertEqual(result['translations']['en']['synopsis'],en['overview'])
            self.assertEqual(result['entity_refs']['directors'][0]['id'],'tmdb-77')
            self.assertTrue((Path(temp)/'public'/result['poster'].lstrip('/')).exists())
            self.assertNotIn('copies',result)
            self.assertNotIn('SYNTHETIC_TEST_ONLY',json.dumps(result))
            self.assertTrue(any('language=pt-BR' in req.full_url for req in requests))
            self.assertTrue(any('language=en-US' in req.full_url for req in requests))
            for req in requests:
                self.assertNotIn('SYNTHETIC_TEST_ONLY',req.full_url)
                if 'image.tmdb.org' in req.full_url:self.assertIsNone(req.get_header('Authorization'))

    def test_search_checks_release_year_and_returns_director_evidence(self):
        requests=[]
        class Opener:
            def open(self,request,timeout):
                requests.append(request.full_url)
                if '/search/movie' in request.full_url:
                    data={'results':[{'id':42,'title':'Film','original_title':'Original','release_date':'1971-01-01'},{'id':99,'title':'Remake','release_date':'2000-01-01'}]}
                else:data={'crew':[{'name':'Director','job':'Director'},{'name':'Producer','job':'Producer'}]}
                return io.BytesIO(json.dumps(data).encode())
        with patch.object(bridge,'credential',return_value='SYNTHETIC_TEST_ONLY'),patch.object(bridge.urllib.request,'build_opener',return_value=Opener()):
            results=bridge.search_movies('Film',1971)
        self.assertEqual(len(results),1)
        self.assertEqual(results[0]['directors'],['Director'])
        self.assertTrue(any('/movie/42/credits' in url for url in requests))
        self.assertFalse(any('/movie/99/credits' in url for url in requests))

if __name__=='__main__':unittest.main()
