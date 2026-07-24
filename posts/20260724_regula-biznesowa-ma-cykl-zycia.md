# Reguła biznesowa ma cykl życia. Instrukcja if ma tylko historię w Git

tagi: "reguły biznesowe", "architektura", "domain modeling", "Specification", "Strategy", "Policy", "archetyp Rule", "Rule Engine", "Jim Arlow", "Ilan Neustadt"

Najdroższe reguły biznesowe często zaczynają jako najtańszy `if` w systemie.

Wyobraźmy sobie system obsługujący bibliotekę. Pierwsza zasada jest prosta: książkę może wypożyczyć jedynie użytkownik, który nie posiada przetrzymanych egzemplarzy. Implementacja nie wymaga komitetu architektonicznego, silnika reguł ani trzech mikroserwisów. Wystarczy kilka linii:

```php
public function canBorrow(LibraryUser $user): bool
{
    return !$user->hasOverdueBooks();
}
```

Ten kod jest poprawny. Jest czytelny, testowalny i prawdopodobnie jest najlepszym rozwiązaniem problemu, który mamy w tej chwili.

Potem biblioteka zaczyna działać.

Konto może zostać zawieszone. Zwykły czytelnik może posiadać maksymalnie pięć książek, ale nowy tylko trzy. Student ma wyższy limit. Nauczyciel może mieć jedną przetrzymaną książkę. Pracownik biblioteki podlega jeszcze innym zasadom. Termin zwrotu zależy od roli użytkownika, rodzaju książki, kalendarza oraz tego, do kiedy konkretny egzemplarz jest dostępny.

Pierwszy `if` dostaje rodzeństwo. Potem kuzynostwo. W końcu cała rodzina spotyka się w jednej metodzie i nikt nie pamięta, kto kogo zaprosił.

Specification, Strategy, Policy i archetyp Rule pomagają poradzić sobie z różnymi rodzajami złożoności. Jest jednak jeszcze jeden krok: **reguła biznesowa może mieć własną tożsamość, wersję i historię, niezależną od historii kodu, który ją wykonuje**.

---

## "if" nie jest regułą biznesową

Zdanie:

> Czytelnik z przetrzymaną książką nie może wypożyczyć kolejnej.

jest regułą biznesową.

Kod:

```php
if ($user->hasOverdueBooks()) {
    return false;
}
```

jest jedną z możliwych implementacji tej reguły.

To rozróżnienie wygląda na akademickie, dopóki ktoś nie zapyta:

- Skąd wzięła się ta reguła?
- Kto ją zatwierdził?
- Od kiedy obowiązuje?
- Czy dotyczy wszystkich typów kont?
- Dlaczego w zeszłym miesiącu użytkownik mógł wypożyczyć książkę, a dzisiaj nie może?
- Która wersja reguły została użyta do podjęcia konkretnej decyzji?

Instrukcja sterująca nie zna odpowiedzi na żadne z tych pytań. Git pokaże, kto zmienił linię kodu i kiedy ją wdrożono, ale commit nie jest decyzją biznesową. Autor pull requesta również nie musi być właścicielem reguły. Często jest tylko ostatnią osobą w łańcuchu przekazywania informacji, który zaczął się od regulaminu, analityka, prawnika albo rozmowy na Teamsach, do której nikt już nie potrafi znaleźć linku.

Business Rules Group nazywa reguły "pierwszoklasowymi obywatelami" modelu biznesowego i podkreśla, że powinny być oddzielone od procesów oraz procedur [1]. To ważna perspektywa: proces mówi, **co po kolei robimy**, a reguła określa, **co jest dozwolone, wymagane albo prawdziwe**.

Kod może je łączyć w jednej metodzie. Domena niekoniecznie.

---

## Specification - gdy chcemy nazwać kryterium

Pierwszym sposobem uporządkowania warunków jest Specification. Eric Evans i Martin Fowler opisali ten wzorzec jako oddzielenie kryterium dopasowania od obiektu, który jest według niego oceniany [2].

Zamiast ukrywać wszystkie warunki w metodzie `canBorrow()`, możemy nadać im nazwy:

