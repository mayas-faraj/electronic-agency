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
        "code": "INTERNAL_SERVER_ERROR"
    }
  ],
  "data": {
    "deleteClient": null
  }
}
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { admins(filter: {onlyEnabled: true, fromDate: \"2023-05-07\"}) {id user role isDisabled }}"}' http://localhost:4000
```

```json
{
  "data": {
    "admins": [
      {
        "id": 1,
        "user": "admin",
        "role": "ADMIN",
        "isDisabled": false
      },
      {
        "id": 2,
        "user": "ali",
        "role": "PRODUCT_MANAGER",
        "isDisabled": false
      },
      {
        "id": 3,
        "user": "alaa",
        "role": "SALES_MAN",
        "isDisabled": false
      },
      {
        "id": 4,
        "user": "feras",
        "role": "TECHNICAL",
        "isDisabled": false
      }
    ]
  }
}
```

---

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { admin(id: 1) {id user role isDisabled createdAt offers { id price validationDays} repairs {id price description createdAt}}} "}' http://localhost:4000
```

```json
{
  "data": {
    "admin": {
      "id": 1,
      "user": "admin",
      "role": "ADMIN",
      "isDisabled": false,
      "createdAt": "1683553150612",
      "offers": [
        {
          "id": 5,
          "price": 350,
          "validationDays": 3
        }
      ],
      "repairs": [
        {
          "id": 5,
          "price": 20,
          "description": "the power supply circuit has been replaced",
          "createdAt": "1683553150855"
        }
      ]
    }
  }
}
```

```json
{
  "data": {
    "admin": null
  }
}
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { verifyAdmin(user: \"admin\", password: \"Zxasqw12\") { jwt }}"}' http://localhost:4000
```

```json
{
  "data": {
    "verifyAdmin": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtIjoiYWRtaW4iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTY4MzU1NDA5OH0.wlXiKaDJeeM1qBRlHNkkCXRViVVZdBeWp1-wav0ST5o"
    }
  }
}
```

```json
{
  "data": {
    "verifyAdmin": {
      "jwt": ""
    }
  }
}

```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createAdmin(input: {user: \"master_tech\", password: \"xxx\", role: \"TECHNICAL\"}) {id user role}}"}' http://localhost:4000 | jq
```

```json
{
  "data": {
    "createAdmin": {
      "id": 10,
      "user": "master_tech",
      "role": "TECHNICAL"
    }
  }
}

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.admin.create()` invocation:\n\n\nUnique constraint failed on the constraint: `admin_user_key`",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "createAdmin"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ]
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateAdmin(id: 10,input: {user: \"mastert2\", password: \"vvv\"}) {id user role}}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateAdmin": {
      "id": 10,
      "user": "mastert2",
      "role": "TECHNICAL"
    }
  }
}
```

```json
"errors":[{"message":"Cannot query field \"createdAt\" on type \"AdminBasic\".","locations":[{"line":1,"column":90}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED",}}]}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteAdmin(id: 10) { id user role }}"}' http://localhost:4000
```

```json
{
  "data": {
    "deleteAdmin": {
      "id": 10,
      "user": "mastert2",
      "role": null
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.admin.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteAdmin"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "deleteAdmin": null
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