# Archetyp CRM Activity — wzorzec, który znajdziesz wszędzie (i dlaczego warto go rozpoznać)

tagi: "architektura", "archetypy", "wzorce", "CRM", "Jim Arlow", "Ilan Neustadt", "domain modeling"

Niezależnie od branży, w której budujesz oprogramowanie, pewne schematy wracają jak bumerang. Nowy projekt, nowa domena, nowy zespół — a na tablicy po dwóch dniach analizy znowu rysuje się ten sam kształt.

Weźmy cztery zupełnie różne projekty.

Pierwszy — platforma fintechowa. Klient zakłada konto, przechodzi weryfikację tożsamości, podpisuje umowę, aktywuje kartę. Na każdym etapie system zapisuje: kto, co zrobił, kiedy i jaki był efekt. Dział compliance potrzebuje pełnej historii, żeby w razie audytu odtworzyć ścieżkę klienta co do minuty.

Drugi — system lojalnościowy dużej sieci handlowej. Klient zbiera punkty za zakupy, wymienia je na nagrody, dostaje spersonalizowane kampanie. Za każdą z tych interakcji stoi wpis: jaki typ aktywności, kto był uczestnikiem, co było przedmiotem, jaki wynik.

Trzeci — CRM w firmie ubezpieczeniowej. Konsultant dzwoni do klienta, wysyła ofertę, umawia spotkanie, odnotowuje reklamację. Każdy kontakt to rekord z datą, typem, uczestnikami i rezultatem.

Czwarty — system helpdesku. Klient zgłasza problem, agent odpowiada, eskaluje do drugiej linii, zamyka zgłoszenie. Historia interakcji jest kluczowa dla jakości obsługi.

Cztery różne branże, cztery różne zespoły, cztery różne zestawy wymagań. A pod spodem — ten sam schemat. Te same pytania: *kto*, *co zrobił*, *z kim lub czym*, *kiedy* i *jaki był efekt*.

To nie przypadek. To **archetyp**.

---

## Czym jest archetyp (i dlaczego to nie design pattern)

Jeśli pracujesz w IT dłużej niż kilka lat, prawdopodobnie znasz wzorce projektowe — klasyczne Gang of Four, może wzorce taktyczne z DDD jak Aggregate, Repository czy Value Object. Archetyp to coś zupełnie innego. Działa na wyższym poziomie abstrakcji.

Koncepcję archetypów biznesowych opisali Jim Arlow i Ilan Neustadt w książce *„Enterprise Patterns and MDA"* [1]. Ich teza jest prosta: w każdej domenie biznesowej powtarzają się te same fundamentalne schematy. Nie na poziomie kodu — na poziomie **pojęć biznesowych**. Nieważne czy budujesz system bankowy, sklep internetowy czy platformę medyczną — natrafisz na te same struktury: Party (kto uczestniczy w systemie), Product (co oferujesz), Order (co klient zamawia) — i właśnie Activity (co się wydarzyło). Te wzorce nie powstały wczoraj — były wielokrotnie testowane i dopracowywane w różnych kontekstach, zanim ktokolwiek z nas napisał swój pierwszy CRUD.

Jeśli szukasz analogii poza IT — Joseph Campbell opisał „podróż bohatera", schemat fabularny obecny w starożytnych mitach, filmach Lucasa i grach indie. Za każdym razem wygląda inaczej, ale struktura jest ta sama. Archetyp biznesowy działa dokładnie tak samo: konkretna implementacja różni się między domenami, ale szkielet jest uniwersalny.

I tu tkwi kluczowa różnica wobec design patternów. Wzorzec Strategy mówi Ci *jak zorganizować kod*. Archetyp Activity mówi Ci *jak zorganizować myślenie o domenie*. Jeden żyje w warstwie implementacji, drugi — w warstwie modelu biznesowego. Rozpoznanie archetypu następuje podczas rozmów z biznesem, a nie podczas code review.

W praktyce to oznacza coś bardzo konkretnego: jeśli rozpoznasz archetyp na etapie analizy, masz od razu gotową mapę pytań do ekspertów domenowych. Nie odkrywasz tego po trzech sprintach, kiedy okazuje się, że model nie radzi sobie z nowym wymaganiem — wiesz z góry, jaką strukturę przygotować.

---

## Activity pod lupą — anatomia wzorca

Archetyp Activity składa się z kilku elementów, które powtarzają się niezależnie od domeny:

- **Activity** — samo zdarzenie, fakt że coś się wydarzyło. Ma swój moment w czasie (lub przedział czasowy), status i wynik.
- **Activity Type** — klasyfikacja tego, co się stało. „Telefon wychodzący", „weryfikacja tożsamości", „naliczenie punktów" — to różne typy tej samej struktury.
- **Party (uczestnik)** — kto był zaangażowany. Klient, konsultant, system automatyczny. Często wielu uczestników w jednej aktywności, każdy w innej roli.
- **Subject (przedmiot)** — czego dotyczyła aktywność. Zamówienie, konto, zgłoszenie, kampania.
- **Outcome (rezultat)** — jaki był efekt. Sukces, odmowa, eskalacja, brak odpowiedzi.

