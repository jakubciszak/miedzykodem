# Extreme Programming jest potrzebny bardziej niż kiedykolwiek wcześniej

tagi: "kolekcja klasyki", "Extreme Programming", "agile", "scrum", "Kent Beck", "pair programming", "code review", "ci"

Przywitajmy się dzisiaj z Kentem Beckiem. W 1999 roku opublikował **Extreme Programming Explained** [1] z dwunastoma praktykami, które miały jedno wspólne DNA: **skracanie pętli zwrotnej**.

Ten sam człowiek wraz z siedemnastoma sygnatariuszami podpisali, genialny w swojej prostocie, Manifest Agile [2]. Warto wspomnieć, że w sumie trzech z tych siedemnastu "ojców" manifestu było także twórcami XP – Kent Beck, Ward Cunningham i Ron Jeffries.

## XP a Agile

Manifest Agile nie powstał obok XP. Powstał z XP.
Chronologia jest taka: `XP (1999) → Manifest Agile (2001) → Scrum Guide (formalizacja 2010+)`. Agile miał być parasolem nad praktykami inżynieryjnymi. Scrum [3] natomiast celowo nie definiuje praktyk technicznych — i to jest jednocześnie jego siła (elastyczność) i jego słabość (łatwo pominąć inżynierię).

Problem zaczął się, kiedy organizacje potrzebowały czegoś "wdrażalnego." Scrum dał im ramy procesowe — role, eventy, artefakty, ale celowo nie zdefiniował praktyk technicznych; tu się otworzyła luka: łatwiej jest "wdrożyć Agile", robiąc standupy i planningi, niż ucząc zespół TDD i pair programmingu. Jedno wymaga zmiany kalendarza. Drugie wymaga zmiany kultury.
Efekt? Organizacje robią Scruma bez XP. Mają ceremonie, ale nie mają dyscypliny. Mają velocity, ale nie mają testów. Dave Thomas wprost mówi, że Agile zostało "wywrócone do punktu, w którym jest praktycznie pozbawione znaczenia" [4].

Prawda jest taka, że porzucamy podstawowe narzędzia, skupiając się tylko na powierzchownej warstwie problemu. Agile/Scrum bez zasad Extreme Programmingu jest bezużyteczny, XP bez podstaw myślenia, jakie definiuje Agile, jest dłubaniem dłutem bez planu.

## Dwanaście praktyk XP vs AI

Same zasady extreme programmingu są w mojej opinii jeszcze bardziej potrzebne w czasach agentów AI. Już tłumaczę, spójrzmy na kilka zasad XP pod kątem agent codingu/vibe codingu

### Test Driven Development

TDD jest praktyką, która agent, na prawdę jest w stanie wznieść na wyższy poziom, a jednocześnie praktyką bardzo często pomijaną przy programowaniu z agentami.
Test first opiera się na pętli dwóch faz – Red/Green. Tylko tyle i aż tyle. Agenci są fenomenalni w Green, ale ma to sens kiedy test w fazie Red jest przemyślany i zrozumiany, ale w "red" — zdefiniuj, czego oczekujesz — jest bezradny bez kontekstu biznesowego.

Oczywiście, możemy przygotowywać opisu agentów, korzystać z narzędzi takich jak AutoGen od Microsoft [5], ale długofalowo TDD jest potęgą kiedy Ty definiujesz testy, zgłębiając przy tym domenę, a agent implementuje fazę Green. Odwrócenie tego procesu, lub pozostawienie AI pisania testów kodu, bez porządnego setupu pod pracę w trybie "AutoGen", to jakby student sam wystawiał sobie ocenę z egzaminu.

### Pair Programming

W pewnym sensie Agent to idealny "nawigator" – nie nudzi się, nie ocenia, jest dostępny o trzeciej w nocy, ale nie powie Ci, że Twój pomysł architektoniczny jest głupi, nie zada pytania "a po co to w ogóle robimy?" — bo nie ma kontekstu organizacyjnego, który ludzie budują latami. Można minimalizować ten problem budując bazę wiedzy dla agentów, nagrywając refinmenty, dając dostęp do dokumentacji. Jednak i podstaw LLM, będzie się zgadzał, nie ma tej ludzkiej przenikliwości i ciekawości.

