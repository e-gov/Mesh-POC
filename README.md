
klaster `monkey`
  5000, 5001

klaster `banana`
  5002, 5003

`Teenus_1`

curl -H "Host:banana" localhost:5100

## Teenus 2

Teenus 2 on väga lihtne. Ta ootab HTTP GET pöördumisi. Pöördumisele vastab JSON-struktuuriga, milles on teenuse nimi (`Teenus 2`) ja ajamärge (timestamp).

Teenuse käivitamine:

```
cd Teenus_2 && node teenus
```

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