- `AccountIsActive`
- `HasNoOverdueBooks`
- `BorrowingLimitIsNotExceeded`
- `NewReaderLimitIsNotExceeded`

Każda specyfikacja odpowiada na jedno pytanie:

```php
interface Specification
{
    public function isSatisfiedBy(LibraryUser $candidate): bool;
}
```

Następnie możemy składać je za pomocą operatorów `AND`, `OR` i `NOT`:

```php
$eligibility = new AndSpecification(
    new AccountIsActive(),
    new HasNoOverdueBooks(),
    new BorrowingLimitIsNotExceeded(),
);

if (!$eligibility->isSatisfiedBy($user)) {
    return BorrowingDecision::rejected();
}
```

Zyskujemy osobne, testowalne obiekty oraz język bliższy domenie. Ta sama specyfikacja może zostać użyta podczas podejmowania decyzji, filtrowania użytkowników albo określania, czy interfejs powinien pokazać przycisk "Wypożycz".

Nie oznacza to jednak, że rozwiązaliśmy cały problem. Nazwaliśmy warunki i odseparowaliśmy ich implementację. Nadal są one klasami wdrażanymi razem z aplikacją, a wynik `false` nadal nie mówi, który warunek nie został spełniony.

---

## Strategy - gdy zmienia się cały wariant zachowania

Kiedy różne grupy użytkowników podlegają innym zestawom zasad, naturalnym kandydatem staje się Strategy, jeden z klasycznych wzorców opisanych przez Gang of Four [3].

Możemy wprowadzić:

```text
DefaultBorrowingStrategy
StudentBorrowingStrategy
TeacherBorrowingStrategy
EmployeeBorrowingStrategy
```

Każda strategia realizuje ten sam kontrakt, ale inaczej wyznacza limit książek, dopuszczalną liczbę przetrzymanych egzemplarzy oraz maksymalny czas wypożyczenia.

To dobry podział wertykalny: wybieramy kompletny wariant algorytmu na podstawie roli lub typu konta.

Problem pojawia się, kiedy zasady zaczynają przecinać warianty. Książka może być lekturą, egzemplarz może mieć rezerwację, konto może być zawieszone, a święto może przesuwać termin zwrotu. Każdy z tych aspektów dotyczy kilku strategii jednocześnie. Kopiowanie go do każdej implementacji szybko zmienia polimorfizm w elegancko opakowaną duplikację.

---

## Policy - gdy decyzja ma kilka niezależnych wymiarów

Zamiast dzielić system według typu użytkownika, możemy podzielić decyzję horyzontalnie:

- polityka statusu konta,
- polityka limitu wypożyczeń,
- polityka przetrzymanych książek,
- polityka dostępności egzemplarza,
- polityka wyznaczania terminu zwrotu.

Każda polityka sprawdza jeden aspekt. Łańcuch polityk zbiera ich wyniki albo zatrzymuje się po pierwszym odrzuceniu.

Różnicę między tymi podziałami najłatwiej zobaczyć na jednym obrazku:

![Podejście wertykalne i horyzontalne do warunków biznesowych](/blog/warunki-wertykalnie-horyzontalnie.svg)

W podejściu wertykalnym wybór strategii oznacza wybór kompletnego wariantu zachowania. W podejściu horyzontalnym każda polityka odpowiada za jeden wymiar decyzji i może obsługiwać wiele typów użytkowników. Złożoność nie znika. Zmieniamy granice, według których ją dzielimy.

W tym miejscu warto pożegnać się z gołym `bool`. Bibliotekarz i użytkownik nie potrzebują informacji, że decyzja ma wartość `false`. Potrzebują wiedzieć, dlaczego system odmówił:

```text
Decision: rejected
Reasons:
- ACCOUNT_SUSPENDED
- BORROWING_LIMIT_EXCEEDED
```

Policy dobrze oddziela odpowiedzialności i umożliwia niezależne testowanie poszczególnych aspektów decyzji. Nadal jednak każda nowa polityka oznacza zazwyczaj zmianę kodu, testy i wdrożenie.