Myślę, że skuteczne jest podejście hybrydowe – rutynowe zadania z agentem, bardziej złożone, wymagające decyzji architektonicznych z człowiekiem.

### Simple design

Beck: "zrób najprostszą rzecz, która może zadziałać." Agent nie dąży do prostoty, dąży do tego, żeby kod się skompilował.
Arlow i Neustadt w Enterprise Patterns [6] zauważyli, że simple design ma dwa wymiary: prostota kodu i prostota semantyki biznesowej, którą ten kod realizuje. Można mieć pięknie czysty kod, który implementuje błędne reguły biznesowe — bo sam kod jest kiepskim narzędziem do walidowania domeny, a refaktoryzacja pokręconej logiki biznesowej to zupełnie inna kategoria trudności niż refaktoryzacja kodu.

### Refactoring

Istnieją dwa rodzaje refactoringu – malutkie optymalizacje, zmiana zagnieżdżeń pętli na podejście funkcyjne, wyniesienie czegoś do stałej, albo enuma i takie tam. Tego typu zmiany bez sensu klepać ręcznie; agent jest wstanie zlokalizować i zmienić taki kod w mgnieniu oka.

Problem w tym, że AI sam w sobie nie wie kiedy refaktoryzować, nie rozumie, że refactor to decyzja przede wszystkim ekonomiczna, nie estetyczna. Koszt zmiany rośnie wykładniczo (krzywa Boehma [7]!). Refactoring w złym momencie, będzie drogi. Dla agenta nie ma to znaczenia, ale długoterminowo może okazać się strzałem w kolano.

### Coding standards

Agent pisze spójny kod, ale spójny z czym? Z danymi treningowymi. Nie z konwencjami Twojego zespołu. Nie z ADR-ami, które spisaliście pół roku temu. Chyba, że jesteś do tego dobrze przygotowany. Utrzymywanie ADRów w repozytorium, dbanie o instrukcje AGENTS, SKILLS itp. są wstanie znacząco poprawić ten element XP w pracy z AI.

## Feedback cycle — serce XP, które agenci mogą złamać

#### Cały sekret XP: skracaj pętlę zwrotną.

```
TDD → minuty. Pair programming → sekundy. CI → godziny. Small releases → dni. On-site customer → tygodnie
```

Każda praktyka XP to inny mechanizm zmniejszania odległości między "napisałem kod" a "wiem, czy ten kod jest dobry."
Boehm w 1981 pokazał wykładniczy wzrost kosztu naprawy [7]; Beck argumentował, że XP spłaszcza tę krzywą [1]; Ambler zniuansował: łagodzi się, ale nigdy nie jest płaska [8].

I tu jest sedno problemu z agentami. Agent przyspiesza pisanie – nie przyspiesza feedbacku, a w wielu przypadkach feedback się wydłuża, bo ilość kodu do zrozumienia rośnie szybciej niż zdolność zespołu do review.

## XP, a ewolucja systemów

Zaprośmy do tej dyskusji jeszcze jedną osobę — Simona Wardleya [9].
Jego prace są istotne w kontekście Extreme Programming. Zdecydowanie za rzadko zwracamy uwagę na to, że różne praktyki nie mają jednakowej wartości na każdym etapie ewolucji, tak samo jest z praktykami XP:

### Genesis (startup, MVP):

Agent + small releases + CI = idealny sojusz. Szybko prototypujesz, szybko walidujsz. TDD mniej krytyczne — kod jest tymczasowy.

### Custom-Built (wzrost):

Prawdziwe TDD i pair programming stają się kluczowe. Bez testów i review kod staje się długiem, a Collective ownership nabiera sensu.

### Product (dojrzałość):

Refactoring i coding standards dominują. Agent pomaga, ale jest niebezpieczny bez kontekstu historii decyzji. ADR-y i dokumentacja stają się kluczowe.

### Commodity (legacy):

