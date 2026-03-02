# Dług techniczny — metafora, której prawie nikt nie rozumie poprawnie

tagi: "Kolekcja klasyki", "dług techniczny", "AI", "architektura"m "Martin Fowler", "Ward Cunningham"

Ciąg dalszy wpisów z serii "Kolekcja klasyki" (Czy tylko ja nie umiem tego przeczytać inaczej niż głosem Piotra Fronczewskiego? :)). Dzisiejsi bohaterowie — Martin Fowler oraz Ward Cunningham — i metafora, która zdominowała nasze branżowe dyskusje, mimo że większość z nas rozumie ją błędnie.

"Mamy za dużo długu technicznego." To zdanie pada na każdym retro. Wszyscy kiwają głowami. Ale zapytaj pięć osób w pokoju, co dokładnie przez to rozumieją — i dostaniesz pięć różnych odpowiedzi. Brzydki kod. Brak testów. Stary framework. Obejścia na szybko. Wszystko, co powinniśmy byli zrobić inaczej. Każdy używa tej samej metafory, ale każdy mówi o czymś innym.

I tu jest problem — bo ta metafora ma bardzo konkretne znaczenie.

## Cunningham nie mówił o złym kodzie

Ward Cunningham wprowadził pojęcie długu technicznego w 1992 roku, opisując system WyCash [1]. I to jest moment, w którym większość branży skręca w złą stronę — bo Cunningham **nie mówił o bałaganie w kodzie**. Mówił o czymś znacznie subtelniejszym.

Zespół napisał kod najlepiej, jak potrafił, na podstawie tego, co w danym momencie wiedział o domenie biznesowej. Potem nauczył się więcej — i ten sam kod, wcześniej dobry, stał się niedopasowany do aktualnego rozumienia problemu. Ta różnica — między kodem a obecną wiedzą o domenie — to jest dług techniczny w sensie Cunninghama.

Metafora finansowa jest celowa. Dług to nie zło samo w sobie. Firmy zaciągają kredyty, bo pozwalają im szybciej rosnąć — pod warunkiem, że mają plan spłaty. W wywiadzie z 2009 roku Cunningham powiedział to wprost: chodziło o świadomy kompromis, nie o pisanie byle jakiego kodu i nazywanie tego "długiem" [2].

## Kwadrant Fowlera, czyli nie każdy "dług" jest długiem

Fowler w 2009 roku wziął tę rozjechaną terminologię i nałożył na nią porządek [3]. Dwie osie — rozważny/lekkomyślny i świadomy/nieświadomy — dają cztery zupełnie różne sytuacje. I dopiero kiedy się je rozróżni, rozmowa o "długu technicznym" zaczyna mieć sens.

![Kwadrant Długu Technicznego Fowlera](/blog/kwadrant-fowlera.svg)

**Rozważny-świadomy:** "Musimy wypuścić teraz i poradzić sobie z konsekwencjami." Zespół wie, co upraszcza, i ma plan spłaty. To jest dług w sensie Cunninghama — i to jest jedyny dług, który warto świadomie zaciągać.

**Lekkomyślny-świadomy:** "Nie mamy czasu na projektowanie." Zespół wie, że robi źle, ale i tak to robi. Planu spłaty brak. To nie jest dług — to niechlujstwo z premedytacją. Używanie słowa "dług" to tu eufemizm, który ułatwia życie z tym faktem.

**Rozważny-nieświadomy:** "Teraz wiemy, jak powinniśmy byli to zrobić." Zespół nauczył się czegoś nowego — o domenie, o wzorcach, o architekturze — i widzi, że wcześniejszy kod, choć pisany w dobrej wierze, nie pasuje do aktualnego rozumienia. Nieunikniony koszt uczenia się. Każdy system to ma.

**Lekkomyślny-nieświadomy:** "Co to jest warstwowanie?" Zespół nie wie, że robi źle, bo nie zna dobrych praktyk. To nie jest dług — to brak kompetencji. Leczy się edukacją i mentoringiem, nie "spłatą."

## A potem przyszło AI

Odnoszę wrażenie, że era agentów AI komplikuje każdy z tych kwadrantów na nowe sposoby.

Agent generujący kod nie przechodzi przez fazę uczenia się domeny, nie buduje stopniowo intuicji o tym, dlaczego klient robi coś w określony sposób. Produkuje kod, który formalnie spełnia wymagania — ale nie niesie w sobie pełnego zrozumienia domeny, które Cunningham uważał za sedno świadomego kompromisu. Dług rozważny-nieświadomy pojawia się natychmiast, bo kod od pierwszego dnia odzwierciedla powierzchowne zrozumienie problemu.

Dług lekkomyślny-świadomy — "nie mamy czasu na projektowanie" — nabiera nowego wymiaru, gdy generowanie kodu jest natychmiastowe. Skoro "wystarczy poprosić agenta," pokus żeby nie inwestować w architekturę jest więcej niż kiedykolwiek. Mam wrażenie, że właśnie to obserwujemy — nikt nie planuje architektonicznych kompromisów, bo kompromis implikuje, że w ogóle myślisz o architekturze.

A dług lekkomyślny-nieświadomy? Tutaj AI tworzy dynamikę, której wcześniej nie było. Osoba, która nie rozumie wzorców projektowych, dostaje narzędzie generujące kod wyglądający profesjonalnie — ale nie potrafi ocenić, czy ten kod jest dobry. Agent reprodukuje wzorce z repozytorium ze stuprocentową konsekwencją, bez momentu refleksji. Jeśli repozytorium jest pełne rozbitych okien, agent uzna to za normę i dołoży kolejne.

![Jak AI zmienia każdy kwadrant długu](/blog/kwadrant-ai.svg)

## Dlaczego warto o tym mówić precyzyjnie

McKinsey szacuje, że dług techniczny stanowi ok. 40% bilansów IT [4]. Besker, Martini i Bosch policzyli, że 25% wysiłku deweloperskiego jest marnowane na problemy wynikające z długu technicznego [5]. Jedna czwarta czasu zespołu — nie na budowanie nowych rzeczy, ale na poruszanie się po labiryncie złożoności, którą sami stworzyliśmy.

W erze, w której kod powstaje szybciej niż kiedykolwiek, te liczby mogą tylko rosnąć. Chyba że zaczniemy używać języka, który Cunningham i Fowler nam dali — nie jako akademickiej ciekawostki, ale jako codziennego narzędzia. Kiedy w dyskusji padnie "mamy za dużo długu technicznego," prawidłowa odpowiedź to nie "zaplanujmy sprint na refaktoring."; prawidłowa odpowiedź to: "Co to za dług? Czy go planowaliśmy? Czy mamy po prostu bałagan?"

---

#### Linki do źródeł:

* [[1] Ward Cunningham, "The WyCash Portfolio Management System", OOPSLA 1992](http://c2.com/doc/oopsla92.html)
* [[2] Ward Cunningham, "Debt Metaphor" (video, 2009)](https://www.youtube.com/watch?v=pqeJFYwnkjE)
* [[3] Martin Fowler, "Technical Debt Quadrant" (2009)](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
* [[4] McKinsey, "Tech Debt: Reclaiming Tech Equity"](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/tech-debt-reclaiming-tech-equity)
* [[5] Besker, Martini, Bosch, "Technical Debt Cripples Software Developer Productivity" (2018)](https://www.researchgate.net/publication/325790190)