![Archetyp CRM Activity — fragment wzorca](/blog/archetyp-crm-activity.svg)

Ważna myśl, którą łatwo przegapić: **Activity to nie log techniczny**. To główny element w domenie — byt, na podstawie którego biznes podejmuje decyzje. Menedżer sprzedaży analizuje historię kontaktów, żeby ocenić skuteczność kampanii. Dział compliance przegląda ścieżkę onboardingu, żeby spełnić wymogi regulatora. Program lojalnościowy nalicza punkty na podstawie zarejestrowanych aktywności zakupowych.

Jest jeszcze jedna subtelność, która często umyka: Activity jest **niemutowalne**. Coś, co się wydarzyło, nie może się „od-wydarzyć". Możesz zarejestrować nową aktywność korygującą (np. anulowanie poprzedniej), ale sam fakt pierwotnej aktywności pozostaje w historii. Jeśli kiedykolwiek pracowałeś z event sourcingiem, poczujesz tu znajomy schemat. Activity to w pewnym sensie domenowy odpowiednik domain event, tyle że żyjący na poziomie modelu biznesowego, nie technicznej infrastruktury.

---

## Gdzie go spotkasz w praktyce

Teoria jest fajna, ale archetypy pokazują swoją wartość dopiero wtedy, gdy rozpoznasz je w żywym projekcie.

### Onboarding w fintechu

Wyobraź sobie platformę finansową, gdzie nowy klient musi przejść kilkanaście kroków: rejestracja, weryfikacja dokumentów, scoring kredytowy, podpisanie umowy, aktywacja produktu. Każdy krok to osobna aktywność z uczestnikami (klient, system OCR, analityk ryzyka), przedmiotem (wniosek, dokument, umowa) i wynikiem (zatwierdzony, odrzucony, wymaga uzupełnienia).

Intuicyjnie, można by to zaimplementować jako sekwencję stanów wniosku — klasyczny state machine. Wniosek przechodzi ze stanu „nowy" przez „w weryfikacji" do „zatwierdzony". Na pierwszy rzut oka eleganckie rozwiązanie.

Problem pojawia się, kiedy biznes zaczyna pytać o rzeczy, których state machine nie umie wyrazić:

- „Ile średnio trwa krok weryfikacji dokumentów?"
- „Który analityk obsłużył najwięcej wniosków w tym miesiącu?"
- „Na którym etapie najczęściej klienci rezygnują?"
- „Pokaż mi pełną historię tego konkretnego wniosku ze wszystkimi interwencjami."

State machine przechowuje *gdzie jest wniosek teraz*. Activity przechowuje *co się z nim działo*. To fundamentalna różnica. Wniosek w stanie „odrzucony" nie mówi Ci, że był dwukrotnie cofany do uzupełnienia, raz eskalowany do managera i finalnie odrzucony po trzeciej próbie — Activity tak.

Co ciekawe, state machine nie musi znikać — może nadal pełnić rolę orkiestratora procesu. Ale sam stan przestaje być jedynym źródłem prawdy. Ogólny stan wniosku mówi „gdzie jesteśmy teraz", Activity mówi „jak tu dotarliśmy".

### Program lojalnościowy w retail

Weźmy duży system lojalnościowy w sieci handlowej z wieloma markami. Klient zbiera punkty, ale „zbieranie punktów" to tak naprawdę cały wachlarz aktywności: zakup w sklepie stacjonarnym, zakup online, udział w kampanii, polecenie znajomego, urodzinowy bonus.

Klasyczne podejście — osobny serwis per typ interakcji. Zakupy obsługuje moduł transakcyjny, kampanie — moduł marketingowy, polecenia — moduł referralowy. Każdy trzyma dane w swoim formacie, każdy po swojemu rozumie „historię klienta".

I wszystko działa, dopóki biznes nie poprosi o zunifikowany widok aktywności klienta — „pokaż mi wszystko, co ten klient zrobił w ostatnim roku". Wtedy okazuje się, że dane są rozproszone, niespójne w strukturze, trudne do zagregowania.

Rozpoznanie archetypu Activity pozwala zaproponować wspólny model: każda interakcja klienta z programem to Activity o określonym typie, z uczestnikiem (klient + opcjonalnie marka/sklep), przedmiotem (transakcja, kampania, kod polecenia) i wynikiem (naliczone punkty, status realizacji). Poszczególne bounded contexty nadal żyją własnym życiem — ale eksponują swoje zdarzenia w zunifikowanej strukturze Activity, którą widok historii klienta może konsumować.

Ważne zastrzeżenie: zunifikowanie struktury Activity nie musi oznaczać centralizacji danych w jednej bazie. Każdy bounded context nadal może być właścicielem swoich aktywności. Wspólny jest **kontrakt** — format, w jakim konteksty publikują informacje na zewnątrz. Centralizacja modelu i centralizacja danych to dwie zupełnie różne decyzje architektoniczne.

---

## Konfiguracja zamiast kodu — serce wzorca