I to jest całkowicie w porządku, dopóki reguły zmieniają się w podobnym tempie jak reszta aplikacji.

---

## To nie jest drabinka do architektonicznego nieba

Łatwo przedstawić te rozwiązania jako kolejne poziomy dojrzałości:

```text
if -> Specification -> Strategy -> Policy -> Rule Engine
```

Taki obrazek wygląda dobrze na slajdzie, ale prowadzi do złego wniosku. Rule Engine nie jest dorosłą wersją instrukcji `if`, tak samo jak baza grafowa nie jest dorosłą wersją tablicy w PostgreSQL.

Każde narzędzie odpowiada na inne pytanie:

| Sytuacja | Najprostsze pasujące narzędzie |
| --- | --- |
| Lokalny i stabilny warunek | Metoda domenowa albo `if` |
| Kryterium selekcji lub walidacji obiektu | Specification |
| Wymienne warianty całego algorytmu | Strategy |
| Decyzja złożona z niezależnych aspektów | Policy |
| Reguły tworzone, wersjonowane lub wybierane w runtime | Model Rule, DSL, tabela decyzyjna lub Rule Engine |

Wzorce nie przyznają punktów doświadczenia. Jeżeli dwa warunki w metodzie wiernie opisują domenę, zamiana ich na dwanaście klas nie jest refaktoryzacją. Jest przeprowadzką złożoności do większego mieszkania.

---

## Moment graniczny: reguła zaczyna żyć szybciej niż kod

Podejście oparte wyłącznie na klasach zaczyna ciążyć, gdy:

- reguły zmieniają się częściej niż pozostała część aplikacji,
- obowiązują tylko w określonym czasie,
- różnią się między rynkami, markami albo kanałami,
- musimy odtworzyć historyczną decyzję,
- użytkownik oczekuje pełnego uzasadnienia wyniku,
- analitycy potrzebują porównywać lub symulować zestawy reguł,
- reguły są składane z faktów dostępnych dopiero w runtime.

Wtedy warto zadać pytanie:

> Czy reguła nadal jest częścią algorytmu, czy stała się danymi przetwarzanymi przez algorytm?

To właśnie tutaj przydaje się archetyp Rule opisany przez Jima Arlowa i Ilę Neustadt w "Enterprise Patterns and MDA" [4].

---

## Archetyp Rule - reguła jako model

Archetyp składa się z kilku podstawowych elementów:

- `Rule` reprezentuje pojedynczą, nazwaną regułę,
- `Variable` wskazuje wartość dostępną w kontekście,
- `Proposition` reprezentuje predykat,
- `Operator` opisuje operację, na przykład `AND`, `OR`, `NOT`, `EQUAL_TO` lub `LESS_THAN`,
- `RuleContext` dostarcza fakty potrzebne podczas ewaluacji,
- `RuleSet` grupuje powiązane reguły.

Reguła dopuszczająca wypożyczenie może zostać zapisana jako dane:

```yaml
id: LIBRARY_BORROWING_ELIGIBILITY
name: Użytkownik może wypożyczyć książkę
expression:
  - variable: accountSuspended
  - operator: NOT
  - variable: borrowedBooksCount
  - variable: maxBorrowingLimit
  - operator: LESS_THAN
  - operator: AND
```

Wyrażenie jest zapisane w notacji polskiej odwróconej:

```text
accountSuspended NOT
borrowedBooksCount maxBorrowingLimit LESS_THAN
AND
```

Ewaluator nie musi znać konkretnej reguły. Zna tylko dostępne rodzaje elementów, operatory oraz sposób pobierania faktów z kontekstu. Nowa kombinacja istniejących elementów może powstać bez dodawania kolejnej klasy.

To istotna zmiana. System nie zawiera już tylko kodu wykonującego politykę biznesową. Zawiera również model opisujący samą politykę.

Ale archetyp Rule nie rozwiązuje automatycznie wersjonowania, audytu ani zarządzania zmianą. Daje fundament. Reszta zależy od problemu, który rzeczywiście próbujemy rozwiązać.

