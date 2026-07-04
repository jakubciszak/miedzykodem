# Model szwajcarskiego sera, czyli jak odzyskać zaufanie do kodu pisanego z AI

tagi: "AI", "jakość", "Swiss Cheese Model", "James Reason", "code review", "agentic coding", "procesy"

Jest takie pytanie, które słyszę ostatnio w niemal każdej rozmowie o AI w programowaniu: *„No dobrze, ale czy mogę ufać temu kodowi?"*

I jest to pytanie źle postawione.

Pisałem już, że AI nie zmienił zasad gry, tylko ją przyspieszył. Kod powstaje szybciej, niż jesteśmy w stanie go zweryfikować, a systemy erodują w tempie, którego nie znaliśmy wcześniej. Naturalny odruch w tej sytuacji to szukanie **jednego doskonałego zabezpieczenia**: idealnego prompta, lepszego modelu, bardziej rygorystycznego code review, agenta-recenzenta który „na pewno wszystko wyłapie". Niestety często historia kończy się tak samo — zabezpieczenie zawodzi, zaufanie spada do zera, a zespół ogłasza, że „AI się nie nadaje do poważnego kodu".

Tymczasem inżynieria bezpieczeństwa rozwiązała ten problem kilkadziesiąt lat temu. Nie w IT — w lotnictwie.

---

## James Reason i ser z dziurami

Pod koniec lat 80. psycholog James Reason badał katastrofy lotnicze i awarie przemysłowe. Zauważył rzecz, która brzmi dziś na oczywistą, a wtedy była rewolucją: **wielkie katastrofy prawie nigdy nie mają jednej przyczyny**. Czarnobyl, Challenger, Tenerife — w każdym z tych przypadków zawiodło jednocześnie kilka niezależnych zabezpieczeń.

Reason opisał to obrazową metaforą [1]. Każda warstwa obrony — procedura, alarm, checklista, człowiek przy sterach — jest jak plaster szwajcarskiego sera: **ma dziury**. Dziury się przesuwają, zmieniają rozmiar, pojawiają i znikają. Pojedynczy plaster zatrzymuje większość zagrożeń, ale nie wszystkie. Katastrofa zdarza się wtedy, gdy dziury we *wszystkich* plastrach ułożą się w jednej linii i zagrożenie przelatuje przez cały stos na wylot.

Wniosek z tego jest nieoczywisty i prosty zarazem: **nie potrzebujesz doskonałych zabezpieczeń. Potrzebujesz wystarczająco wielu niedoskonałych, żeby dziury nigdy się nie pokryły.**

![Model szwajcarskiego sera — warstwy obrony w pracy z AI](/blog/swiss-cheese-model.svg)

Ta metafora zrobiła karierę daleko poza lotnictwem. Medycyna używa jej do analizy błędów szpitalnych. Podczas pandemii ilustrowała, dlaczego maseczki + dystans + szczepienia działają razem, choć żadne z osobna nie daje gwarancji. Branża półprzewodników natomiast, gdzie błąd wykryty po tape-oucie kosztuje miliony, buduje na niej całe metodologie weryfikacji procesorów: symulacje, formalne dowody, asercje, testy zgodności z referencyjnymi modelami, code review [2]. Każda technika łapie inną kategorię błędów. Żadna nie łapie wszystkich. Razem — łapią prawie wszystko.

Skoro model sprawdza się przy weryfikacji krzemu, gdzie stawka jest liczona w milionach dolarów, to może warto go potraktować poważnie przy weryfikacji kodu generowanego przez AI?

---

## Dlaczego pojedyncza warstwa zawsze zawiedzie

Wróćmy do zaufania. Problem z kodem od AI nie polega na tym, że AI popełnia błędy — ludzie też je popełniają, od zawsze. Problem polega na **skali i tempie**: agent wygeneruje w godzinę tyle kodu, ile zespół pisał tydzień, a nasze mechanizmy weryfikacji nie przeskalowały się ani trochę. Jeśli jedyną linią obrony jest „przeczytam diffa przed merge'em", to właśnie zostałeś jedynym plastrem sera.

Dwa przykłady z życia, oba dobrze udokumentowane.

Pierwszy, ze świata bezpieczeństwa [3]: obejście uwierzytelniania, które ujawniało się **wyłącznie pod presją pamięci** — źle napisana obsługa wyjątku zwracała `true` zamiast odrzucić żądanie. Statyczna analiza tego nie widziała (kod wyglądał poprawnie), testy jednostkowe nie widziały (nikt nie testował out-of-memory), review nie widziało (kto symuluje w głowie brak pamięci?). Trzy małe dziury ułożyły się w linię i powstała krytyczna podatność. Wykrył ją dopiero test chaosowy — czwarta warstwa, której wcześniej nie było.