Agent najbardziej ograniczony. Problem to nie kod — to wyparowana wiedza. Tu wraca on-site customer i metaphor — trzeba odkryć domenę na nowo.

# Praktyka nr 13: rozumiej to, co akceptujesz

Beck dał nam 12 praktyk. Era agentów wymaga trzynastej:

> Rozumiej to, co akceptujesz.

Kiedy kolega pisał kod, mieliśmy code review. Ktoś czytał, pytał, sugerował. Kiedy agent pisze, pokusa jest inna: "działa? merge." I wtedy wracamy do kwadrantu Fowlera [10]:

→ Agent pisze, Ty rozumiesz i akceptujesz kompromisy → rozważny-świadomy. OK.

→ Agent pisze, Ty klikasz "accept all" → lekkomyślny-świadomy.

→ Agent pisze, nikt nie rozumie decyzji architektonicznych → lekkomyślny-nieświadomy – skali, jakiej Fowler nie przewidział.

# Konkluzja

### XP nie jest przestarzałe. Jest bardziej potrzebne niż kiedykolwiek.

**Pair programming** to nie "dwie osoby przy monitorze" — to zasada, że kod nigdy nie powinien powstawać bez drugiej pary oczu. Agent nie liczy się jako ta para, bo nie pyta "dlaczego."

**TDD** to nie "pisz testy przed kodem" — to zasada, że zanim napiszesz linijkę, musisz wiedzieć, czego oczekujesz.

**Simple design** to nie "mało kodu" — to minimalny kod, który poprawnie modeluje domenę.

**Manifest Agile** [2] miał być parasolem nad tymi praktykami. Scrum dał nam ramy procesowe, ale gdzieś po drodze porzuciliśmy substancję na rzecz ceremonii. I teraz, w 2026, kiedy agenci AI generują kod szybciej niż ktokolwiek jest w stanie go przeczytać — desperacko potrzebujemy dokładnie tych praktyk, które 25 lat temu uznaliśmy za "zbyt extreme."

Beck miał rację. Tylko partner się zmienił.

---

## Źródła

[1] Beck, K. (1999). *Extreme Programming Explained: Embrace Change*. Addison-Wesley. Drugie wydanie: 2004. — [goodreads.com/book/show/67833](https://www.goodreads.com/book/show/67833.Extreme_Programming_Explained)

[2] Beck, K. et al. (2001). *Manifesto for Agile Software Development*. — [agilemanifesto.org](https://agilemanifesto.org/)

[3] Schwaber, K., Sutherland, J. (2020). *The Scrum Guide*. — [scrumguides.org](https://scrumguides.org/scrum-guide.html)

[4] Thomas, D. (2014). *Agile Is Dead (Long Live Agility)*. — [pragdave.me/thoughts/active/2014-03-04-time-to-kill-agile.html](https://pragdave.me/thoughts/active/2014-03-04-time-to-kill-agile.html)

[5] Wu, Q. et al. (2023). *AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation*. Microsoft Research. — [github.com/microsoft/autogen](https://github.com/microsoft/autogen)

[6] Arlow, J., Neustadt, I. (2003). *Enterprise Patterns and MDA: Building Better Software with Archetype Patterns and UML*. Addison-Wesley. ISBN: 978-0321112309

[7] Boehm, B.W. (1981). *Software Engineering Economics*. Prentice Hall. Patrz też: Boehm, B.W. (1988). "A Spiral Model of Software Development and Enhancement." *IEEE Computer*, 21(5). — [doi.org/10.1109/2.59](https://doi.org/10.1109/2.59)

[8] Ambler, S.W. *Examining the Agile Cost of Change Curve*. Ambysoft / Agile Modeling. — [agilemodeling.com/essays/costOfChange.htm](http://agilemodeling.com/essays/costOfChange.htm)

[9] Wardley, S. (2016). *Wardley Maps: The use of topographical intelligence in business strategy*. — [learnwardleymapping.com](https://learnwardleymapping.com/)

[10] Fowler, M. (2009). *Technical Debt Quadrant*. — [martinfowler.com/bliki/TechnicalDebtQuadrant.html](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