---

## Reguła ma cykl życia

Jeśli reguła jest pełnoprawnym elementem domeny, może mieć:

- stabilny identyfikator,
- numer wersji,
- status,
- okres obowiązywania,
- źródło i uzasadnienie,
- właściciela biznesowego,
- informację o zatwierdzeniu,
- sposób rozwiązania konfliktu z innymi regułami.

Jej cykl życia może wyglądać tak:

![Cykl życia reguły biznesowej](/blog/cykl-zycia-reguly.svg)

```text
Draft -> Approved -> Active -> Superseded -> Retired
```

Reguła `LIBRARY_BORROWING_ELIGIBILITY` pozostaje tą samą koncepcją biznesową, ale jej wersje mogą mieć inne wyrażenia i okresy obowiązywania.

To praktyczne rozszerzenie archetypu, nie jego obowiązkowy element. Nie każda reguła potrzebuje workflow akceptacji i pięciu statusów. Jeżeli jednak decyzje są audytowane, reklamowane albo zależne od regulaminu, przechowywanie samego wyrażenia będzie równie użyteczne jak faktura bez numeru, daty i sprzedawcy.

---

## Git przechowuje inną historię

Historia kodu odpowiada na pytanie:

> Jaka implementacja znajdowała się w repozytorium i kiedy ją zmieniliśmy?

Historia reguły odpowiada na inne:

> Jaka polityka biznesowa obowiązywała dla zdarzenia z konkretnego dnia?

Martin Fowler opisuje podobny problem w katalogu Temporal Patterns [5]. Wzorzec Effectivity oznacza obiekt okresem, w którym jest uznawany za obowiązujący. Temporal Object pozwala z kolei rozróżnić trwałą tożsamość pojęcia od jego kolejnych wersji.

Załóżmy, że użytkownik wypożyczył książkę 10 stycznia według wersji 3 reguły. Wersja 4 weszła w życie 1 lutego, a w marcu ktoś skorygował datę jej obowiązywania wstecz. Pytanie "dlaczego system pozwolił na wypożyczenie?" nie jest już pytaniem o aktualny kod. Jest pytaniem o:

- fakty znane w chwili decyzji,
- wersję reguły wybraną przez system,
- biznesowy okres jej obowiązywania,
- moment, w którym system dowiedział się o zmianie.

Commit może być częścią odpowiedzi. Nigdy nie będzie całą odpowiedzią.

---

## `false` to za mało

Kiedy decyzja ma znaczenie biznesowe, wynik ewaluacji powinien przenosić kontekst:

```php
use DateTimeImmutable;

final readonly class RuleEvaluationResult
{
    /**
     * @param list<string> $reasons
     */
    public function __construct(
        public RuleId $ruleId,
        public int $ruleVersion,
        public bool $satisfied,
        public array $reasons,
        public DateTimeImmutable $evaluatedAt,
    ) {
    }
}
```

W bardziej wymagającym systemie zapiszemy również identyfikatory użytych faktów albo ich bezpieczny snapshot. Trzeba przy tym uważać, żeby pod hasłem "audyt" nie stworzyć bocznej bazy pełnej danych osobowych, o której przypomnimy sobie dopiero podczas incydentu.

Najważniejsze jest rozdzielenie dwóch odpowiedzi:

- **jaka była decyzja?**
- **dlaczego system ją podjął?**

`false` odpowiada wyłącznie na pierwsze pytanie.

---

## Reguły mogą być poprawne osobno i błędne razem

Możemy mieć cztery sensowne reguły:

- nauczyciel może posiadać jedną przetrzymaną książkę,
- zawieszone konto zawsze blokuje wypożyczenie,
- pracownik może przekroczyć standardowy limit,
- egzemplarz z rezerwacją może odebrać tylko osoba, która go zarezerwowała.

Każda jest zrozumiała w izolacji. Dopiero ich połączenie tworzy decyzję.

Musimy określić:

- czy reguły mają priorytety,
- czy odrzucenie przerywa ewaluację,
- czy zbieramy wszystkie powody,
- czy wynik jednej reguły zmienia fakty używane przez kolejne,
- jak wykrywamy sprzeczność,
- jak testujemy cały zestaw.

Martin Fowler ostrzega, że chaining w klasycznych silnikach reguł łatwo prowadzi do ukrytego przepływu sterowania, który jest trudny do zrozumienia i utrzymania [6]. Reguły można czytać pojedynczo i nadal nie rozumieć zachowania całego systemu.

Dlatego przeniesienie `if`-ów do YAML-a nie usuwa złożoności. Czasem tylko sprawia, że IDE przestaje nam w niej pomagać.

---

## Czy potrzebujesz Rule Engine?

Najczęściej nie.

Jeżeli reguła jest stabilna, lokalna i zmieniana razem z aplikacją, zwykła metoda domenowa będzie prostsza, bardziej czytelna i łatwiejsza do debugowania.

Rule Engine, własny DSL albo standard taki jak DMN [7] zaczynają mieć sens, gdy wartość dostarczana przez niezależne modelowanie reguł przewyższa koszt budowy dodatkowego języka, edytora, walidacji, wersjonowania, obserwowalności i narzędzi diagnostycznych.

Dobrym testem jest pytanie:

> Czy potrzebujemy zmieniać, porównywać albo odtwarzać reguły niezależnie od cyklu wdrażania aplikacji?

Jeżeli odpowiedź brzmi "nie", zostań przy kodzie. Nie ma medalu za zamianę trzech warunków na platformę decyzyjną.

Jeżeli odpowiedź brzmi "tak", nie zaczynaj od wyboru silnika. Zacznij od modelu:

- Jak identyfikujemy regułę?
- Jak definiujemy fakty?
- Jak przechowujemy wersje?
- Jak wybieramy wersję dla konkretnego czasu?
- Jak wyjaśniamy wynik?
- Jak rozwiązujemy konflikty?
- Jak testujemy zestawy reguł na danych zbliżonych do produkcyjnych?

Technologia jest ostatnią częścią odpowiedzi.

---

## Reguła nie jest kodem

Pierwszy `if` w systemie bibliotecznym był poprawny. Problemem nie było jego użycie. Problem pojawiłby się dopiero wtedy, gdy wymaganie przestało być prostym warunkiem, a my nadal traktowalibyśmy je jak lokalny szczegół implementacyjny.

Reguła biznesowa nie jest kodem. Kod jest jednym ze sposobów jej wykonania.

Dopóki reguła jest prosta i stabilna, `if` może być najlepszym modelem, jakiego potrzebujesz. Kiedy jednak zaczyna mieć właściciela, źródło, wersję, okres obowiązywania i własną historię decyzji, przestaje być fragmentem sterowania programem. Staje się pełnoprawnym elementem domeny.

System, który potrafi podać wynik, ale nie potrafi wskazać reguły, która do niego doprowadziła, nie automatyzuje polityki biznesowej. On ją tylko ukrywa.

---

#### Linki do źródeł:

* [[1] Business Rules Group, "The Business Rules Manifesto", wersja 2.0](https://www.businessrulesgroup.org/brmanifesto.htm)
* [[2] Eric Evans, Martin Fowler, "Specifications"](https://martinfowler.com/apsupp/spec.pdf)
* [[3] Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, "Design Patterns: Elements of Reusable Object-Oriented Software"](https://www.pearson.com/en-us/subject-catalog/p/design-patterns-elements-of-reusable-object-oriented-software/P200000009480)
* [[4] Jim Arlow, Ila Neustadt, "Enterprise Patterns and MDA", rozdział 12: Rule archetype pattern](https://www.oreilly.com/library/view/enterprise-patterns-and/032111230X/ch12.html)
* [[5] Martin Fowler, "Temporal Patterns"](https://martinfowler.com/eaaDev/timeNarrative.html)
* [[6] Martin Fowler, "Rules Engine"](https://martinfowler.com/bliki/RulesEngine.html)
* [[7] Object Management Group, "Decision Model and Notation"](https://www.omg.org/spec/DMN/)