Drugi, ze świata agentic codingu [4]: agent wdrożył zepsutą konfigurację uwierzytelniania **mimo szczegółowego prompta, przy zielonym linterze i zielonym CI**. Każda z tych warstw zadziałała zgodnie ze swoją specyfikacją — po prostu żadna z nich nie była zaprojektowana do łapania tej klasy błędu. Wyłapał go dopiero człowiek na review.

Zauważ wzorzec: w obu przypadkach nie zawiodła „jakość AI" ani „kompetencje zespołu"; zawiodła **architektura obrony** — było za mało plastrów albo ich dziury były skorelowane.

I tu jest sedno sprawy. Pytanie *„czy mogę ufać temu kodowi?"* zakłada, że zaufanie to cecha kodu albo modelu, a zaufanie jest cechą **systemu weryfikacji wokół kodu**. Nie ufasz pilotowi — ufasz lotnictwu: procedurom, checklistom, redundancji, drugiemu pilotowi, kontroli naziemnej. Dokładnie tak samo nie powinieneś ufać agentowi — powinieneś ufać stosowi warstw, przez który jego kod musi przejść.

---

## Stos plastrów dla zespołu pracującego z AI

Jak taki stos wygląda w praktyce? Świetne zestawienie proponuje artykuł o Swiss Cheese Model w agentic codingu [4]. Ułożyłem je w kolejności od najtańszej do najdroższej warstwy:

1. **Instrukcje i kontekst** — prompt, `CLAUDE.md`, konwencje projektu, ADRy, opisu biznesowe zadań. Pierwszy plaster: tani, ale dziurawy jak sito. Agent potrafi zignorować instrukcję albo zinterpretować ją po swojemu.
2. **Lint i statyczna analiza** — łapie błędy składniowe, strukturalne, część klas podatności. Deterministyczny, natychmiastowy, ślepy na semantykę.
3. **Hooki agentowe** — automatyczne bramki uruchamiane po każdej edycji pliku. Agent dostaje feedback od razu i poprawia się w locie, zanim błąd zdąży obrosnąć kolejnym kodem.
4. **Testy i CI** — jednostkowe, integracyjne, cały pipeline. Łapią regresje w tym, co zostało pokryte. Nie łapią niczego w tym, co pokryte nie zostało — i to jest ich nazwana dziura.
5. **Review agentowe** — drugi model przegląda kod pod kątem poprawności, bezpieczeństwa, architektury, wydajności. Inna perspektywa niż autor-agent, więc inne dziury.
6. **Review ludzkie** — osąd, kontekst biznesowy, modelowanie zagrożeń. Najdroższa warstwa, więc powinna robić to, czego żadna inna nie umie — a nie sprawdzać średniki.

Dwie rzeczy, które łatwo przegapić przy budowie takiego stosu.

Po pierwsze — **warstwy muszą być niezależne**. Jeśli agent-recenzent to ten sam model z tym samym kontekstem co agent-autor, ich dziury będą skorelowane i dwa plastry zadziałają jak jeden. To samo dotyczy ludzi: review od osoby, która była partnerem w pair programmingu, łapie mniej niż świeże oko.

Po drugie — **dziury trzeba nazywać, nie ukrywać**. Dojrzały zespół wie, czego jego linter *nie* łapie, czego testy *nie* pokrywają, na co reviewer *nie* patrzy. Nazwana dziura to świadoma decyzja o ryzyku. Nienazwana — to niespodzianka czekająca na alignment.

Jest też wniosek operacyjny, który branża hardware'owa ma przećwiczony od lat [2]: kiedy defekt mimo wszystko się prześlizgnie, nie pytaj „która warstwa zawiodła", tylko **„dlaczego przepuściły go wszystkie"**. Dziura w jednym plastrze to dziura w całej metodologii — poprawiać warto kilka warstw naraz, bo skoro dziury raz się pokryły, pokryją się znowu.

---

## Od metafory do narzędzia

