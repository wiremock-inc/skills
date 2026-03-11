> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Response Templating - Random Faker

> Generating random faker values

WireMock Cloud provides a helper to generate random values in a number of different categories.  The `random` helper
generates the random values based on the key provided.  The key is a string that represents the category of the random
value to generate.

## Getting started

To get started with the random faker generation, you first need to create a stub with dynamic response templating
enabled. Once you have response templating enabled, you can use the `random` helper to generate random values using the
following pattern in your stub responses:

```handlebars  theme={null}
{{ random 'Name.firstName' }}
```

<img src="https://mintcdn.com/wiremockinc/EDBJX-5Afnmcqt0d/images/screenshots/random-faker-example.png?fit=max&auto=format&n=EDBJX-5Afnmcqt0d&q=85&s=9432f1c2487e8c52df85224dce65e659" title="Random Faker Example" width="80%" data-path="images/screenshots/random-faker-example.png" />

When you request the stub, the `random` helper will populate those fields with random values based on the key provided.
The above example will generate something that looks similar to the following output:

```json  theme={null}
{
  "id": "b37f9d89c35a6a9d17f5555ffb5bd4646cdb096cd4bf2529dbc00a98b6d0be64",
  "username": "jarvis.gorczany",
  "name": "Dr. Magda Rohan",
  "email": "karol.orn@example.com",
  "ssn": "861-67-1370",
  "company": "Sanford LLC",
  "role": "Supervisor",
  "status": "Idle",
  "last_ip": "132.29.169.80",
  "address": "737 Burma Meadows, North Dolly, IA 37183",
  "phone": {
    "home": "+1 815-419-9640",
    "work": "(502) 606-4468 x3739",
    "mobile": "518-317-6223"
  },
  "avatar": "https://robohash.org/lcgrxnvh.png",
  "spirit_animal": "manatee",
  "favorite_color": "sky blue"
}
```

Every time you request the stub, the `random` helper will generate new random values for the fields based on the key.

## Reference

The following keys are supported for use with the `random` helper:

### Category - Base

#### Key - Address

```handlebars  theme={null}
{{ random 'Address.state' }}
{{ random 'Address.country' }}
{{ random 'Address.streetName' }}
{{ random 'Address.zipCode' }}
{{ random 'Address.postcode' }}
{{ random 'Address.stateAbbr' }}
{{ random 'Address.citySuffix' }}
{{ random 'Address.cityPrefix' }}
{{ random 'Address.city' }}
{{ random 'Address.cityName' }}
{{ random 'Address.latitude' }}
{{ random 'Address.longitude' }}
{{ random 'Address.latLon' }}
{{ random 'Address.lonLat' }}
{{ random 'Address.timeZone' }}
{{ random 'Address.mailBox' }}
{{ random 'Address.streetAddressNumber' }}
{{ random 'Address.streetAddress' }}
{{ random 'Address.secondaryAddress' }}
{{ random 'Address.zipCodePlus4' }}
{{ random 'Address.streetSuffix' }}
{{ random 'Address.streetPrefix' }}
{{ random 'Address.countryCode' }}
{{ random 'Address.buildingNumber' }}
{{ random 'Address.fullAddress' }}
```

#### Key - Ancient

```handlebars  theme={null}
{{ random 'Ancient.god' }}
{{ random 'Ancient.primordial' }}
{{ random 'Ancient.titan' }}
{{ random 'Ancient.hero' }}
```

#### Key - Animal

```handlebars  theme={null}
{{ random 'Animal.name' }}
{{ random 'Animal.species' }}
{{ random 'Animal.genus' }}
{{ random 'Animal.scientificName' }}
```

#### Key - App

```handlebars  theme={null}
{{ random 'App.name' }}
{{ random 'App.version' }}
{{ random 'App.author' }}
```

#### Key - Appliance

```handlebars  theme={null}
{{ random 'Appliance.brand' }}
{{ random 'Appliance.equipment' }}
```

#### Key - Artist

```handlebars  theme={null}
{{ random 'Artist.name' }}
```

#### Key - Australia

```handlebars  theme={null}
{{ random 'Australia.locations' }}
{{ random 'Australia.animals' }}
{{ random 'Australia.states' }}
```

#### Key - Aviation

```handlebars  theme={null}
{{ random 'Aviation.aircraft' }}
{{ random 'Aviation.airport' }}
{{ random 'Aviation.METAR' }}
{{ random 'Aviation.flight' }}
{{ random 'Aviation.airline' }}
```

#### Key - Aws

```handlebars  theme={null}
{{ random 'Aws.region' }}
{{ random 'Aws.accountId' }}
{{ random 'Aws.acmARN' }}
{{ random 'Aws.albARN' }}
{{ random 'Aws.subnetId' }}
{{ random 'Aws.vpcId' }}
{{ random 'Aws.albTargetGroupARN' }}
{{ random 'Aws.route53ZoneId' }}
{{ random 'Aws.securityGroupId' }}
```

#### Key - Azure

```handlebars  theme={null}
{{ random 'Azure.region' }}
{{ random 'Azure.tenantId' }}
{{ random 'Azure.firewall' }}
{{ random 'Azure.virtualWan' }}
{{ random 'Azure.serviceBus' }}
{{ random 'Azure.keyVault' }}
{{ random 'Azure.subscriptionId' }}
{{ random 'Azure.resourceGroup' }}
{{ random 'Azure.managementGroup' }}
{{ random 'Azure.applicationGateway' }}
{{ random 'Azure.bastionHost' }}
{{ random 'Azure.loadBalancer' }}
{{ random 'Azure.networkSecurityGroup' }}
{{ random 'Azure.virtualNetwork' }}
{{ random 'Azure.appServiceEnvironment' }}
{{ random 'Azure.appServicePlan' }}
{{ random 'Azure.loadTesting' }}
{{ random 'Azure.staticWebApp' }}
{{ random 'Azure.virtualMachine' }}
{{ random 'Azure.storageAccount' }}
{{ random 'Azure.containerRegistry' }}
{{ random 'Azure.containerApps' }}
{{ random 'Azure.containerAppsEnvironment' }}
{{ random 'Azure.containerInstance' }}
{{ random 'Azure.cosmosDBDatabase' }}
{{ random 'Azure.sqlDatabase' }}
{{ random 'Azure.mysqlDatabase' }}
{{ random 'Azure.postgreSQLDatabase' }}
{{ random 'Azure.serviceBusQueue' }}
{{ random 'Azure.serviceBusTopic' }}
{{ random 'Azure.logAnalytics' }}
```

#### Key - Barcode

```handlebars  theme={null}
{{ random 'Barcode.type' }}
{{ random 'Barcode.ean8' }}
{{ random 'Barcode.gtin8' }}
{{ random 'Barcode.gtin13' }}
{{ random 'Barcode.ean13' }}
{{ random 'Barcode.gtin14' }}
{{ random 'Barcode.gtin12' }}
```

#### Key - BloodType