Rozpoznanie archetypu daje jeszcze jedną, bardzo praktyczną korzyść: możliwość budowania systemów opartych na konfiguracji zamiast na hardkodowaniu każdego przypadku.

Jeśli nie widzisz wspólnego schematu, każdy nowy typ interakcji to nowy feature: osobna tabela, osobne endpointy, osobna logika walidacji. Backlog rośnie, a każdy nowy pomysł biznesu to sprint pracy deweloperskiej.

Jeśli widzisz archetyp, budujesz raz mechanizm obsługujący Activity — i nowy typ interakcji dodajesz jako konfigurację:

**Bez archetypu** — dodanie nowego typu kontaktu w CRM:
```
→ nowa tabela w bazie
→ nowe DTO / encja
→ nowe endpointy API
→ nowe walidatory
→ nowe testy
→ code review, deploy
→ 1-2 tygodnie pracy
```

**Z archetypem** — dodanie nowego typu kontaktu:
```
→ nowy wpis w rejestrze Activity Type
→ definicja wymaganych pól (metadata schema)
→ konfiguracja reguł walidacji
→ gotowe
→ godziny, nie tygodnie
```

Jak to może wyglądać w praktyce? Wyobraź sobie prosty rejestr typów aktywności w programie lojalnościowym:

```yaml
activity_types:
  purchase_in_store:
    participants: [customer, store]
    subject: transaction
    outcomes: [points_earned, points_rejected]
    metadata_schema:
      required: [transaction_id, amount, currency]
      optional: [product_categories, payment_method]
    rules:
      - "points = amount * 1.0"
      - "min_amount: 10 PLN"

  referral_signup:
    participants: [referrer, referee]
    subject: referral_code
    outcomes: [bonus_granted, bonus_rejected]
    metadata_schema:
      required: [referral_code, referee_email]
    rules:
      - "bonus = 500 points"
      - "max_referrals_per_month: 5"
```

Kiedy biznes powie „chcemy dodać punkty za zostawienie opinii o produkcie", deweloper nie pisze nowego serwisu — definiuje nowy typ aktywności z odpowiednimi uczestnikami, przedmiotem, wynikami i regułami. Silnik Activity obsłuży resztę.

To nie znaczy oczywiście, że system staje się magicznym „no-code". Złożone typy aktywności nadal mogą wymagać dedykowanej logiki. Ale 80% nowych typów to warianty istniejącego schematu — i te 80% obsłużysz konfiguracją, jeśli masz dobrze rozpoznany archetyp. Diabeł oczywiście tkwi w szczegółach — schemat metadanych musi być wystarczająco elastyczny, a jednocześnie nie możesz skończyć z własnym językiem programowania ukrytym w YAML-u.

Kluczowe pytanie: **co się zmienia między typami aktywności, a co zostaje takie samo?** To, co zostaje takie samo — to Twój archetyp. To, co się zmienia — to parametry konfiguracji.

---

## Kiedy to NIE jest Activity

Trzeba powiedzieć uczciwie: nie wszystko co ma timestamp to Activity. Czasem warto się zatrzymać i pomyśleć, czy tego archetypu faktycznie potrzebujemy.

**Logi techniczne** — wpis „serwer odpowiedział w 230ms" to metryka infrastrukturalna, nie aktywność biznesowa. Nikt z biznesu nie podejmuje decyzji na podstawie czasu odpowiedzi serwera (a jeśli podejmuje — to prawdopodobnie masz inny problem).

**Surowe eventy systemowe** — „użytkownik kliknął przycisk X" to zdarzenie UI, nie Activity w sensie archetypu. Activity pojawia się wtedy, kiedy zdarzenie ma **znaczenie biznesowe**: nie „kliknął wyślij", ale „złożył wniosek".

**Dane z sensorów i IoT** — odczyt temperatury co sekundę to strumień danych, nie seria aktywności. Ale uwaga: *alarm temperaturowy, który wywołał interwencję technika* — to już Activity.

Dobra reguła kciuka: **jeśli biznes nie potrzebuje historii tego zdarzenia do podejmowania decyzji, to nie jest Activity**. Jeśli nikt nigdy nie zapyta „pokaż mi wszystkie X tego klienta z ostatniego kwartału" — prawdopodobnie nie potrzebujesz tu archetypu.

I jeszcze jedna pułapka — **over-engineering przez nadmierne uogólnianie**. Fakt, że dwa byty mają datę, typ i uczestnika, nie oznacza automatycznie, że to ten sam archetyp. Zamówienie w sklepie i sesja logowania do systemu technicznie pasują do schematu Activity — ale ich semantyka biznesowa jest zupełnie inna. Próba wciśnięcia obu w jeden model to droga do generycznego potworka, który nie służy dobrze nikomu.

---

#### Linki do źródeł:
* [[1] Jim Arlow, Ilan Neustadt — „Enterprise Patterns and MDA: Building Better Software with Archetype Patterns and UML" (2004)](https://www.oreilly.com/library/view/enterprise-patterns-and/032111230X/)
