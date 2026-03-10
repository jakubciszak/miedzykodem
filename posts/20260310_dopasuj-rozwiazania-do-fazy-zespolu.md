# Dopasuj rozwiązania do fazy rozwoju zespołu

tagi: "Bruce Tuckman", "Matthew Skelton", "Manuel Pais", "Fred Brooks", "Melvin Conway", "Nagappan", "kultura zespołu", "cykl życia zespołu", "dynamika zespołu", "przegląd kodu", "dług techniczny", "architektura", "kolekcja klasyki", "inżynieria oprogramowania", "organizacja zespołów", "psychologia zespołu"


Czasem trudno zidentyfikować problem w projekcie. Na pierwszy rzut oka winowajcą jest kod i zaciągnięty dług — przegląd kodu przestał działać, komentarze są albo zbyt ostre, albo zbyt grzeczne, decyzje architektoniczne zapadają w kuluarach zamiast na tablicy, ktoś przepisuje moduł, który ktoś inny właśnie skończył. Dokładasz procesy, narzędzia, ceremonie; nic nie pomaga.

Problem może być gdzie indziej.

## Developmental Sequence in Small Groups

Bruce Tuckman opisał to w 1965 roku w artykule [*"Developmental Sequence in Small Groups"*](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Dynamics/Tuckman_1965_Developmental_sequence_in_small_groups.pdf) — fazy rozwoju zespołów – forming, storming, norming, performing. Model powstał na podstawie pięćdziesięciu badań nad małymi grupami, głównie terapeutycznych i laboratoryjnych, nie zespołów scrumowych, nie zespołów produktowych, nie jednostek w skalowanym Agile. Jest opisowy, nie przepisujący — Tuckman nie mówił jak przez te fazy przejść, mówił że grupy przez nie przechodzą.

Czytając te badania, zacząłem zastanawiać się, jak znajomość tych faz może zmienić sposób, w jaki diagnozujemy problemy w kodzie i dobieramy do nich narzędzia.

---

## Storming wygląda jak problem techniczny

Drugie, poważniejsze odkrycie z badań Tuckmana: tylko połowa grup wykazała wyraźną fazę storming. Reszta albo ją pomijała, albo zamiatała pod dywan — co nie oznaczało, że konfliktu nie było, oznaczało, że nie był na tyle bezpieczny, żeby się ujawnić.

W IT storming rzadko wygląda jak otwarty konflikt. Wygląda jak nieskończone dyskusje o wyborze biblioteki. Jak pull requesty, które wiszą tygodniami bez recenzji. Jak "tymczasowe" rozwiązania, które nikt nie chce ruszać, bo nie wiadomo czyje są. Jak decyzje architektoniczne, które zapadają nie na podstawie argumentów, ale na podstawie tego kto ma więcej autorytetu w pokoju.

Jeśli widzisz te symptomy w kodzie — zanim zaczniesz szukać rozwiązania technicznego, zastanów się, w której fazie jest Twój zespół.

---

## Każda zmiana personalna resetuje zegar!

Model Tuckmana nie jest liniowy. Każda znacząca zmiana — nowy członek, odejście kluczowej osoby, scalenie dwóch zespołów, zmiana tech leada — resetuje dynamikę grupy z powrotem do forming. Nie o jedną fazę wstecz. Do początku.