```handlebars  theme={null}
{{ random 'BloodType.aboTypes' }}
{{ random 'BloodType.rhTypes' }}
{{ random 'BloodType.pTypes' }}
{{ random 'BloodType.bloodGroup' }}
```

#### Key - Book

```handlebars  theme={null}
{{ random 'Book.title' }}
{{ random 'Book.author' }}
{{ random 'Book.publisher' }}
{{ random 'Book.genre' }}
```

#### Key - Bool

```handlebars  theme={null}
{{ random 'Bool.bool' }}
```

#### Key - Business

```handlebars  theme={null}
{{ random 'Business.creditCardNumber' }}
{{ random 'Business.creditCardType' }}
{{ random 'Business.creditCardExpiry' }}
{{ random 'Business.securityCode' }}
```

#### Key - CNPJ

```handlebars  theme={null}
{{ random 'CNPJ.valid' }}
{{ random 'CNPJ.invalid' }}
```

#### Key - CPF

```handlebars  theme={null}
{{ random 'CPF.valid' }}
{{ random 'CPF.invalid' }}
```

#### Key - Camera

```handlebars  theme={null}
{{ random 'Camera.brand' }}
{{ random 'Camera.model' }}
{{ random 'Camera.brandWithModel' }}
```

#### Key - Cannabis

```handlebars  theme={null}
{{ random 'Cannabis.types' }}
{{ random 'Cannabis.strains' }}
{{ random 'Cannabis.terpenes' }}
{{ random 'Cannabis.categories' }}
{{ random 'Cannabis.buzzwords' }}
{{ random 'Cannabis.brands' }}
{{ random 'Cannabis.cannabinoidAbbreviations' }}
{{ random 'Cannabis.cannabinoids' }}
{{ random 'Cannabis.medicalUses' }}
{{ random 'Cannabis.healthBenefits' }}
```

#### Key - Cat

```handlebars  theme={null}
{{ random 'Cat.name' }}
{{ random 'Cat.breed' }}
{{ random 'Cat.registry' }}
```

#### Key - Chiquito

```handlebars  theme={null}
{{ random 'Chiquito.terms' }}
{{ random 'Chiquito.sentences' }}
{{ random 'Chiquito.jokes' }}
{{ random 'Chiquito.expressions' }}
```

#### Key - Code

```handlebars  theme={null}
{{ random 'Code.asin' }}
{{ random 'Code.isbnGs1' }}
{{ random 'Code.isbnGroup' }}
{{ random 'Code.isbn10' }}
{{ random 'Code.isbn13' }}
{{ random 'Code.imei' }}
{{ random 'Code.ean8' }}
{{ random 'Code.gtin8' }}
{{ random 'Code.gtin13' }}
{{ random 'Code.ean13' }}
{{ random 'Code.isbnRegistrant' }}
```

#### Key - Coin

```handlebars  theme={null}
{{ random 'Coin.flip' }}
```

#### Key - Color

```handlebars  theme={null}
{{ random 'Color.name' }}
{{ random 'Color.hex' }}
```

#### Key - Commerce

```handlebars  theme={null}
{{ random 'Commerce.brand' }}
{{ random 'Commerce.department' }}
{{ random 'Commerce.material' }}
{{ random 'Commerce.vendor' }}
{{ random 'Commerce.price' }}
{{ random 'Commerce.productName' }}
{{ random 'Commerce.promotionCode' }}
```

#### Key - Community

```handlebars  theme={null}
{{ random 'Community.quote' }}
{{ random 'Community.character' }}
```

#### Key - Company

```handlebars  theme={null}
{{ random 'Company.name' }}
{{ random 'Company.bs' }}
{{ random 'Company.suffix' }}
{{ random 'Company.url' }}
{{ random 'Company.industry' }}
{{ random 'Company.profession' }}
{{ random 'Company.buzzword' }}
{{ random 'Company.logo' }}
{{ random 'Company.catchPhrase' }}
```

#### Key - Compass

```handlebars  theme={null}
{{ random 'Compass.word' }}
{{ random 'Compass.azimuth' }}
{{ random 'Compass.abbreviation' }}
```

#### Key - Computer

```handlebars  theme={null}
{{ random 'Computer.type' }}
{{ random 'Computer.platform' }}
{{ random 'Computer.linux' }}
{{ random 'Computer.macos' }}
{{ random 'Computer.windows' }}
{{ random 'Computer.operatingSystem' }}
```

#### Key - Construction

```handlebars  theme={null}
{{ random 'Construction.materials' }}
{{ random 'Construction.roles' }}
{{ random 'Construction.trades' }}
{{ random 'Construction.heavyEquipment' }}
{{ random 'Construction.subcontractCategories' }}
{{ random 'Construction.standardCostCodes' }}
```

#### Key - Cosmere

```handlebars  theme={null}
{{ random 'Cosmere.aons' }}
{{ random 'Cosmere.shards' }}
{{ random 'Cosmere.surges' }}
{{ random 'Cosmere.metals' }}
{{ random 'Cosmere.heralds' }}
{{ random 'Cosmere.sprens' }}
{{ random 'Cosmere.shardWorlds' }}
{{ random 'Cosmere.knightsRadiant' }}
{{ random 'Cosmere.allomancers' }}
{{ random 'Cosmere.feruchemists' }}
```

#### Key - Country

```handlebars  theme={null}
{{ random 'Country.name' }}
{{ random 'Country.flag' }}
{{ random 'Country.currency' }}
{{ random 'Country.currencyCode' }}
{{ random 'Country.capital' }}
{{ random 'Country.countryCode2' }}
{{ random 'Country.countryCode3' }}
```

#### Key - CryptoCoin

```handlebars  theme={null}
{{ random 'CryptoCoin.coin' }}
```

#### Key - CultureSeries

```handlebars  theme={null}
{{ random 'CultureSeries.books' }}
{{ random 'CultureSeries.civs' }}
{{ random 'CultureSeries.planets' }}
{{ random 'CultureSeries.cultureShips' }}
{{ random 'CultureSeries.cultureShipClasses' }}
{{ random 'CultureSeries.cultureShipClassAbvs' }}
```

#### Key - Currency

```handlebars  theme={null}
{{ random 'Currency.name' }}
{{ random 'Currency.code' }}
```

#### Key - DcComics

```handlebars  theme={null}
{{ random 'DcComics.name' }}
{{ random 'DcComics.hero' }}
{{ random 'DcComics.heroine' }}
{{ random 'DcComics.villain' }}
{{ random 'DcComics.title' }}
```

#### Key - Demographic

```handlebars  theme={null}
{{ random 'Demographic.race' }}
{{ random 'Demographic.demonym' }}
{{ random 'Demographic.sex' }}
{{ random 'Demographic.educationalAttainment' }}
{{ random 'Demographic.maritalStatus' }}
```

#### Key - Device

```handlebars  theme={null}
{{ random 'Device.platform' }}
{{ random 'Device.modelName' }}
{{ random 'Device.serial' }}
{{ random 'Device.manufacturer' }}
```

#### Key - Disease

