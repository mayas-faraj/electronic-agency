# Air Condition System

> air condition is using graphql for api, the graphql is post request that contains json data, the json data always contain data object that contains the operation name and inside it the data if exists, and it maybe container errors object if there are errors during operation.

## user signup

first stage, we will create a non-verified user with the basic info, the phone is required, the request schema take this shape:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createClient(input: {phone: \"0933112233\", email: \"master@nomail.com\", namePrefix: \"Ms.\", firstName: \"Rita\", lastName: \"Yazbek\"}) {id user phone email firstName lastName namePrefix }}"}' http://localhost:4000/graphql | jq
```

if the operation success, the result is:

```json
{
  "data": {
    "createClient": {
      "id": 10,
      "user": "master490",
      "phone": "0933112237",
      "email": "master@nomail2.com",
      "firstName": "Rita",
      "lastName": "Yazbek",
      "namePrefix": "Ms."
    }
  }
}
```

if the client already exists (same phone, email) the server return this value

```json
{
  "errors": [{ "message": "phone is belong to existing user" }],
  "data": { "createClient": null }
}
```

```json
{
  "errors": [{ "message": "email is belong to existing user" }],
  "data": { "createClient": null }
}
```

## user profile

after login, you can use this quest to get the profile info.

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { clientByAuth {id user phone email firstName lastName namePrefix birthDate isMale createdAt }} "}' http://localhost:4000/graphql | jq
```

the result for this request is:

```json
{
  "data": {
    "client": {
      "id": 2,
      "user": "zaherati",
      "phone": "0911223344",
      "email": "katsh88@hotmail.com",
      "firstName": "Zaher",
      "lastName": "Zaher",
      "namePrefix": "Mr.",
      "birthDate": "591656400000",
      "isMale": true,
      "createdAt": "1683503682330"
    }
  }
}
```

to update the user profile for current user, send this request:

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateClientByAuth(input: {phone: \"0933000001\", email: \"master3@nomail.com\", namePrefix: \"Ms.\", firstName: \"Ramia\", lastName: \"Sulimana\", avatar: \"ramia.jpg\", birthDate: \"1988-12-4\"}) {id user phone email firstName lastName namePrefix birthDate isMale}}"}' http://localhost:4000/graphql | jq
```

the result:

```json
{
  "data": {
    "updateClientByAuth": {
      "id": 10,
      "user": "master490",
      "phone": "0933000001",
      "email": "master@nomail-new.com",
      "firstName": "Ramia",
      "lastName": "Sulimana",
      "namePrefix": "Ms.",
      "birthDate": "597189600000",
      "isMale": false
    }
  }
}
```

---

## user verification code

after create user, the result of the operation contains the id, we will use this id to request the verification code using this request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { upsertCode(clientId: 3) { createdAt }}"}' http://localhost:4000/graphql | jq
```

```json
{
  "data": {
    "upsertCode": {
      "createdAt": "1683803858924"
    }
  }
}
```

for testing purpose, the code is constant, 1988, if the id doesn't belong to any user, the api retrive this schema

```json
{
  "errors": [{ "message": "The user is not exists" }],
  "data": { "upsertCode": null }
}
```

you can very user by phone number by using schema:

```bash
curl -H 'Content-Type: application/json' -H -X POST -d '{"query": "mutation { upsertCodeByPhone(phone: \"0933112233\") {createdAt }}"}' http://localhost:4000/graphql | jq
```

and ther server will return this object after the operation has been success:

```json
{
  "data": {
    "upsertCodeByPhone": {
      "clientId": 6,
      "createdAt": "1683803858924"
    }
  }
}
}
```

if the phone number that entered not belong to any user, the server return this object:

```json
{
  "errors": [
    {
      "message": "no user related with entered phone numer-no user related with entered phone numer"
    }
  ],
  "data": {
    "upsertCodeByPhone": null
  }
}
```

## verify code

to verify code, we should send the user id and the code the the backend using the request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { verifyClient(clientId: 3, codeText: \"1988\") { jwt success }}"}' http://localhost:4000/graphql | jq
```

if the user has code the the code is valid, the server retrive this result:

```json
{
  "data": {
    "verifyClient": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbSI6Im1hc3RlcjQ5MCIsInJvbCI6IiIsImlhdCI6MTY4NTE4NDkyOX0.dLN9l7Z3aWBDgrW1aXkb1kXK6gXo0fA7VL8OuArhE1w",
      "success": true
    }
  }
}
```

if ths code is valid, or user id is not exists, the server retrive this result:

```json
{
  "data": {
    "verifyClient": {
      "jwt": "",
      "success": false
    }
  }
}
```

we should use this toke in future request in the header of request :
Authorization: Bearer [token]

---

## categories

each cateroy contains id, name and image, to display all categories, you can use this api:

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { categories { id name nameTranslated image }}"}' http://localhost:4000/graphql | jq
```

```json
{
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "CAC",
        "nameTranslated": "مركزي",
        "image": "/uploads/categories/pc1.png"
      },
      {
        "id": 2,
        "name": "GMV",
        "nameTranslated": "GMV",
        "image": "/uploads/categories/pc2.png"
      }
    ]
  }
}
```

---

## sub categories

each subcateroy contains id, name and image, and then you can find products by subcategory, to display all subcategories by category id as a parent item, you can use this api:

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { subCategories(categoryId: 2) { id name nameTranslated image }}"}' http://localhost:4000/graphql | jq
```

```json
{
  "data": {
    "subCategories": [
      {
        "id": 9,
        "name": "1 - Way Cassette",
        "nameTranslated": "سقفي منفذ1",
        "image": "/uploads/categories/c9.png"
      },
      {
        "id": 10,
        "name": "2 - Way Cassette",
        "nameTranslated": "سقفي منفذ 2",
        "image": "/uploads/categories/c10.png"
      },
      {
        "id": 11,
        "name": "4 - Way Cassette",
        "nameTranslated": "سقفي منفذ 4",
        "image": "/uploads/categories/c11.png"
      },
      {
        "id": 12,
        "name": "8 - Way Cassette",
        "nameTranslated": "سقفي منفذ 8",
        "image": "/uploads/categories/c12.png"
      },
      {
        "id": 18,
        "name": "AHU Kit",
        "nameTranslated": "AHU Kit",
        "image": "/uploads/categories/c18.png"
      },
      {
        "id": 17,
        "name": "Concealed Floor Standing",
        "nameTranslated": "المكيف العامودي المخفي",
        "image": "/uploads/categories/c17.png"
      },
      {
        "id": 16,
        "name": "console",
        "nameTranslated": "كونسول",
        "image": "/uploads/categories/c16.png"
      },
      {
        "id": 8,
        "name": "Ducted Unit",
        "nameTranslated": "مكيف مخفي",
        "image": "/uploads/categories/c8.png"
      },
      {
        "id": 14,
        "name": "Floor Ceiling",
        "nameTranslated": "سقفي أرضي",
        "image": "/uploads/categories/c14.png"
      },
      {
        "id": 15,
        "name": "Floor Standing",
        "nameTranslated": "عامودي",
        "image": "/uploads/categories/c15.png"
      },
      {
        "id": 19,
        "name": "Heat Recovery",
        "nameTranslated": "المبادل الحراري",
        "image": "/uploads/categories/c19.png"
      },
      {
        "id": 20,
        "name": "Heat Recovery Unit with Dx Coil",
        "nameTranslated": "مبادل حراري مع كويل",
        "image": "/uploads/categories/c20.png"
      },
      {
        "id": 13,
        "name": "Wall Type",
        "nameTranslated": "جداري",
        "image": "/uploads/categories/c13.png"
      }
    ]
  }
}
```

---

## products

to display all product of subcategory, we should use this graphql request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(subCategoryId: 1) { id name nameTranslated model image description descriptionTranslated price isDisabled }}"}' http://localhost:4000/graphql | jq
```

```json
{
  "data": {
    "products": [
      {
        "id": 236,
        "name": "GU24T/A-KE",
        "nameTranslated": "GU24T/A-KE",
        "model": "ET010N1970",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
        "price": 1125,
        "isDisabled": false
      },
      {
        "id": 235,
        "name": "GU60T/A-KE",
        "nameTranslated": "GU60T/A-KE",
        "model": "ET010N2080",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 5 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 5 طن",
        "isDisabled": false
      },
      {
        "id": 234,
        "name": "GU48T/A-KE",
        "nameTranslated": "GU48T/A-KE",
        "model": "ET010N1960",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 4 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 4 طن",
        "price": 1800,
        "isDisabled": false
      },
      {
        "id": 233,
        "name": "GU36T/A-KE",
        "nameTranslated": "GU36T/A-KE",
        "model": "ET010N1950",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 3 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 3 طن",
        "price": 1350,
        "isDisabled": false
      },
      {
        "id": 232,
        "name": "GU30T/A-KE",
        "nameTranslated": "GU30T/A-KE",
        "model": "ET010N2010",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2.5 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2.5 طن",
        "price": 1170,
        "isDisabled": false
      },
      {
        "id": 231,
        "name": "GUD18T/A-KE",
        "nameTranslated": "GUD18T/A-KE",
        "model": "ET010N2240",
        "image": "/uploads/products/p2.png",
        "description": "GREE Cassette Split, 8-way, ON/OFF, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
        "price": 895,
        "isDisabled": false
      },
      {
        "id": 230,
        "name": "GUD60T/A-SE",
        "nameTranslated": "GUD60T/A-SE",
        "model": "ET01002220",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 5Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 5 طن",
        "price": 2300,
        "isDisabled": false
      },
      {
        "id": 229,
        "name": "GUD48T/A-SE",
        "nameTranslated": "GUD48T/A-SE",
        "model": "ET01002060",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 4Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 4 طن",
        "price": 2200,
        "isDisabled": false
      },
      {
        "id": 228,
        "name": "GUD36T/A-SE",
        "nameTranslated": "",
        "model": "ET01002050",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 3Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 3 طن",
        "price": 1725,
        "isDisabled": false
      },
      {
        "id": 2,
        "name": "GUD24T/A-SE",
        "nameTranslated": "GUD24T/A-SE",
        "model": "ET01002070",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 2Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
        "price": 1330,
        "isDisabled": false
      },
      {
        "id": 1,
        "name": "GUD18T/A-SE",
        "nameTranslated": "GUD18T/A-SE",
        "model": "ET01002250",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
        "price": 1100,
        "isDisabled": false
      }
    ]
  }
}
```

the price is optional field, if there is no price, this item is only to get by offer request.
you can use filter parameters to select special set of products, the full list of filters displayed in this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(subCategoryId: 1, filter: {fromDate: \"2023-5-1\", toDate: \"2023-5-10\", keyword: \"Gen\"}) { id name nameTranslated model image description descriptionTranslated price }}"}' http://localhost:4000/graphql | jq
```

keyword is used to search within the name, model or description in primary and secondary language of products.

```json
{
  "data": {
    "products": [
      {
        "id": 236,
        "name": "General",
        "nameTranslated": "جنرال",
        "model": "ET010N1970",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
        "price": 1125
      }
    ]
  }
}
```

to use pagination, first we should get initial set of data using the same prvious query includes take (number of item to take) using this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(subCategoryId: 1, pagination: {take: 3}, filter: {fromDate: \"2023-5-1\", toDate: \"2023-7-10\", keyword: \"طن\"}) { id name nameTranslated model image description descriptionTranslated price }}"}' http://localhost:4000/graphql | jq
```

the previous example contains the filter data, it is optional and the schema is valid if it was omitted.
the result is an array of product and the counts is equal to take args:

```json
{
  "data": {
    "products": [
      {
        "id": 236,
        "name": "GU24T/A-KE",
        "nameTranslated": "GU24T/A-KE",
        "model": "ET010N1970",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
        "price": 1125
      },
      {
        "id": 235,
        "name": "GU60T/A-KE",
        "nameTranslated": "GU60T/A-KE",
        "model": "ET010N2080",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 5 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 5 طن",
        "price": 2100
      },
      {
        "id": 234,
        "name": "GU48T/A-KE",
        "nameTranslated": "GU48T/A-KE",
        "model": "ET010N1960",
        "image": "/uploads/products/p2.png",
        "description": "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 4 Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 4 طن",
        "price": 1800
      }
    ]
  }
}
```

then we will include the last id value (234 in this case) with the next request by this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(subCategoryId: 1, pagination: {take: 3, id: 234}, filter: {fromDate: \"2023-5-1\", toDate: \"2023-5-10\", keyword: \"Gen\"}) { id name model image description price }}"}' http://localhost:4000/graphql | jq
```

and the server will return the next 3 items (3 is the value of take):

```json
{
  "data": {
    "products": [
      {
        "id": 235,
        "name": "Haier",
        "model": "a28394dj",
        "image": "/uploads/products/p3.png",
        "price": 88.5
      },
      {
        "id": 236,
        "name": "Samsung",
        "model": "ab-23895-s",
        "image": "/uploads/products/p2.png",
        "price": 210
      },
      {
        "id": 237,
        "name": "LG",
        "model": "z-12889",
        "image": "/uploads/products/p1.png",
        "price": 150.5
      }
    ]
  }
}
```

to display a full information of a product, we should use this schema:

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { product(id: 1) { id name nameTranslated model image description descriptionTranslated specification specificationTranslated specificationImage price createdAt subCategory {name }  catalogFile }}"}' http://localhost:4000/graphql | jq
```

the result json like this:

```json
{
  "data": {
    "product": {
      "id": 1,
      "name": "GUD18T/A-SE",
      "nameTranslated": "GUD18T/A-SE",
      "model": "ET01002250",
      "image": "/uploads/products/p1.png",
      "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
      "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
      "specification": "\nCapacity\tCooling\tKW\t1.6 - 5.5\nHeating\tKW\t1.5 - 6\nEER/C.O.P\t\tW/W\t3.39/3.62\nPower Supply\t\tPh,V,Hz\t1Ph, 220 - 240, 50Hz\nPower Input\tCooling \tKW\t0.3-2\nHeating\tKW\t0.3-2\nCurrent\tCooling \tA\t1.4-9\nHeating\tA\t1.4-9\n\nIndoor Unit\t\t\t\nAir Flow Volume\tIndoor\t\t580/480/400\nSound Pressure Level\tIndoor\tdB (A)\t39/35/31\nOutline Dimension\tW*H*D\tmm\t570*265*570\n\nPanel\t\t\t\nDimension\tW*H*D\tmm\t620*47.5*620\nCode\t\t\tTF05\n\nOutdoor Unit\t\t\t\nOutline Dimension\tOutdoor\tmm\t818*596*302\nFan\t\t\tSingle\nConnection Pipe\t\t\t\nPipe Diameter\tGas\tInch\t1/4''\nLiquid\tInch\t1/2''\nMax. Distance\tHeight/ Length\tm\t15/20\n    ",
      "specificationTranslated": "\nالسعة\tتبريد\tKW\t1.6 - 5.5\nتدفئة\tKW\t1.5 - 6\nEER/C.O.P معامل كفاءة الطاقة\t\tW/W\t3.39/3.62\nمصدر الطاقة\t\tPh,V,Hz\t1Ph, 220 - 240, 50Hz\nاستهلاك الكهرباء\tتبريد\tKW\t0.3-2\nتدفئة\tKW\t0.3-2\nالأمبيرية\tتبريد\tA\t1.4-9\nتدفئة\tA\t1.4-9\n\nالوحدة الداخلية\t\t\t\nتدفق الهواء\tالوحدة الداخلية\t\t580/480/400\nمستوى الصوت\tالوحدة الداخلية\tdB (A)\t39/35/31\nقياس الجهاز\tW*H*D\tmm\t570*265*570\n\nلوحة الجهاز\t\t\t\nقياس الجهاز\tW*H*D\tmm\t620*47.5*620\nالكود\t\t\tTF05\n\nالوحدة الخارجية\t\t\t\nقياس الجهاز\tالوحدة الخارجية\tmm\t818*596*302\nالمروحة\t\t\tSingle\nتوصيلات الأنابيب\t\t\t\nقطر الأنابيب\tسائل\tInch\t1/4''\nغاز\tInch\t1/2''\nالمسافة القصوى\tالارتفاع  الطول\tm\t15/20\n    ",
      "specificationImage": "/uploads/specifications/e1.jpg",
      "price": 1100,
      "createdAt": "1686523830339",
      "subCategory": {
        "name": "Cassette"
      },
      "catalogFile": "https://www.fujitsu-general.com/shared/pdf-feur-support-ctlg-3ef018-1712e-01.pdf"
    }
  }
}
```

the user can search for products by serial number to add them, this graphql query is used for searching

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { productItem(sn: \"241784198\") { createdAt product {id name nameTranslated model image description descriptionTranslated price}}}"}' http://localhost:4000/graphql | jq
```

if the serial number was already exists in the database, the server returns the related product info:

```json
{
  "data": {
    "productItem": {
      "createdAt": "1686523830339",
      "product": {
        "id": 1,
        "name": "GUD18T/A-SE",
        "nameTranslated": "GUD18T/A-SE",
        "model": "ET01002250",
        "image": "/uploads/products/p1.png",
        "description": "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
        "descriptionTranslated": "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
        "price": 1100
      }
    }
  }
}
```

the createdAt field that returned from result is the date of created this serial number to system, you can omit it from the request schema.
if the serial number that entered is not related to any product, the server will return this response.

```json
{
  "data": {
    "productItem": null
  }
}
```

---

## product item

user can add products items by serial number, the system detect the loged-in user automatically by authorization token and the product id, so you should only send the serial number to add the product.

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createProductItemOnClientByAuth(sn: \"241784197\")  {clientId productSn createdAt}}"}' http://localhost:4000/graphql | jq
```

if the operation success, the server return this result

````json
{
  "data": {
    "createProductItemOnClientByAuth": {
      "clientId": 1,
      "productSn": "241784197",
      "createdAt": "1683652790988"
    }
  }
}

if you add the item before, the system will display this error

```json
{
  "errors": [ { "message": "error while creating data"} ],
  "data": {
    "createProductItemOnClientByAuth": null
  }
````

if the serial number not found, the server is return this message:

```json
{
  "errors": [{ "message": "Product serial number is not found" }],
  "data": { "createProductItemOnClientByAuth": null }
}
```

to display all your added products, you can use this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { productItemsByAuth {sn createdAt product{ id name model image}}}"}' http://localhost:4000/graphql | jq
```

the result for this user by authorization token is:

```json
{
  "data": {
    "productItemsByAuth": [
      {
        "sn": "241784197",
        "createdAt": "1683553150642",
        "product": {
          "id": 1,
          "name": "LG",
          "model": "z-12889",
          "image": "/imgs/products/p1.jpg"
        }
      },
      {
        "sn": "82780005",
        "createdAt": "1683553150667",
        "product": {
          "id": 2,
          "name": "Samsung",
          "model": "ab-23895-s",
          "image": "/imgs/products/p2.jpg"
        }
      }
    ]
  }
}
```

to delete on of this added products, you can use this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteProductItemOnClientByAuth(sn: \"241784196\")  {productSn createdAt}}"}' http://localhost:4000/graphql | jq
```

if the operation success, the server returns info about deleted item:

```json
{
  "data": {
    "deleteProductItemOnClientByAuth": {
      "productSn": "241784195",
      "createdAt": "1683652611848"
    }
  }
}
```

you can't delete item that related with maintenance issue, so ther server will return error:

```json
{
  "errors": [
    {
      "message": "Cann't delete this item becuase it is related to other data, delete the related data first"
    }
  ],
  "data": {
    "deleteProductItemOnClientByAuth": null
  }
}
```

## orders

after login, you can check your orders using this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { ordersByAuth {id count totalPrice status createdAt isOfferRequest product{ name model image } }}"}' http://localhost:4000/graphql | jq
```

```json
{
  "data": {
    "ordersByAuth": [
      {
        "id": 9,
        "count": 3,
        "totalPrice": 453.5,
        "status": "ACCEPTED",
        "createdAt": "1683553150815",
        "isOfferRequest": false,
        "product": {
          "name": "LG",
          "model": "z-12889",
          "image": "/uploads/imgs/products/p.jpg"
        }
      }
    ]
  }
}
```

if you have a draft (already saved order data) you can query for it by this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { ordersByAuth(isDraft: true) {id count totalPrice status createdAt product{name model} }}"}' http://localhost:4000/graphql | jq
```

the result is same response of previous query.
if you don't have any order yet, the system will return empty set:

````json
{
  "data": {
    "ordersByAuth": []
  }
}```

to create new order, you can use this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createOrderByAuth(input: {productId: 5, count: 5, totalPrice: 500, isOfferRequest: true, address: \"edge of word\", note: \"no note\"}) {id count totalPrice status createdAt  }}"}' http://localhost:4000/graphql | jq
````

the values of isOfferRequest means the user wants offer, else user is just creating an order.
if the operation success, the server returns this object

````json

  "data": {
    "createOrderByAuth": {
      "id": 11,
      "count": 5,
      "totalPrice": 500,
      "status": "PENDING",
      "createdAt": "1683731951823",
    }
  }
}

to save the order as a draft, we will just use isDraft parameter, the query should like:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createOrderByAuth(input: {isDraft: true, productId: 5, count: 5, totalPrice: 500, address: \"edge of word\", note: \"no note\"}) {id count totalPrice status createdAt  }}"}' http://localhost:4000/graphql | jq
````

and the result is the same of previous result to create normal order.

to delete te order, we will use the id of the order within this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteOrderByAuth(id: 11) { count  }}"}' http://localhost:4000/graphql | jq
````

if the operation is succes, the server return this object:

```json
{
  "data": {
    "deleteOrderByAuth": {
      "count": 1
    }
  }
}
```

if the id not exists, or you don't have permission to delete the order, the result object is:

{
"data": {
"deleteOrderByAuth": {
"count": 0
}
}
}

---

## maintenance

to display your maintanance request, you can use this graphql schema:

```bash
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "query { maintenancesByAuth {id address status propertyType bookedAt productItem { sn product { name model image } } } }"}' http://localhost:4000/graphql | jq
```

the result is an array of your historical maintenance reqests and status of each on:

```json
{
  "data": {
    "maintenancesByAuth": [
      {
        "id": 9,
        "address": "Jaramaran-Damascus",
        "status": "FIXED",
        "propertyType": "OFFICE",
        "bookedAt": "1685566800000",
        "productItem": {
          "sn": "82780005",
          "product": {
            "name": "LG",
            "model": "zx-459392",
            "image": "/uploads/imgs/products/p.jpg"
          }
        }
      }
    ]
  }
}
```

if you didn't have any maintenance request, the system will return an empty array:

```json
{
  "data": {
    "maintenancesByAuth": []
  }
}
```

to schedule new maintenance request, you should use this schema:

```bash
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "mutation { createMaintenance(input: {productSn: \"241784196\", description: \"extra heat\", propertyType: \"HOME\", address: \"Muhajreen - Damascus\", bookedAt: \"2023-6-22\"}) {id address status propertyType bookedAt productItem {sn} }}"}' http://localhost:4000/graphql | jq
```

and if the operation success, the server returns this object:

```json
{
  "data": {
    "createMaintenance": {
      "id": 17,
      "address": "Muhajreen - Damascus",
      "status": "PENDING",
      "propertyType": "HOME",
      "bookedAt": "1687381200000",
      "productItem": null
    }
  }
}
```

if the input product key is not valid, the server returns this object:

```json
{
  "errors": [
    {
      "message": "Product serial number is not found"
    }
  ],
  "data": {
    "createMaintenance": null
  }
}
```

to delete the maintenance request, you can use this api:

```bash
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "mutation { deleteMaintenanceByAuth(id: 17) { count }} "}' http://localhost:4000/graphql | jq
```

and if the operation succss:

```json
{
  "data": {
    "deleteMaintenanceByAuth": {
      "count": 0
    }
  }
}
```