Brooks poniekąd wyjaśnił mechanikę tego zjawiska w 1975 roku w [*The Mythical Man-Month*](https://www.oreilly.com/library/view/mythical-man-month-the/0201835959/): przy pięciu osobach masz dziesięć par komunikacyjnych, przy dziesięciu — czterdzieści pięć. Każdy nowy człowiek to nowe kanały do zbudowania, nowy kontekst do przekazania, nowa dynamika do wypracowania.

To ma bezpośrednie przełożenie na to, co widzisz w kodzie po dołączeniu nowej osoby do zespołu. Nagle pojawiają się pull requesty, które łamią ustalone konwencje — nie ze złej woli, ale dlatego że nowa osoba nie zna kontekstu, który reszta ma w głowie. Nagle wracają dyskusje, które zespół miał już rozstrzygnięte. Nagle ADR-y, które leżały spokojnie w repozytorium, okazują się niewystarczające, bo opisują *co* zdecydowano, ale nie *dlaczego*.

---

## Team Topologies daje strukturę, Tuckman daje kontekst

Skelton i Pais w [*Team Topologies*](https://itrevolution.com/product/team-topologies/) traktują obciążenie kognitywne jako pierwsze ograniczenie projektowania organizacji. Cztery typy zespołów i trzy tryby interakcji dają precyzyjny język do opisywania granic — kto jest stream-aligned team, kto jest zespołem platformowym, kiedy zespoły powinny współpracować, a kiedy działać przez interfejs usługowy.

To bardzo użyteczny język. Ale *Team Topologies* nie powie ci, co robić, gdy Twój stream-aligned team jest w burzliwej faxie storming i doświadczony programista blokuje każdą decyzję, bo czuje, że traci wpływ po reorganizacji. Model jest mocny na projektowaniu struktury, milczy na temat dynamiki ludzi wewnątrz tej struktury.

Tuckman z kolei opisuje dynamikę — ale nie mówi nic o tym, jak strategia pracy z kodem powinna się zmieniać w zależności od fazy.

Pozwoliłem sobie na zbiorczą reinterpretację obu tych narzędzi i doszedłem do wniosku, że dopiero ich połączenie może dać coś naprawdę użytecznego: język do diagnozowania tego, co widzisz w projekcie, i praktyki dopasowane do etapu, na którym zespół faktycznie jest — nie do tego, na którym chciałbyś żeby był.

---

## Co faza zespołu mówi o tym, jak pracować z kodem
### Moja analiza wyciągniętą z doświadczenia, w zderzeniu z teorią o zespołach.

**Forming**

Nowy kontekst, brak wspólnych konwencji, każdy ma inne przyzwyczajenia z poprzednich miejsc. Przegląd kodu w tej fazie jest drogi — bo każdy komentarz wymaga wyjaśnienia założeń, które w dojrzałym zespole są oczywiste.

Praktyki, które tutaj pomagają: zasady przeglądu kodu zapisane jawnie, nie przekazywane ustnie — bo ustna tradycja nie istnieje, gdy zespół ma dwa tygodnie. ADR-y dokumentujące nie tylko decyzje, ale ich uzasadnienie — bo "dlaczego" jest ważniejsze niż "co", gdy ktoś właśnie dołączył. Programowanie w parach jako najszybszy mechanizm przekazywania kontekstu: godzina wspólnego kodowania zastępuje tygodnie dokumentacji, której nikt nie czyta. Linting i formatowanie zautomatyzowane — żeby przegląd kodu nie zużywał energii na spacje i przecinki zamiast na architekturę.

**Storming**

Najniebezpieczniejsza faza z perspektywy jakości kodu. Konflikty personalne i techniczne nakładają się i trudno je rozdzielić — "nie zgadzam się z tym podejściem do walidacji" może być uzasadnionym sporem technicznym, może też być przykrywką dla "nie akceptuję tego, że nowy tech lead ma więcej autorytetu ode mnie."

Przegląd kodu w tej fazie staje się polem bitwy albo odwrotnie — zamienia się w grzeczne klepanie po plecach, bo nikt nie chce zaogniać atmosfery. W obu przypadkach traci kod.

Co pomaga: ADR z numerowanymi opcjami i jawnymi kryteriami wyboru — decyzja przestaje być zdaniem Marka kontra zdaniem Ani, staje się oceną opcji A kontra opcja B według ustalonych kryteriów. Spike'i zamiast debat: dwa dni prototypu dają dane, których nie ma żaden argument teoretyczny. Definition of Done uzgodniona przed startem sprintu, nie negocjowana przy każdym pull requeście.

**Norming**

Pojawia się wspólne poczucie własności kodu i zaufanie. To moment, w którym dług techniczny przestaje być tematem tabu — jest dość bezpieczeństwa, żeby powiedzieć głośno "ten kawałek jest zepsuty i powinniśmy to naprawić," bez obawy, że zostanie to odebrane jako atak na autora.

Testy przestają być walką, stają się normą. Właściciele modułów dla krytycznych obszarów kodu — nie po to, żeby zablokować dostęp innym, ale żeby mieć kogoś odpowiedzialnego za jakość. ADR-y pisane prospektywnie, przed decyzją, nie post factum. I właśnie tutaj prawo Conwaya zaczyna działać w drugą stronę — granice kodu i granice odpowiedzialności zespołu zaczynają się pokrywać w sposób, który można świadomie kształtować.

**Performing**

Rzadkie, cenne, kruche. Wspólny model mentalny sprawia, że decyzje są szybkie, a refaktoryzacja jest możliwa, bo jest zaufanie. Architektoniczne testy fitness — automatyczne sprawdzenia, czy architektura nie dryfuje od założeń — mają sens dopiero tutaj, bo jest dojrzałość, żeby reagować na alarmy zamiast je wyciszać albo ignorować.

I właśnie dlatego każda niepotrzebna rotacja na tym etapie boli nieproporcjonalnie do tego, co widać na powierzchni. Nie tracisz człowieka. Tracisz performing.

![Fazy zespołu a strategia pracy z kodem](/blog/diagram_tuckman.svg)

---

## Prawo Conwaya domyka pętlę

Conway [napisał w 1968 roku](https://www.melconway.com/Home/Committees_Paper.html): *"organizacje produkują projekty będące kopiami ich struktur komunikacyjnych."* Brzmiało to jak obserwacja. [Badania Microsoftu z 2008 roku](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2008-11.pdf) pokazały, że metryki organizacyjne — kto z kim rozmawia, jak wyglądają granice zespołów — przewidywały moduły kodu podatne na błędy lepiej niż metryki samego kodu.

Jeśli zespół, w którym jesteś, jest w storming i ma rozmyte granice odpowiedzialności, Twój kod będzie miał rozmyte granice modułów. Jeśli masz trzy podsystemy i dwa i pół zespołu, które "jakoś to ogarniają," Twój kod będzie miał dwa i pół naturalnej granicy — a przy próbie wydzielenia mikroserwisów wyjdzie to boleśnie.

Odwrócony manewr Conwaya — świadome projektowanie struktury zespołów pod architekturę, którą chcesz osiągnąć — działa. Ale działa tylko wtedy, gdy zespół jest dość unormowany, żeby tę strukturę utrzymać. W storming każda granica jest negocjowana na nowo przy każdej zmianie, bo nie ma jeszcze wspólnego rozumienia tego, co do kogo należy.

---

## Jedno pytanie diagnostyczne

Zanim zaczniesz wdrażać DDD, Event Storming inne ceremonię lub narzędzia — sprawdź, czy masz dość bezpieczeństwa psychologicznego w zespole, żeby te praktyki w ogóle zadziałały. Narzędzia działają tylko w rękach ludzi, którzy mogą się mylić bez strachu.

---

**Źródła:**

1. Tuckman, B.W. (1965). [*Developmental Sequence in Small Groups*](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Dynamics/Tuckman_1965_Developmental_sequence_in_small_groups.pdf). Psychological Bulletin, 63(6), 384–399.
2. Skelton, M., Pais, M. (2019). [*Team Topologies: Organizing Business and Technology Teams for Fast Flow*](https://itrevolution.com/product/team-topologies/). IT Revolution Press. ISBN: 978-1942788812
3. Brooks, F.P. (1975/1995). [*The Mythical Man-Month: Essays on Software Engineering*](https://www.oreilly.com/library/view/mythical-man-month-the/0201835959/). Addison-Wesley. ISBN: 978-0201835953
4. Conway, M.E. (1968). [*How Do Committees Invent?*](https://www.melconway.com/Home/Committees_Paper.html) Datamation, 14(4), 28–31.
5. Nagappan, N., Murphy, B., Basili, V. (2008). [*The Influence of Organizational Structure on Software Quality*](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2008-11.pdf). ICSE 2008.