```handlebars  theme={null}
{{ random 'Disease.ophthalmologyAndOtorhinolaryngology' }}
{{ random 'Disease.neurology' }}
{{ random 'Disease.surgery' }}
{{ random 'Disease.internalDisease' }}
{{ random 'Disease.paediatrics' }}
{{ random 'Disease.gynecologyAndObstetrics' }}
{{ random 'Disease.dermatolory' }}
```

#### Key - Dog

```handlebars  theme={null}
{{ random 'Dog.name' }}
{{ random 'Dog.size' }}
{{ random 'Dog.breed' }}
{{ random 'Dog.sound' }}
{{ random 'Dog.memePhrase' }}
{{ random 'Dog.age' }}
{{ random 'Dog.coatLength' }}
{{ random 'Dog.gender' }}
```

#### Key - Drone

```handlebars  theme={null}
{{ random 'Drone.name' }}
{{ random 'Drone.iso' }}
{{ random 'Drone.weight' }}
{{ random 'Drone.flightTime' }}
{{ random 'Drone.maxSpeed' }}
{{ random 'Drone.maxAscentSpeed' }}
{{ random 'Drone.maxDescentSpeed' }}
{{ random 'Drone.maxAltitude' }}
{{ random 'Drone.maxFlightDistance' }}
{{ random 'Drone.maxWindResistance' }}
{{ random 'Drone.maxAngularVelocity' }}
{{ random 'Drone.maxTiltAngle' }}
{{ random 'Drone.operatingTemperature' }}
{{ random 'Drone.batteryCapacity' }}
{{ random 'Drone.batteryVoltage' }}
{{ random 'Drone.batteryType' }}
{{ random 'Drone.batteryWeight' }}
{{ random 'Drone.chargingTemperature' }}
{{ random 'Drone.maxChargingPower' }}
{{ random 'Drone.maxResolution' }}
{{ random 'Drone.photoFormat' }}
{{ random 'Drone.videoFormat' }}
{{ random 'Drone.maxShutterSpeed' }}
{{ random 'Drone.minShutterSpeed' }}
{{ random 'Drone.shutterSpeedUnits' }}
```

#### Key - DungeonsAndDragons

```handlebars  theme={null}
{{ random 'DungeonsAndDragons.alignments' }}
{{ random 'DungeonsAndDragons.cities' }}
{{ random 'DungeonsAndDragons.klasses' }}
{{ random 'DungeonsAndDragons.languages' }}
{{ random 'DungeonsAndDragons.monsters' }}
{{ random 'DungeonsAndDragons.races' }}
{{ random 'DungeonsAndDragons.backgrounds' }}
{{ random 'DungeonsAndDragons.meleeWeapons' }}
{{ random 'DungeonsAndDragons.rangedWeapons' }}
```

#### Key - Educator

```handlebars  theme={null}
{{ random 'Educator.course' }}
{{ random 'Educator.campus' }}
{{ random 'Educator.university' }}
{{ random 'Educator.subjectWithNumber' }}
{{ random 'Educator.secondarySchool' }}
```

#### Key - EldenRing

```handlebars  theme={null}
{{ random 'EldenRing.location' }}
{{ random 'EldenRing.weapon' }}
{{ random 'EldenRing.skill' }}
{{ random 'EldenRing.spell' }}
{{ random 'EldenRing.npc' }}
```

#### Key - ElectricalComponents

```handlebars  theme={null}
{{ random 'ElectricalComponents.active' }}
{{ random 'ElectricalComponents.passive' }}
{{ random 'ElectricalComponents.electromechanical' }}
```

#### Key - Emoji

```handlebars  theme={null}
{{ random 'Emoji.cat' }}
{{ random 'Emoji.smiley' }}
```

#### Key - FamousLastWords

```handlebars  theme={null}
{{ random 'FamousLastWords.lastWords' }}
```

#### Key - File

```handlebars  theme={null}
{{ random 'File.fileName' }}
{{ random 'File.extension' }}
{{ random 'File.mimeType' }}
```

#### Key - Finance

```handlebars  theme={null}
{{ random 'Finance.nyseTicker' }}
{{ random 'Finance.creditCard' }}
{{ random 'Finance.bic' }}
{{ random 'Finance.iban' }}
{{ random 'Finance.nasdaqTicker' }}
{{ random 'Finance.stockMarket' }}
```

#### Key - FreshPrinceOfBelAir

```handlebars  theme={null}
{{ random 'FreshPrinceOfBelAir.characters' }}
{{ random 'FreshPrinceOfBelAir.quotes' }}
{{ random 'FreshPrinceOfBelAir.celebrities' }}
```

#### Key - FunnyName

```handlebars  theme={null}
{{ random 'FunnyName.name' }}
```

#### Key - GarmentSize

```handlebars  theme={null}
{{ random 'GarmentSize.size' }}
```

#### Key - Gender

```handlebars  theme={null}
{{ random 'Gender.types' }}
{{ random 'Gender.binaryTypes' }}
{{ random 'Gender.shortBinaryTypes' }}
```

#### Key - GratefulDead

```handlebars  theme={null}
{{ random 'GratefulDead.players' }}
{{ random 'GratefulDead.songs' }}
```

#### Key - GreekPhilosopher

```handlebars  theme={null}
{{ random 'GreekPhilosopher.name' }}
{{ random 'GreekPhilosopher.quote' }}
```

#### Key - Hacker

```handlebars  theme={null}
{{ random 'Hacker.noun' }}
{{ random 'Hacker.ingverb' }}
{{ random 'Hacker.adjective' }}
{{ random 'Hacker.verb' }}
{{ random 'Hacker.abbreviation' }}
```

#### Key - Hashing

```handlebars  theme={null}
{{ random 'Hashing.md2' }}
{{ random 'Hashing.md5' }}
{{ random 'Hashing.sha1' }}
{{ random 'Hashing.sha384' }}
{{ random 'Hashing.sha256' }}
{{ random 'Hashing.sha512' }}
```

#### Key - Hipster

```handlebars  theme={null}
{{ random 'Hipster.word' }}
```

#### Key - Hobby

```handlebars  theme={null}
{{ random 'Hobby.activity' }}
```

#### Key - Hololive

```handlebars  theme={null}
{{ random 'Hololive.talent' }}
```

#### Key - Horse

```handlebars  theme={null}
{{ random 'Horse.name' }}
{{ random 'Horse.breed' }}
```

#### Key - House

```handlebars  theme={null}
{{ random 'House.room' }}
{{ random 'House.furniture' }}
```

#### Key - IdNumber

```handlebars  theme={null}
{{ random 'IdNumber.valid' }}
{{ random 'IdNumber.invalid' }}
{{ random 'IdNumber.ssnValid' }}
{{ random 'IdNumber.validPtNif' }}
{{ random 'IdNumber.validSvSeSsn' }}
{{ random 'IdNumber.validEnZaSsn' }}
{{ random 'IdNumber.inValidEnZaSsn' }}
{{ random 'IdNumber.invalidSvSeSsn' }}
{{ random 'IdNumber.singaporeanFin' }}
{{ random 'IdNumber.singaporeanFinBefore2000' }}
{{ random 'IdNumber.singaporeanUin' }}
{{ random 'IdNumber.singaporeanUinBefore2000' }}
{{ random 'IdNumber.validZhCNSsn' }}
{{ random 'IdNumber.invalidPtNif' }}
{{ random 'IdNumber.validEsMXSsn' }}
{{ random 'IdNumber.invalidEsMXSsn' }}
{{ random 'IdNumber.peselNumber' }}
```

