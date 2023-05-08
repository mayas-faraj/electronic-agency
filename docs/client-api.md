# Air Condition System
> air condition is using graphql for api, the graphql is post request that contains json data, the json data always contain data object that contains the operation name and inside it the data if exists, and it maybe container errors object if there are errors during operation.

## user signup
first stage, we will create a non-verified user with the basic info, the phone is required, the request schema take this shape:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createClient(input: {phone: \"0933112233\", email: \"master@nomail.com\", namePrefix: \"Ms.\", firstName: \"Rita\", lastName: \"Yazbek\", birthDate: \"2023-12-20\"}) {id user phone email firstName lastName namePrefix birthDate isMale}}"}' http://localhost:4000
```
if the operation success, the result is:

```json
{
  "data": {
    "createClient": {
      "id": 4,
      "user": "master",
      "phone": "0933112233",
      "email": "master@nomail.com",
      "firstName": "Rita",
      "lastName": "Yazbek",
      "namePrefix": "Ms.",
      "birthDate": null,
      "isMale": true
    }
  }
}
```

if the client already exists (same phone, email) the server return this value

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.client.create()` invocation:\n\n\nUnique constraint failed on the constraint: `client_phone_key`",
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

## user profile
after login, you can use this quest to get the profile info.
```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { client(id: 2) {id user phone email firstName lastName namePrefix birthDate isMale createdAt }} "}' http://localhost:4000
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
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateClientByAuth(input: {phone: \"0933000001\", email: \"master3@nomail.com\", namePrefix: \"Ms.\", firstName: \"Ramia\", lastName: \"Sulimana\", avatar: \"ramia.jpg\", birthDate: \"1988-12-4\"}) {id user phone email firstName lastName namePrefix birthDate isMale}}"}' http://localhost:4000
```

the result:

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

## user verification code
after create user, the result of the operation contains the id, we will use this id to request the verification code using this request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { upsertCode(clientId: 3) { createdAt }}"}' http://localhost:4000
```

```json
{
  "data": {
    "upsertCode": {
      "createdAt": "1683510242112"
    }
  }
}
```

for testing purpose, the code is constant, 1988, if the id doesn't belong to any user, the api retrive this schema

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.code.upsert()` invocation:\n\n\nForeign key constraint failed on the field: `clientId`",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "upsertCode"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "upsertCode": null
  }
}
```

## verify code

to verify code, we should send the user id and the code the the backend using the request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { verifyClient(clientId: 3, codeText: \"1988\") { jwt }}"}' http://localhost:4000
```

if the user has code the the code is valid, the server retrive this result:

```json
{
  "data": {
    "verifyClient": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoiemFpbmFiIiwicm9sIjoiIiwiaWF0IjoxNjgzNTExNjkzfQ.IEe-5knhVVQ4bqssaVPbF9Yj2BR8Rlrf-7AQo96wSE8"
    }
  }
}
```

if ths code is valid, or user id is not exists, the server retrive this result:
```json
{
  "data": {
    "verifyClient": {
      "jwt": ""
    }
  }
}
```
we should use this toke in future request in the header of request :
Authorization: Bearer <token>

---
## user orders
to read the orders of the current user, you should use this request:
```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { client(id: 2) { orders { id count totalPrice status createdAt  }}} "}' http://localhost:4000 
```
and the result:
```json
{
  "data": {
    "client": {
      "orders": [
        {
          "id": 8,
          "count": 1,
          "totalPrice": 773.5,
          "status": "PENDING",
          "createdAt": "1683503682619"
        }
      ]
    }
  }
}
```

## categories
each cateroy contains id, name and image, and then you can find products by category, to display all categories, you can use this api:


```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { categories { id name image }}"}' http://localhost:4000
```

```json
{
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Residential",
        "image": "/imgs/categories/c1.jpg"
      },
      {
        "id": 2,
        "name": "Bussiness",
        "image": "/imgs/categories/c2.jpg"
      }
    ]
  }
}
```

---