Metafory są tanie — pytanie, jak to wdrożyć bez powoływania komitetu. Jeżeli chciałbyś sprawdzić jak takim model sprawdza się w Twoim projekcie z ale nie masz czasu na opisywanie wszystkiego od zera, zbudowałem narzedzie [code-quality-confidence](https://github.com/jakubciszak/code-quality-confidence) [5] to plugin do Claude Code, który implementuje model szwajcarskiego sera jako konkretny, konfigurowalny stos obrony.

Kilka decyzji projektowych, które wynikają wprost z teorii powyżej:

**Stos jest jawny.** `/swiss-cheese:init` analizuje repozytorium, przeprowadza wywiad o profilu ryzyka projektu i generuje konfigurację warstw: guardraile w `CLAUDE.md`, checklistę review, hooki pre-commit, szkielet ADRów. `/swiss-cheese:status` pokazuje, które warstwy działają, a których brakuje — czyli **wizualizuje dziury w twoim stosie**, zamiast pozwalać ci wierzyć, że ich nie ma.

**Każda warstwa ma nazwane dziury.** Dodając nową warstwę przez `/swiss-cheese:layer`, definiujesz nie tylko to, przed czym chroni, ale też — obowiązkowo — czego *nie* złapie. To wymuszenie uczciwości, o której pisałem wyżej.

**Review jest wieloagentowe i adaptacyjne.** `/swiss-cheese:review` dobiera specjalistów (poprawność, bezpieczeństwo, architektura, wydajność, testy, dokumentacja) do tego, co faktycznie się zmieniło — zmiana w samej dokumentacji uruchamia jednego agenta, nie sześciu. Różni specjaliści to różne perspektywy, czyli — wracając do metafory — plastry o różnym układzie dziur.

**Drogie warstwy robią tylko drogą robotę.** Cała deterministyczna praca (sondowanie repo, snapshot diffa, uruchamianie bramek) to skrypty w czystym Pythonie. Tokeny modelu idą wyłącznie na osąd. To ta sama zasada, co z ludzkim review: nie marnuj najdroższej warstwy na sprawdzanie średników.

**Stos się uczy.** Agenci review utrzymują pamięć projektu — decyzje projektowe, potwierdzone fałszywe alarmy, zaufane wzorce. Dziury w plastrach się przesuwają, więc plastry też powinny.

To na pewno nie jest jedyna słuszna implementacja — traktuj ją raczej jako dowód, że od metafory do działającego procesu jest jeden krok, nie dziesięć.

---

## Zmiana pytania

Na koniec wróćmy do pytania z początku, bo teraz można je wreszcie postawić poprawnie.

Nie: *„czy mogę ufać temu kodowi?"* — na to pytanie nie ma dobrej odpowiedzi, tak samo jak nie ma jej dla kodu pisanego przez człowieka o 23:40 w piątek.

Tylko: **„ile niezależnych warstw musi zawieść jednocześnie, żeby ten defekt trafił na produkcję?"**

Jeśli odpowiedź brzmi „jedna" — nie masz problemu z AI, masz problem z architekturą obrony i miałeś go już przed AI, tylko wolniejsze tempo pozwalało go nie zauważać. Jeśli odpowiedź brzmi „cztery albo pięć, z różnymi układami dziur" — możesz spokojnie pozwolić agentom pracować szybko, bo twoje zaufanie nie wisi na żadnym pojedynczym plastrze.

Autor tekstu o agentic codingu ujął to zgrabnie: przestań pytać „jak napisać doskonałego prompta" i zacznij pytać **„jak zbudować lepszy stos sera"** [4]. To jest dokładnie ta zmiana perspektywy, którą lotnictwo przeszło czterdzieści lat temu — od szukania winnego pilota do projektowania systemu, w którym błąd pojedynczego człowieka nie może zabić trzystu osób.

Kod od AI nie zasługuje na zaufanie, kod od ludzi też nie. Zaufanie należy się systemowi — o ile go zbudowałeś.

---

#### Linki do źródeł:

* [[1] James Reason, „Human error: models and management", BMJ (2000)](https://www.bmj.com/content/320/7237/768)
* [[2] Codasip, „Building a Swiss cheese model approach for processor verification"](https://codasip.com/2022/04/29/building-a-swiss-cheese-model-approach-for-processor-verification/)
* [[3] „The Swiss Cheese Model of AI Security: Why Single-Layer Defense Always Fails", dev.to](https://dev.to/kenimo49/the-swiss-cheese-model-of-ai-security-why-single-layer-defense-always-fails-258l)
* [[4] „Swiss Cheese Model of Agentic Coding", Geekpulp](https://geekpulp.co.nz/2026/04/25/swiss-cheese-model-of-agentic-coding/)
* [[5] code-quality-confidence — plugin swiss-cheese dla Claude Code (GitHub)](https://github.com/jakubciszak/code-quality-confidence)