#### Key - IndustrySegments

```handlebars  theme={null}
{{ random 'IndustrySegments.industry' }}
{{ random 'IndustrySegments.sector' }}
{{ random 'IndustrySegments.subSector' }}
{{ random 'IndustrySegments.superSector' }}
```

#### Key - Internet

```handlebars  theme={null}
{{ random 'Internet.url' }}
{{ random 'Internet.port' }}
{{ random 'Internet.image' }}
{{ random 'Internet.domainWord' }}
{{ random 'Internet.httpMethod' }}
{{ random 'Internet.macAddress' }}
{{ random 'Internet.ipV4Cidr' }}
{{ random 'Internet.ipV6Cidr' }}
{{ random 'Internet.uuidv3' }}
{{ random 'Internet.userAgent' }}
{{ random 'Internet.slug' }}
{{ random 'Internet.uuid' }}
{{ random 'Internet.domainName' }}
{{ random 'Internet.password' }}
{{ random 'Internet.emailAddress' }}
{{ random 'Internet.safeEmailAddress' }}
{{ random 'Internet.ipV4Address' }}
{{ random 'Internet.getIpV4Address' }}
{{ random 'Internet.privateIpV4Address' }}
{{ random 'Internet.getPrivateIpV4Address' }}
{{ random 'Internet.publicIpV4Address' }}
{{ random 'Internet.getPublicIpV4Address' }}
{{ random 'Internet.ipV6Address' }}
{{ random 'Internet.getIpV6Address' }}
{{ random 'Internet.botUserAgentAny' }}
{{ random 'Internet.domainSuffix' }}
```

#### Key - Job

```handlebars  theme={null}
{{ random 'Job.position' }}
{{ random 'Job.field' }}
{{ random 'Job.seniority' }}
{{ random 'Job.keySkills' }}
{{ random 'Job.title' }}
```

#### Key - Kpop

```handlebars  theme={null}
{{ random 'Kpop.iGroups' }}
{{ random 'Kpop.iiGroups' }}
{{ random 'Kpop.iiiGroups' }}
{{ random 'Kpop.girlGroups' }}
{{ random 'Kpop.boyBands' }}
{{ random 'Kpop.solo' }}
```

#### Key - Lorem

```handlebars  theme={null}
{{ random 'Lorem.words' }}
{{ random 'Lorem.word' }}
{{ random 'Lorem.character' }}
{{ random 'Lorem.sentence' }}
{{ random 'Lorem.paragraph' }}
{{ random 'Lorem.characters' }}
```

#### Key - Marketing

```handlebars  theme={null}
{{ random 'Marketing.buzzwords' }}
```

#### Key - Matz

```handlebars  theme={null}
{{ random 'Matz.quote' }}
```

#### Key - Mbti

```handlebars  theme={null}
{{ random 'Mbti.name' }}
{{ random 'Mbti.type' }}
{{ random 'Mbti.personage' }}
{{ random 'Mbti.merit' }}
{{ random 'Mbti.weakness' }}
{{ random 'Mbti.characteristic' }}
```

#### Key - Measurement

```handlebars  theme={null}
{{ random 'Measurement.length' }}
{{ random 'Measurement.height' }}
{{ random 'Measurement.weight' }}
{{ random 'Measurement.volume' }}
{{ random 'Measurement.metricHeight' }}
{{ random 'Measurement.metricLength' }}
{{ random 'Measurement.metricVolume' }}
{{ random 'Measurement.metricWeight' }}
```

#### Key - Medical

```handlebars  theme={null}
{{ random 'Medical.symptoms' }}
{{ random 'Medical.medicineName' }}
{{ random 'Medical.diseaseName' }}
{{ random 'Medical.hospitalName' }}
{{ random 'Medical.diagnosisCode' }}
{{ random 'Medical.procedureCode' }}
```

#### Key - Military

```handlebars  theme={null}
{{ random 'Military.armyRank' }}
{{ random 'Military.navyRank' }}
{{ random 'Military.marinesRank' }}
{{ random 'Military.airForceRank' }}
{{ random 'Military.dodPaygrade' }}
```

#### Key - Money

```handlebars  theme={null}
{{ random 'Money.currency' }}
{{ random 'Money.currencyCode' }}
```

#### Key - Mood

```handlebars  theme={null}
{{ random 'Mood.feeling' }}
{{ random 'Mood.emotion' }}
{{ random 'Mood.tone' }}
```

#### Key - Mountain

```handlebars  theme={null}
{{ random 'Mountain.name' }}
{{ random 'Mountain.range' }}
```

#### Key - Mountaineering

```handlebars  theme={null}
{{ random 'Mountaineering.mountaineer' }}
```

#### Key - Music

```handlebars  theme={null}
{{ random 'Music.key' }}
{{ random 'Music.instrument' }}
{{ random 'Music.chord' }}
{{ random 'Music.genre' }}
```

#### Key - Name

```handlebars  theme={null}
{{ random 'Name.name' }}
{{ random 'Name.prefix' }}
{{ random 'Name.suffix' }}
{{ random 'Name.lastName' }}
{{ random 'Name.fullName' }}
{{ random 'Name.firstName' }}
{{ random 'Name.title' }}
{{ random 'Name.username' }}
{{ random 'Name.nameWithMiddle' }}
```

#### Key - Nation

```handlebars  theme={null}
{{ random 'Nation.flag' }}
{{ random 'Nation.language' }}
{{ random 'Nation.isoCountry' }}
{{ random 'Nation.nationality' }}
{{ random 'Nation.capitalCity' }}
{{ random 'Nation.isoLanguage' }}
```

#### Key - NatoPhoneticAlphabet

```handlebars  theme={null}
{{ random 'NatoPhoneticAlphabet.codeWord' }}
```

#### Key - Nigeria

```handlebars  theme={null}
{{ random 'Nigeria.name' }}
{{ random 'Nigeria.places' }}
{{ random 'Nigeria.schools' }}
{{ random 'Nigeria.food' }}
{{ random 'Nigeria.celebrities' }}
```

#### Key - Number

```handlebars  theme={null}
{{ random 'Number.digit' }}
{{ random 'Number.negative' }}
{{ random 'Number.positive' }}
{{ random 'Number.randomDigit' }}
{{ random 'Number.randomDigitNotZero' }}
{{ random 'Number.randomNumber' }}
```

#### Key - Passport

```handlebars  theme={null}
{{ random 'Passport.valid' }}
```

#### Key - PhoneNumber

