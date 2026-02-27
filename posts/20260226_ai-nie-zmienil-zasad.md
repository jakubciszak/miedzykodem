# Co jeśli AI nie zmienił zasad gry, tylko po prostu ją przyspieszył?

tagi: "architektura", "AI", "ewolucja oprogramowania"

Boehm pokazał dekady temu, że koszt zmiany rośnie wykładniczo wraz z fazą projektu [1]. Fowler dokumentował, jak architektura rozpada się wtedy, kiedy nie patrzysz — powoli, niezauważalnie, jak rzeka podmywająca brzeg [2]. Wardley rysował mapy ewolucji komponentów od eksperymentu Pioniera przez dojrzały Produkt do Commodity [3]. Każdy z nich mówił coś innego, ale wszyscy wskazywali na jedno: ewolucja jest nieuchronna. Pytanie tylko, czy będziesz ją prowadzić świadomie.

Dziś obserwujemy coś niepokojącego. Większość deweloperów korzystających z AI staje się, mimowolnie, Pionierami w rozumieniu Wardleya — budujemy custom rozwiązania do problemów, które mają już produktowe odpowiedzi, bo AI generuje kod szybciej, niż zdążymy zapytać: "czy to już gdzieś istnieje?"

Na mapie Wardleya powinniśmy operować w strefie Product albo Commodity, a zachowujemy się jak startup w trybie permanentnego Genesis.

Mam też nieodparte wrażenie, że systemy przestają przechodzić przez fazę ewolucji. Normalny cykl życia to intensywny rozwój, potem refaktoring i dojrzewanie, potem stabilne utrzymanie. Projekty pisane przez agentów dojrzewają inaczej: intensywny rozwój, a zaraz po nim utrzymanie. Faza ewolucji znika — nie dlatego, że rozwiązaliśmy problem długu technicznego, ale dlatego, że kod narasta tak szybko, że nie ma kiedy go pielęgnować. System trafia na OIOM zanim skończy pierwsze urodziny.

Pytanie nie brzmi "czy używać AI". Brzmi: czy budujemy odpowiednią kulturę i procesy, które pomogą nam chronić się przed zagrożeniami, przed którymi, już dawno, przestrzegali nas mądrzy ludzie? Tempo w jakim powstają nowe funkcjonalności jest imponujące, ale tempo w jakim systemy erodują jest przerażające.

(Tak, używam długich pauz "—", bo robiłem to jeszcze przed LLMami)

---

#### Linki do źródeł:

* [[1] Barry Boehm, "Software Engineering Economics"](https://www.academia.edu/108567971/B_W_Boehm_software_engineering_economi)
* [[2] Martin Fowler, "Is High Quality Software Worth the Cost?"](https://martinfowler.com/articles/is-quality-worth-cost.html)
* [[3] Simon Wardley, "Wardley Maps"](https://learnwardleymapping.com)
