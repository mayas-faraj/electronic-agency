# Air Condition System

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { clients(filter: {onlyEnabled: true, fromDate: \"2023-05-07\"}) {id user phone email firstName lastName namePrefix birthDate isMale}}"}' http://localhost:4000
```

```json
{
  "data": {
    "clients": [
      {
        "id": 1,
        "user": "lord.mayas",
        "phone": "0960009710",
        "email": "uniqueprogrammer@hotmail.com",
        "firstName": "Mayas",
        "lastName": "Faraj",
        "namePrefix": "Mr.",
        "birthDate": "527893200000",
        "isMale": true
      },
      {
        "id": 2,
        "user": "zaherati",
        "phone": "0911223344",
        "email": "katsh88@hotmail.com",
        "firstName": "Zaher",
        "lastName": "Zaher",
        "namePrefix": "Mr.",
        "birthDate": "591656400000",
        "isMale": true
      },
      {
        "id": 3,
        "user": "zainab",
        "phone": "0955666777",
        "email": "zainab@hotmail.com",
        "firstName": "Zainab",
        "lastName": null,
        "namePrefix": "Ms.",
        "birthDate": "702079200000",
        "isMale": false
      }
    ]
  }
}
```
---

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { client(id: 2) {id user phone email firstName lastName namePrefix birthDate isMale createdAt orders { id count totalPrice status createdAt  } reviews {rating comment createdAt} }} "}' http://localhost:4000 
 ```

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
      "createdAt": "1683503682330",
      "orders": [
        {
          "id": 8,
          "count": 1,
          "totalPrice": 773.5,
          "status": "PENDING",
          "createdAt": "1683503682619"
        }
      ],
      "reviews": [
        {
          "rating": 4,
          "comment": "good air condition",
          "createdAt": "1683503682389"
        },
        {
          "rating": 3,
          "comment": "better thant older one",
          "createdAt": "1683503682427"
        },
        {
          "rating": 4,
          "comment": null,
          "createdAt": "1683503682445"
        }
      ]
    }
  }
}
```

```json
{
  "data": {
    "client": null
  }
}
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateClient(id: 5, input: {phone: \"0933000001\", email: \"master3@nomail.com\", namePrefix: \"Ms.\", firstName: \"Ramia\", lastName: \"Sulimana\", avatar: \"ramia.jpg\", birthDate: \"1988-12-4\", isDisabled: true}) {id user phone email firstName lastName namePrefix birthDate isMale}}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateClient": {
      "id": 5,
      "user": "master2",
      "phone": "0933000001",
      "email": "master3@nomail.com",
      "firstName": "Ramia",
      "lastName": "Sulimana",
      "namePrefix": "Ms.",
      "birthDate": "597189600000",
      "isMale": true
    }
  }
}
```

---

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteClient(id: 5) {id user phone email firstName lastName namePrefix isMale}}"}' http://localhost:4000
```

```json
{
  "data": {
    "deleteClient": {
      "id": 5,
      "user": "master2",
      "phone": "0933000001",
      "email": "master3@nomail.com",
      "firstName": "Ramia",
      "lastName": "Sulimana",
      "namePrefix": "Ms.",
      "isMale": true
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.client.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteClient"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "Error: ",
          "Invalid `prisma.client.delete()` invocation:",
          "",
          "",
          "An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
          "    at fn.handleRequestError (/home/mayas/Documents/web-apps/electronic-agency/backend/node_modules/@prisma/client/runtime/library.js:174:6477)",
          "    at fn.handleAndLogRequestError (/home/mayas/Documents/web-apps/electronic-agency/backend/node_modules/@prisma/client/runtime/library.js:174:5907)",
          "    at fn.request (/home/mayas/Documents/web-apps/electronic-agency/backend/node_modules/@prisma/client/runtime/library.js:174:5786)",
          "    at async t._request (/home/mayas/Documents/web-apps/electronic-agency/backend/node_modules/@prisma/client/runtime/library.js:177:10477)",
          "    at async Object.deleteClient (file:///home/mayas/Documents/web-apps/electronic-agency/backend/dist/schema/client/resolvers.js:163:28)"
        ]
      }
    }
  ],
  "data": {
    "deleteClient": null
  }
}
```

---

```bash
```

```json
```

---

```bash
```

```json
```

---

```bash
```

```json
```

---

```bash
```

```json
```

---

```bash
```

```json
```

---