```handlebars  theme={null}
{{ random 'PhoneNumber.extension' }}
{{ random 'PhoneNumber.cellPhone' }}
{{ random 'PhoneNumber.phoneNumberInternational' }}
{{ random 'PhoneNumber.phoneNumberNational' }}
{{ random 'PhoneNumber.subscriberNumber' }}
{{ random 'PhoneNumber.phoneNumber' }}
```

#### Key - Photography

```handlebars  theme={null}
{{ random 'Photography.iso' }}
{{ random 'Photography.brand' }}
{{ random 'Photography.genre' }}
{{ random 'Photography.lens' }}
{{ random 'Photography.imageTag' }}
{{ random 'Photography.aperture' }}
{{ random 'Photography.shutter' }}
{{ random 'Photography.camera' }}
{{ random 'Photography.term' }}
```

#### Key - ProgrammingLanguage

```handlebars  theme={null}
{{ random 'ProgrammingLanguage.name' }}
{{ random 'ProgrammingLanguage.creator' }}
```

#### Key - Relationship

```handlebars  theme={null}
{{ random 'Relationship.parent' }}
{{ random 'Relationship.inLaw' }}
{{ random 'Relationship.spouse' }}
{{ random 'Relationship.sibling' }}
```

#### Key - Restaurant

```handlebars  theme={null}
{{ random 'Restaurant.name' }}
{{ random 'Restaurant.type' }}
{{ random 'Restaurant.description' }}
{{ random 'Restaurant.namePrefix' }}
{{ random 'Restaurant.nameSuffix' }}
{{ random 'Restaurant.review' }}
```

#### Key - Robin

```handlebars  theme={null}
{{ random 'Robin.quote' }}
```

#### Key - RockBand

```handlebars  theme={null}
{{ random 'RockBand.name' }}
```

#### Key - Science

```handlebars  theme={null}
{{ random 'Science.element' }}
{{ random 'Science.unit' }}
{{ random 'Science.scientist' }}
{{ random 'Science.tool' }}
{{ random 'Science.quark' }}
{{ random 'Science.leptons' }}
{{ random 'Science.bosons' }}
{{ random 'Science.elementSymbol' }}
```

#### Key - Shakespeare

```handlebars  theme={null}
{{ random 'Shakespeare.hamletQuote' }}
{{ random 'Shakespeare.asYouLikeItQuote' }}
{{ random 'Shakespeare.kingRichardIIIQuote' }}
{{ random 'Shakespeare.romeoAndJulietQuote' }}
```

#### Key - Sip

```handlebars  theme={null}
{{ random 'Sip.method' }}
{{ random 'Sip.rtpPort' }}
{{ random 'Sip.bodyString' }}
{{ random 'Sip.bodyBytes' }}
{{ random 'Sip.contentType' }}
{{ random 'Sip.messagingPort' }}
{{ random 'Sip.provisionalResponseCode' }}
{{ random 'Sip.successResponseCode' }}
{{ random 'Sip.redirectResponseCode' }}
{{ random 'Sip.clientErrorResponseCode' }}
{{ random 'Sip.serverErrorResponseCode' }}
{{ random 'Sip.globalErrorResponseCode' }}
{{ random 'Sip.provisionalResponsePhrase' }}
{{ random 'Sip.successResponsePhrase' }}
{{ random 'Sip.redirectResponsePhrase' }}
{{ random 'Sip.clientErrorResponsePhrase' }}
{{ random 'Sip.serverErrorResponsePhrase' }}
{{ random 'Sip.globalErrorResponsePhrase' }}
{{ random 'Sip.nameAddress' }}
```

#### Key - Size

```handlebars  theme={null}
{{ random 'Size.adjective' }}
```

#### Key - SlackEmoji

```handlebars  theme={null}
{{ random 'SlackEmoji.people' }}
{{ random 'SlackEmoji.nature' }}
{{ random 'SlackEmoji.custom' }}
{{ random 'SlackEmoji.activity' }}
{{ random 'SlackEmoji.emoji' }}
{{ random 'SlackEmoji.foodAndDrink' }}
{{ random 'SlackEmoji.celebration' }}
{{ random 'SlackEmoji.travelAndPlaces' }}
{{ random 'SlackEmoji.objectsAndSymbols' }}
```

#### Key - Space

```handlebars  theme={null}
{{ random 'Space.planet' }}
{{ random 'Space.moon' }}
{{ random 'Space.galaxy' }}
{{ random 'Space.nebula' }}
{{ random 'Space.star' }}
{{ random 'Space.agency' }}
{{ random 'Space.meteorite' }}
{{ random 'Space.company' }}
{{ random 'Space.starCluster' }}
{{ random 'Space.constellation' }}
{{ random 'Space.agencyAbbreviation' }}
{{ random 'Space.nasaSpaceCraft' }}
{{ random 'Space.distanceMeasurement' }}
```

#### Key - Stock

```handlebars  theme={null}
{{ random 'Stock.nsdqSymbol' }}
{{ random 'Stock.nyseSymbol' }}
```

#### Key - Subscription

```handlebars  theme={null}
{{ random 'Subscription.plans' }}
{{ random 'Subscription.statuses' }}
{{ random 'Subscription.paymentMethods' }}
{{ random 'Subscription.subscriptionTerms' }}
{{ random 'Subscription.paymentTerms' }}
```

#### Key - Superhero

```handlebars  theme={null}
{{ random 'Superhero.name' }}
{{ random 'Superhero.prefix' }}
{{ random 'Superhero.suffix' }}
{{ random 'Superhero.descriptor' }}
{{ random 'Superhero.power' }}
```

#### Key - Team

```handlebars  theme={null}
{{ random 'Team.name' }}
{{ random 'Team.state' }}
{{ random 'Team.sport' }}
{{ random 'Team.creature' }}
```

#### Key - Text

```handlebars  theme={null}
{{ random 'Text.text' }}
{{ random 'Text.character' }}
{{ random 'Text.uppercaseCharacter' }}
{{ random 'Text.lowercaseCharacter' }}
```

#### Key - Tron

```handlebars  theme={null}
{{ random 'Tron.location' }}
{{ random 'Tron.quote' }}
{{ random 'Tron.character' }}
{{ random 'Tron.game' }}
{{ random 'Tron.tagline' }}
{{ random 'Tron.vehicle' }}
{{ random 'Tron.alternateCharacterSpelling' }}
```

#### Key - Twitter

```handlebars  theme={null}
{{ random 'Twitter.userName' }}
{{ random 'Twitter.userId' }}
```

#### Key - University

```handlebars  theme={null}
{{ random 'University.name' }}
{{ random 'University.prefix' }}
{{ random 'University.suffix' }}
```

#### Key - Vehicle

