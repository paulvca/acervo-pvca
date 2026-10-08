# Editorial selection review, 2026-10-08

All 26 selections were checked against the 526-film catalog. This is an editorial
revision, not a correction to work identities, production countries or copy facts.

The previous country-based expansion treated any co-production country as a
national-cinema membership. It mixed financing with cultural and cinematic context.
Manual national selections now retain deliberate editorial membership instead.

| Selection        | Before | After | Decision                                                              |
| ---------------- | -----: | ----: | --------------------------------------------------------------------- |
| French cinema    |     88 |    56 | Remove 32 works enrolled through co-production alone                  |
| Italian cinema   |     63 |    43 | Remove 20 works outside this curated Italian context                  |
| Japanese cinema  |    104 |   104 | Remove Affliction; add Song of Home                                   |
| Hong Kong cinema |     11 |     9 | Remove Princess Yang Kwei-fei and Farewell My Concubine               |
| Postwar Japan    |     32 |    30 | Remove Onibaba and A Legend, or Was It? (earlier historical settings) |
| John Ford        |     63 |    64 | Add We Sail at Midnight, including its co-director credit             |
| Kenji Mizoguchi  |     27 |    28 | Add Song of Home                                                      |

The other 19 lists remain unchanged. All nine director selections were reconciled
against exact direction credits. The 1950s list was checked against release years.
The five thematic lists and American noir were reviewed using the stored synopses;
no keyword classifier or automatic genre enrollment was added. The pt-BR and 4K
rules still describe the catalog copy, not every variant of a film.

## National-cinema decisions

- French cinema: exclude Italian works by Antonioni, Visconti and Fellini; Ran;
  Mulholland Drive and Papillon; works by Erice, Martel, Weerasethakul, Hou,
  Monteiro, Oliveira and Rocha where French participation previously drove the
  inclusion; The Son; the German adventure The Indian Tomb; the American-directed
  A View from the Bridge; Welles's Othello and Chimes at Midnight.
- Retain deliberate international French contexts such as Buñuel's French work,
  La Vie de Bohème, The Trial, Renoir's The River and The Golden Coach, and the
  Franco-Brazilian Black Orpheus. A curator can revise these choices without
  changing the film's production-country metadata. No claim of exclusive national
  ownership is made.
- Italian cinema: retain Italian creative traditions, including Antonioni's and
  Leone's work abroad; remove French films by Bresson, Renoir, Clément, Dréville,
  Godard and Truffaut, works by Cimino, Welles, Ratoff and Schrader outside the chosen Italian context, and
  the Argentine/Brazilian contexts previously enrolled through Italian financing.
  The Name of the Rose remains deliberately in both French and Italian contexts.
- Japanese cinema: Affliction's Japanese production participation is insufficient
  for this collection. Mishima remains deliberately, given its Japanese cast,
  language, subject and production context; director nationality alone is not used.
- Hong Kong cinema: retain the Hong Kong filmmakers' local body of work. The
  Mizoguchi Japanese film and Chen Kaige's mainland-Chinese historical film remain
  in the catalog, with their full production countries, outside this narrower list.
- Portuguese, Brazilian and Soviet selections were reviewed and retained.

These are contextual editorial decisions, not a replacement primary-country
algorithm. Neither the first country returned by TMDB nor the film's language is
used as an automatic national label.

## Supporting references

- [BFI: Ran](https://whatson.bfi.org.uk/Online/default.asp?BOparam%3A%3AWScontent%3A%3AloadArticle%3A%3Apermalink=ran-2026)
- [Yale Film Archive: The Scent of Green Papaya](https://web.library.yale.edu/sites/default/files/files/GreenPapayaNotes.pdf)
- [BFI: Farewell My Concubine programme notes](https://bfidatadigipres.github.io/too%20much%3Cbr%3Emelodrama%20on%20film/2025/11/02/farewell-my-concubine/)
- [Cannes: The Son](https://www.festival-cannes.com/en/f/le-fils/)
- [Criterion: Renoir's The River and The Golden Coach](https://films.criterionchannel.com/?director=renoir-jean)
- [BFI: Black Orpheus](https://www.bfi.org.uk/film/97aa6f4a-6107-5ef8-a09a-cf7217b65add/orfeu-negro)

## Regression safeguards

The site resolves manual selections only from `filmSlugs`. The admin picker follows
the same rule. Tests cover stale imported title memberships, translated titles,
duplicate/missing references, automatic-rule overrides, reviewed exclusion examples,
complete director/decade lists and public mirror consistency. Existing manual field
locks protect the synchronized selection projections in the private editor database.
