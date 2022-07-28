# Ventistål Slideshow!

Ventistål Slideshow er en node server som lar deg kjøre slideshows på alle mulige enheter så lenge de har støtte for wifi og har en browser!

### Avhengigheter

* NodeJS

### Installering

* Installer node (https://nodejs.org/en/)
* Installer node dependencies
```
npm install --silent
```

## Dokumentasjon

For å starte serveren skriver du:
```
npm run start
```

For å stoppe serveren trykker du på `Ctrl + C`, da får du spørsmål om du vil "Terminate batch job (Y/N)?" da svarer du med "Y". Deretter skriver du:
```
npm run cleanup
```
Dette vil sørge for at serveren er helt nede.


## Funksjonalitet

Serveren starter på port 5500.

Alle byggene har sin egen mappe, her kan du legge bilde og video filer. Disse vises da på slideshowet til dette byggets del av serveren.

Alle byggene har også sin egen config. Du finner den i samme mappe som filene du skal vise på slideshowet. Her kan du velge om du skal ha looping av eller på og hvor mange sekunder delay det skal være mellom hvert bilde/video.

Du kan også endre delayet og looping live i URLen til bygget.
Eksempel:
```
http://localhost:5500/Bergen?loop=true&slideDelay=15
```
Her kan du bytte ut 15 med 20 så bytter den delayet til 20 i stedet.