```handlebars  theme={null}
{{ random 'Vehicle.make' }}
{{ random 'Vehicle.color' }}
{{ random 'Vehicle.style' }}
{{ random 'Vehicle.vin' }}
{{ random 'Vehicle.upholstery' }}
{{ random 'Vehicle.driveType' }}
{{ random 'Vehicle.fuelType' }}
{{ random 'Vehicle.carType' }}
{{ random 'Vehicle.engine' }}
{{ random 'Vehicle.carOptions' }}
{{ random 'Vehicle.doors' }}
{{ random 'Vehicle.model' }}
{{ random 'Vehicle.manufacturer' }}
{{ random 'Vehicle.makeAndModel' }}
{{ random 'Vehicle.upholsteryColor' }}
{{ random 'Vehicle.upholsteryFabric' }}
{{ random 'Vehicle.transmission' }}
{{ random 'Vehicle.standardSpecs' }}
{{ random 'Vehicle.licensePlate' }}
```

#### Key - Verb

```handlebars  theme={null}
{{ random 'Verb.base' }}
{{ random 'Verb.ingForm' }}
{{ random 'Verb.past' }}
{{ random 'Verb.pastParticiple' }}
{{ random 'Verb.simplePresent' }}
```

#### Key - Weather

```handlebars  theme={null}
{{ random 'Weather.description' }}
{{ random 'Weather.temperatureCelsius' }}
{{ random 'Weather.temperatureFahrenheit' }}
```

#### Key - Yoda

```handlebars  theme={null}
{{ random 'Yoda.quote' }}
```

### Category - Food

#### Key - Beer

```handlebars  theme={null}
{{ random 'Beer.name' }}
{{ random 'Beer.style' }}
{{ random 'Beer.hop' }}
{{ random 'Beer.yeast' }}
{{ random 'Beer.malt' }}
```

#### Key - Coffee

```handlebars  theme={null}
{{ random 'Coffee.descriptor' }}
{{ random 'Coffee.name1' }}
{{ random 'Coffee.name2' }}
{{ random 'Coffee.body' }}
{{ random 'Coffee.country' }}
{{ random 'Coffee.region' }}
{{ random 'Coffee.variety' }}
{{ random 'Coffee.notes' }}
{{ random 'Coffee.blendName' }}
{{ random 'Coffee.intensifier' }}
```

#### Key - Dessert

```handlebars  theme={null}
{{ random 'Dessert.variety' }}
{{ random 'Dessert.topping' }}
{{ random 'Dessert.flavor' }}
```

#### Key - Food

```handlebars  theme={null}
{{ random 'Food.ingredient' }}
{{ random 'Food.spice' }}
{{ random 'Food.dish' }}
{{ random 'Food.fruit' }}
{{ random 'Food.vegetable' }}
{{ random 'Food.sushi' }}
{{ random 'Food.measurement' }}
```

#### Key - Tea

```handlebars  theme={null}
{{ random 'Tea.type' }}
{{ random 'Tea.variety' }}
```

### Category - Movie

#### Key - AquaTeenHungerForce

```handlebars  theme={null}
{{ random 'AquaTeenHungerForce.character' }}
```

#### Key - Avatar

```handlebars  theme={null}
{{ random 'Avatar.image' }}
```

#### Key - Babylon5

```handlebars  theme={null}
{{ random 'Babylon5.quote' }}
{{ random 'Babylon5.character' }}
```

#### Key - BackToTheFuture

```handlebars  theme={null}
{{ random 'BackToTheFuture.quote' }}
{{ random 'BackToTheFuture.date' }}
{{ random 'BackToTheFuture.character' }}
```

#### Key - BigBangTheory

```handlebars  theme={null}
{{ random 'BigBangTheory.quote' }}
{{ random 'BigBangTheory.character' }}
```

#### Key - BojackHorseman

```handlebars  theme={null}
{{ random 'BojackHorseman.characters' }}
{{ random 'BojackHorseman.quotes' }}
{{ random 'BojackHorseman.tongueTwisters' }}
```

#### Key - BossaNova

```handlebars  theme={null}
{{ random 'BossaNova.artist' }}
{{ random 'BossaNova.song' }}
```

#### Key - BreakingBad

```handlebars  theme={null}
{{ random 'BreakingBad.character' }}
{{ random 'BreakingBad.episode' }}
```

#### Key - BrooklynNineNine

```handlebars  theme={null}
{{ random 'BrooklynNineNine.characters' }}
{{ random 'BrooklynNineNine.quotes' }}
```

#### Key - Buffy

```handlebars  theme={null}
{{ random 'Buffy.characters' }}
{{ random 'Buffy.quotes' }}
{{ random 'Buffy.bigBads' }}
{{ random 'Buffy.episodes' }}
{{ random 'Buffy.celebrities' }}
```

#### Key - ChuckNorris

```handlebars  theme={null}
{{ random 'ChuckNorris.fact' }}
```

#### Key - DarkSoul

```handlebars  theme={null}
{{ random 'DarkSoul.classes' }}
{{ random 'DarkSoul.stats' }}
{{ random 'DarkSoul.covenants' }}
{{ random 'DarkSoul.shield' }}
```

#### Key - Departed

```handlebars  theme={null}
{{ random 'Departed.quote' }}
{{ random 'Departed.character' }}
{{ random 'Departed.actor' }}
```

#### Key - DetectiveConan

```handlebars  theme={null}
{{ random 'DetectiveConan.characters' }}
{{ random 'DetectiveConan.gadgets' }}
{{ random 'DetectiveConan.vehicles' }}
```

#### Key - DoctorWho

```handlebars  theme={null}
{{ random 'DoctorWho.quote' }}
{{ random 'DoctorWho.character' }}
{{ random 'DoctorWho.species' }}
{{ random 'DoctorWho.actor' }}
{{ random 'DoctorWho.villain' }}
{{ random 'DoctorWho.doctor' }}
{{ random 'DoctorWho.catchPhrase' }}
```

#### Key - Doraemon

```handlebars  theme={null}
{{ random 'Doraemon.location' }}
{{ random 'Doraemon.character' }}
{{ random 'Doraemon.gadget' }}
```

#### Key - DragonBall

```handlebars  theme={null}
{{ random 'DragonBall.character' }}
```

#### Key - DumbAndDumber

```handlebars  theme={null}
{{ random 'DumbAndDumber.quote' }}
{{ random 'DumbAndDumber.character' }}
{{ random 'DumbAndDumber.actor' }}
```

#### Key - Dune

```handlebars  theme={null}
{{ random 'Dune.quote' }}
{{ random 'Dune.character' }}
{{ random 'Dune.title' }}
{{ random 'Dune.planet' }}
{{ random 'Dune.saying' }}
```

#### Key - FamilyGuy

```handlebars  theme={null}
{{ random 'FamilyGuy.location' }}
{{ random 'FamilyGuy.quote' }}
{{ random 'FamilyGuy.character' }}
```

#### Key - FinalSpace

```handlebars  theme={null}
{{ random 'FinalSpace.quote' }}
{{ random 'FinalSpace.character' }}
{{ random 'FinalSpace.vehicle' }}
```

#### Key - Friends

```handlebars  theme={null}
{{ random 'Friends.location' }}
{{ random 'Friends.quote' }}
{{ random 'Friends.character' }}
```

#### Key - FullmetalAlchemist

