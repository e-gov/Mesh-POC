## Mikroteenusvõrgu POC

Süsteem on paigaldatud ja töötab kõrgkäideldava mikroteenusvõrguna (mesh).

Süsteemi koosseisus on kaks teenust - "Monkey" ja "Banana". Kumbki teenus on paigaldatud klasterdatult (vt skeem).

Teenus Monkey reageerib pöördumistele (HTTP):

- `/monkey` - elutukseteatega ("Monkey kuuldel")
- `/getbanana` - teeb pöördumise teenuse Banana poole ja edastab sealt saadud vastuse.

Teenus Banana reageerib pöördumistele (HTTP):

- `/banana` - elutukseteatega ("Banana kuuldel")
- `/getbanana` - teatega "Please, your banana!"

Süsteemi poole saab pöörduda läbi Välisliikluse vahendaja (Edge Proxy). Välisliikluse vahendaja (masinas priitp-mesh-1.ci.kit) kuulab pordil `5100` ja marsruudib pöördumise vastavalt URL-iteele (Path):

`/monkey...` - teenusesse Monkey
`/banana...` - teenusesse Banana

Koormusejaotamist ja marsruutimist teevad iga instantsi masinas olevad vahendajad (Proxy) Envoy. Rakendus suhtleb ainult oma masinas oleva Envoy-ga. Rakenduse port on `5000`, kuid masinast välja paistab ainult Envoy port `5100`.

POC-is ei ole teostatud Envoy-de vahelise liikluse kaitsmine HTTPS-ga. Samuti ei ole rakenduse pordid (`5000`) masinast väljast pöördumisele suletud (kuid neid ei kasutata). Toodangupaigalduses loomulikult on vaja HTTPS-i rakendada ja mitteettenähtud pordid sulgeda.


## PAS-POC

PAC-POC on pääsuõiguste moodul, mis on mõeldud kasutamiseks suurema süsteemi koosseisus.

PAC-POC pakub järgmisi teenuseid:
- kasutajate nimekirja pidamine
  - kasutaja konto lisamine
  - kasutajate nimekirja väljastamine
  - kasutaja profiili väljastamine
    - isikukood
    - ees- ja perekonnanimi
    - rollid
  - kasutaja konto sulgemine
  - kasutajale rolli omistamine

PAC-POC kasutatakse pöördumisega PAC-POC API poole.

API on teostatud [gRPC](https://grpc.io/) protokolli kohaselt. Käesolev projekt ongi gPRC kasutuselevõtu _proof-of-concept_.

<img src="grpc-icon-color.png" style="width:50px;">

## Kasutamine

Serveri käivitamine:

```
$ git clone https://github.com/e-gov/PAS-POC
$ cd PAS-POC
$ node PAS-POC
PAS-POC Access Control Server Started
```

Testimine:

kasutaja lisamine:

```
$ node PAS-Test insert "EE55000000000" "Jaan" "Kuusk"
{ opresultmessage: 'OK' }
```

kasutajale rolli andmine:

```
$ node PAS-Test assign "EE55000000000" "admin"
{ opresultmessage: 'OK' }
```

kasutaja profiili väljastamine:

```
$ node PAS-Test get "EE55000000000"
{ roles: [ 'admin' ],
  personcode: 'EE55000000000',
  firstname: 'Jaan',
  lastname: 'Kuusk' }
```

kasutajate nimekirja väljastamine:

```
$ node PAS-Test list
{ users: 
   [ { roles: [],
       personcode: 'EE36100000000',
       firstname: 'Aino',
       lastname: 'Kuusk' },
     { roles: [Object],
       personcode: 'EE55000000000',
       firstname: 'Jaan',
       lastname: 'Kuusk' } ] }
```

## Tehnilised detailid

`PAC-POC.js` - PAC-POC server.

`PAC-Test.js` - rakendus, millega saab PAC-POC-i testida.

`PAS.proto` - protobuf-fail.

Sõltuvused:
- gRPC
- Node.js