```handlebars  theme={null}
{{ random 'FullmetalAlchemist.country' }}
{{ random 'FullmetalAlchemist.character' }}
{{ random 'FullmetalAlchemist.city' }}
```

#### Key - GameOfThrones

```handlebars  theme={null}
{{ random 'GameOfThrones.quote' }}
{{ random 'GameOfThrones.character' }}
{{ random 'GameOfThrones.city' }}
{{ random 'GameOfThrones.house' }}
{{ random 'GameOfThrones.dragon' }}
```

#### Key - Ghostbusters

```handlebars  theme={null}
{{ random 'Ghostbusters.quote' }}
{{ random 'Ghostbusters.character' }}
{{ random 'Ghostbusters.actor' }}
```

#### Key - HarryPotter

```handlebars  theme={null}
{{ random 'HarryPotter.location' }}
{{ random 'HarryPotter.quote' }}
{{ random 'HarryPotter.character' }}
{{ random 'HarryPotter.spell' }}
{{ random 'HarryPotter.book' }}
{{ random 'HarryPotter.house' }}
```

#### Key - HeyArnold

```handlebars  theme={null}
{{ random 'HeyArnold.locations' }}
{{ random 'HeyArnold.characters' }}
{{ random 'HeyArnold.quotes' }}
```

#### Key - HitchhikersGuideToTheGalaxy

```handlebars  theme={null}
{{ random 'HitchhikersGuideToTheGalaxy.location' }}
{{ random 'HitchhikersGuideToTheGalaxy.quote' }}
{{ random 'HitchhikersGuideToTheGalaxy.character' }}
{{ random 'HitchhikersGuideToTheGalaxy.species' }}
{{ random 'HitchhikersGuideToTheGalaxy.planet' }}
{{ random 'HitchhikersGuideToTheGalaxy.starship' }}
{{ random 'HitchhikersGuideToTheGalaxy.marvinQuote' }}
```

#### Key - Hobbit

```handlebars  theme={null}
{{ random 'Hobbit.location' }}
{{ random 'Hobbit.quote' }}
{{ random 'Hobbit.character' }}
{{ random 'Hobbit.thorinsCompany' }}
```

#### Key - HowIMetYourMother

```handlebars  theme={null}
{{ random 'HowIMetYourMother.quote' }}
{{ random 'HowIMetYourMother.character' }}
{{ random 'HowIMetYourMother.highFive' }}
{{ random 'HowIMetYourMother.catchPhrase' }}
```

#### Key - Kaamelott

```handlebars  theme={null}
{{ random 'Kaamelott.quote' }}
{{ random 'Kaamelott.character' }}
```

#### Key - Lebowski

```handlebars  theme={null}
{{ random 'Lebowski.quote' }}
{{ random 'Lebowski.character' }}
{{ random 'Lebowski.actor' }}
```

#### Key - LordOfTheRings

```handlebars  theme={null}
{{ random 'LordOfTheRings.location' }}
{{ random 'LordOfTheRings.character' }}
```

#### Key - MoneyHeist

```handlebars  theme={null}
{{ random 'MoneyHeist.quote' }}
{{ random 'MoneyHeist.character' }}
{{ random 'MoneyHeist.heist' }}
```

#### Key - Movie

```handlebars  theme={null}
{{ random 'Movie.quote' }}
```

#### Key - OnePiece

```handlebars  theme={null}
{{ random 'OnePiece.location' }}
{{ random 'OnePiece.quote' }}
{{ random 'OnePiece.character' }}
{{ random 'OnePiece.sea' }}
{{ random 'OnePiece.island' }}
{{ random 'OnePiece.akumasNoMi' }}
```

#### Key - OscarMovie

```handlebars  theme={null}
{{ random 'OscarMovie.quote' }}
{{ random 'OscarMovie.getYear' }}
{{ random 'OscarMovie.character' }}
{{ random 'OscarMovie.actor' }}
{{ random 'OscarMovie.getChoice' }}
{{ random 'OscarMovie.movieName' }}
{{ random 'OscarMovie.releaseDate' }}
```

#### Key - Pokemon

```handlebars  theme={null}
{{ random 'Pokemon.name' }}
{{ random 'Pokemon.type' }}
{{ random 'Pokemon.location' }}
{{ random 'Pokemon.move' }}
```

#### Key - PrincessBride

```handlebars  theme={null}
{{ random 'PrincessBride.quote' }}
{{ random 'PrincessBride.character' }}
```

#### Key - ResidentEvil

```handlebars  theme={null}
{{ random 'ResidentEvil.location' }}
{{ random 'ResidentEvil.character' }}
{{ random 'ResidentEvil.equipment' }}
{{ random 'ResidentEvil.creature' }}
{{ random 'ResidentEvil.biologicalAgent' }}
```

#### Key - RickAndMorty

```handlebars  theme={null}
{{ random 'RickAndMorty.location' }}
{{ random 'RickAndMorty.quote' }}
{{ random 'RickAndMorty.character' }}
```

#### Key - RuPaulDragRace

```handlebars  theme={null}
{{ random 'RuPaulDragRace.quote' }}
{{ random 'RuPaulDragRace.queen' }}
```

#### Key - Seinfeld

```handlebars  theme={null}
{{ random 'Seinfeld.quote' }}
{{ random 'Seinfeld.character' }}
{{ random 'Seinfeld.business' }}
```

#### Key - Simpsons

```handlebars  theme={null}
{{ random 'Simpsons.location' }}
{{ random 'Simpsons.quote' }}
{{ random 'Simpsons.character' }}
```

#### Key - StarTrek

```handlebars  theme={null}
{{ random 'StarTrek.location' }}
{{ random 'StarTrek.character' }}
{{ random 'StarTrek.species' }}
{{ random 'StarTrek.villain' }}
{{ random 'StarTrek.klingon' }}
```

#### Key - StarWars

```handlebars  theme={null}
{{ random 'StarWars.character' }}
{{ random 'StarWars.species' }}
{{ random 'StarWars.planets' }}
{{ random 'StarWars.quotes' }}
{{ random 'StarWars.callSign' }}
{{ random 'StarWars.vehicles' }}
{{ random 'StarWars.droids' }}
{{ random 'StarWars.alternateCharacterSpelling' }}
{{ random 'StarWars.wookieWords' }}
```

#### Key - StudioGhibli

```handlebars  theme={null}
{{ random 'StudioGhibli.quote' }}
{{ random 'StudioGhibli.character' }}
{{ random 'StudioGhibli.movie' }}
```

#### Key - TheItCrowd

```handlebars  theme={null}
{{ random 'TheItCrowd.characters' }}
{{ random 'TheItCrowd.quotes' }}
{{ random 'TheItCrowd.actors' }}
{{ random 'TheItCrowd.emails' }}
```

#### Key - TwinPeaks

```handlebars  theme={null}
{{ random 'TwinPeaks.location' }}
{{ random 'TwinPeaks.quote' }}
{{ random 'TwinPeaks.character' }}
```

#### Key - Witcher

```handlebars  theme={null}
{{ random 'Witcher.location' }}
{{ random 'Witcher.sign' }}
{{ random 'Witcher.quote' }}
{{ random 'Witcher.character' }}
{{ random 'Witcher.witcher' }}
{{ random 'Witcher.school' }}
{{ random 'Witcher.monster' }}
{{ random 'Witcher.potion' }}
{{ random 'Witcher.book' }}
```

### Category - Sport

#### Key - Baseball

```handlebars  theme={null}
{{ random 'Baseball.positions' }}
{{ random 'Baseball.players' }}
{{ random 'Baseball.teams' }}
{{ random 'Baseball.coaches' }}
```

#### Key - Basketball

```handlebars  theme={null}
{{ random 'Basketball.positions' }}
{{ random 'Basketball.players' }}
{{ random 'Basketball.teams' }}
{{ random 'Basketball.coaches' }}
```

#### Key - Cricket

```handlebars  theme={null}
{{ random 'Cricket.formats' }}
{{ random 'Cricket.players' }}
{{ random 'Cricket.teams' }}
{{ random 'Cricket.tournaments' }}
```

#### Key - EnglandFootBall

```handlebars  theme={null}
{{ random 'EnglandFootBall.team' }}
{{ random 'EnglandFootBall.league' }}
```

#### Key - Football

```handlebars  theme={null}
{{ random 'Football.positions' }}
{{ random 'Football.players' }}
{{ random 'Football.teams' }}
{{ random 'Football.coaches' }}
{{ random 'Football.competitions' }}
```

#### Key - Formula1

```handlebars  theme={null}
{{ random 'Formula1.team' }}
{{ random 'Formula1.driver' }}
{{ random 'Formula1.circuit' }}
{{ random 'Formula1.grandPrix' }}
```

#### Key - Volleyball

```handlebars  theme={null}
{{ random 'Volleyball.position' }}
{{ random 'Volleyball.team' }}
{{ random 'Volleyball.player' }}
{{ random 'Volleyball.coach' }}
{{ random 'Volleyball.formation' }}
```

### Category - Video Games

#### Key - Battlefield1

```handlebars  theme={null}
{{ random 'Battlefield1.map' }}
{{ random 'Battlefield1.classes' }}
{{ random 'Battlefield1.weapon' }}
{{ random 'Battlefield1.vehicle' }}
{{ random 'Battlefield1.faction' }}
```

#### Key - ClashOfClans

```handlebars  theme={null}
{{ random 'ClashOfClans.troop' }}
{{ random 'ClashOfClans.rank' }}
{{ random 'ClashOfClans.defensiveBuilding' }}
```

#### Key - Control

```handlebars  theme={null}
{{ random 'Control.location' }}
{{ random 'Control.quote' }}
{{ random 'Control.character' }}
{{ random 'Control.hiss' }}
{{ random 'Control.theBoard' }}
{{ random 'Control.objectOfPower' }}
{{ random 'Control.alteredItem' }}
{{ random 'Control.alteredWorldEvent' }}
```

#### Key - ElderScrolls

```handlebars  theme={null}
{{ random 'ElderScrolls.quote' }}
{{ random 'ElderScrolls.lastName' }}
{{ random 'ElderScrolls.region' }}
{{ random 'ElderScrolls.race' }}
{{ random 'ElderScrolls.creature' }}
{{ random 'ElderScrolls.firstName' }}
{{ random 'ElderScrolls.city' }}
{{ random 'ElderScrolls.dragon' }}
```

#### Key - Esports

```handlebars  theme={null}
{{ random 'Esports.event' }}
{{ random 'Esports.game' }}
{{ random 'Esports.team' }}
{{ random 'Esports.player' }}
{{ random 'Esports.league' }}
```

#### Key - Fallout

```handlebars  theme={null}
{{ random 'Fallout.location' }}
{{ random 'Fallout.quote' }}
{{ random 'Fallout.character' }}
{{ random 'Fallout.faction' }}
```

#### Key - Hearthstone

```handlebars  theme={null}
{{ random 'Hearthstone.wildRank' }}
{{ random 'Hearthstone.mainProfession' }}
{{ random 'Hearthstone.mainCharacter' }}
{{ random 'Hearthstone.mainPattern' }}
{{ random 'Hearthstone.battlegroundsScore' }}
{{ random 'Hearthstone.standardRank' }}
```

#### Key - HeroesOfTheStorm

```handlebars  theme={null}
{{ random 'HeroesOfTheStorm.quote' }}
{{ random 'HeroesOfTheStorm.hero' }}
{{ random 'HeroesOfTheStorm.heroClass' }}
{{ random 'HeroesOfTheStorm.battleground' }}
```

#### Key - LeagueOfLegends

```handlebars  theme={null}
{{ random 'LeagueOfLegends.location' }}
{{ random 'LeagueOfLegends.quote' }}
{{ random 'LeagueOfLegends.rank' }}
{{ random 'LeagueOfLegends.champion' }}
{{ random 'LeagueOfLegends.masteries' }}
{{ random 'LeagueOfLegends.summonerSpell' }}
```

#### Key - MassEffect

```handlebars  theme={null}
{{ random 'MassEffect.quote' }}
{{ random 'MassEffect.character' }}
{{ random 'MassEffect.planet' }}
{{ random 'MassEffect.specie' }}
{{ random 'MassEffect.cluster' }}
```

#### Key - Minecraft

```handlebars  theme={null}
{{ random 'Minecraft.itemName' }}
{{ random 'Minecraft.tileName' }}
{{ random 'Minecraft.entityName' }}
{{ random 'Minecraft.animalName' }}
{{ random 'Minecraft.monsterName' }}
{{ random 'Minecraft.tileItemName' }}
```

#### Key - Overwatch

```handlebars  theme={null}
{{ random 'Overwatch.location' }}
{{ random 'Overwatch.quote' }}
{{ random 'Overwatch.hero' }}
```

#### Key - SoulKnight

```handlebars  theme={null}
{{ random 'SoulKnight.characters' }}
{{ random 'SoulKnight.buffs' }}
{{ random 'SoulKnight.statues' }}
{{ random 'SoulKnight.weapons' }}
{{ random 'SoulKnight.bosses' }}
{{ random 'SoulKnight.enemies' }}
```

#### Key - StarCraft

```handlebars  theme={null}
{{ random 'StarCraft.unit' }}
{{ random 'StarCraft.character' }}
{{ random 'StarCraft.planet' }}
{{ random 'StarCraft.building' }}
```

#### Key - SuperMario

```handlebars  theme={null}
{{ random 'SuperMario.locations' }}
{{ random 'SuperMario.games' }}
{{ random 'SuperMario.characters' }}
```

#### Key - Touhou

```handlebars  theme={null}
{{ random 'Touhou.trackName' }}
{{ random 'Touhou.gameName' }}
{{ random 'Touhou.characterName' }}
{{ random 'Touhou.characterFirstName' }}
{{ random 'Touhou.characterLastName' }}
```

#### Key - Zelda

```handlebars  theme={null}
{{ random 'Zelda.character' }}
{{ random 'Zelda.game' }}
```

