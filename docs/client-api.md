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
  "errors": [{ "message": "phone is belong to existing user" } ],
  "data": { "createClient": null }
}
```

```json
{ 
  "errors": [{ "message": "email is belong to existing user" } ],
  "data": { "createClient": null }
}
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
      "clientId": "3",
      "createdAt": "1683803858924"
    }
  }
}
```

for testing purpose, the code is constant, 1988, if the id doesn't belong to any user, the api retrive this schema

```json
{
  "errors": [ { "message": "The user is not exists" } ],
  "data": { "upsertCode": null }
}
```

you can very user by phone number by using schema:

```bash
curl -H 'Content-Type: application/json' -H -X POST -d '{"query": "mutation { upsertCodeByPhone(phone: \"0933112233\") {createdAt }}"}' http://localhost:4000
```

and ther server will return this object after the operation has been success:

```json
{
  "data": {
    "upsertCodeByPhone": {
      "clientId": "6",
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

## products
to display all product, we should use this graphql request:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(categoryId: 1) { id name model image description price isDisabled }}"}' http://localhost:4000
```

```json
{
  "data": {
    "products": [
      {
        "id": 1,
        "name": "LG",
        "model": "z-12889",
        "image": "/imgs/products/p1.jpg",
        "description": "Self Cleaning Technology",
        "price": 150.5,
        "isDisabled": false
      },
      {
        "id": 2,
        "name": "Samsung",
        "model": "ab-23895-s",
        "image": "/imgs/products/p2.jpg",
        "description": "Dual Inveter",
        "price": 210,
        "isDisabled": false
      },
      {
        "id": 3,
        "name": "Haier",
        "model": "a28394dj",
        "image": "/imgs/products/p3.jpg",
        "description": "Smart Geofencing",
        "price": 88.5,
        "isDisabled": false
      },
      {
        "id": 4,
        "name": "General",
        "model": "ge-283927",
        "image": "/imgs/products/p4.jpg",
        "description": "12 year warranty on compressor\n        ",
        "price": 250,
        "isDisabled": false
      },
      {
        "id": 5,
        "name": "Mitsubishi",
        "model": "z-12889",
        "image": "/imgs/products/p5.jpg",
        "description": "20 year warranty on compressor\n        ",
        "price": 773.5,
        "isDisabled": false
      }
    ]
  }
}
```

you can use filter parameters to select special set of products, the full list of filters displayed in this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { products(categoryId: 1, filter: {fromDate: \"2023-5-1\", toDate: \"2023-5-10\", keyword: \"Gen\"}) { id name model image description price }}"}' http://localhost:4000
```

keyword is used to search within the name, model or description of products.

```json
{
  "data": {
    "products": [
      {
        "id": 4,
        "name": "General",
        "model": "ge-283927",
        "image": "/imgs/products/p4.jpg",
        "description": "Smart Geofencing",
        "price": 250,
        "isDisabled": false
      }
    ]
  }
}
```

to display a full information of a product, we should use this schema:

```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { product(id: 1) { id name model image description price createdAt category {name } }}"}' http://localhost:4000
```

the result json like this:
```json
{
  "data": {
    "product": {
      "id": 1,
      "name": "LG",
      "model": "z-12889",
      "image": "/imgs/products/p1.jpg",
      "description": "TruSmart Sensors",
      "price": 150.5,
      "createdAt": "1683578700640",
      "category": {
        "name": "Residential"
      }
    }
  }
}
```

the user can search for products by serial number to add them, this graphql query is used for searching

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { productItem(sn: \"241784198\") { createdAt product {id name model image description price}}}"}' http://localhost:4000
```

if the serial number was already exists in the database, the server returns the related product info:

```json
{
  "data": {
    "productItem": {
      "createdAt": "1683553150642",
      "product": {
        "id": 1,
        "name": "LG",
        "model": "z-12889",
        "image": "/imgs/products/p1.jpg",
        "description": "10 year warranty on compressor",
        "price": 150.5
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
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createProductItemOnClientByAuth(sn: \"241784197\")  {clientId productSn createdAt}}"}' http://localhost:4000
 ```

if the operation success, the server return this result
```json
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
```
if the serial number not found, the server is return this message:

```json
{
  "errors": [ { "message": "Product serial number is not found" }],
  "data": { "createProductItemOnClientByAuth": null }
}
```

to display all your added products, you can use this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { productItemsByAuth {sn createdAt product{ id name model image}}}"}' http://localhost:4000
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
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteProductItemOnClientByAuth(sn: \"241784196\")  {productSn createdAt}}"}' http://localhost:4000
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
  "errors": [ {
      "message": "Cann't delete this item becuase it is related to other data, delete the related data first" } ],
  "data": {
    "deleteProductItemOnClientByAuth": null
  }
}
```

## orders
after login, you can check your orders using this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { ordersByAuth {id count totalPrice status createdAt product{name model} }}"}' http://localhost:4000
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
        "product": {
          "name": "LG",
          "model": "z-12889"
        }
      }
    ]
  }
}
```

if you have a draft (already saved order data) you can query for it by this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { ordersByAuth(isDraft: true) {id count totalPrice status createdAt product{name model} }}"}' http://localhost:4000
```

the result is same response of previous query.
if you don't have any order yet, the system will return empty set:

```json
{
  "data": {
    "ordersByAuth": []
  }
}```

to create new order, you can use this api:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createOrderByAuth(input: {productId: 5, count: 5, totalPrice: 500, address: \"edge of word\", note: \"no note\"}) {id count totalPrice status createdAt  }}"}' http://localhost:4000 
```

if the operation success, the server returns this object

```json

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
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createOrderByAuth(input: {isDraft: true, productId: 5, count: 5, totalPrice: 500, address: \"edge of word\", note: \"no note\"}) {id count totalPrice status createdAt  }}"}' http://localhost:4000
```

and the result is the same of previous result to create normal order.

```
to delete te order, we will use the id of the order within this schema:

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteOrderByAuth(id: 11) { count  }}"}' http://localhost:4000 
```

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
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "query { maintenancesByAuth {id address status propertyType bookedAt productItem {sn} }}"}' http://localhost:4000
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
          "sn": "82780005"
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
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "mutation { createMaintenance(input: {productSn: \"241784196\", description: \"extra heat\", propertyType: \"HOME\", address: \"Muhajreen - Damascus\", bookedAt: \"2023-6-22\"}) {id address status propertyType bookedAt productItem {sn} }}"}' http://localhost:4000 
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
curl -H 'Content-Type: application/json' -X  POST -d '{"query": "mutation { deleteMaintenanceByAuth(id: 17) { count }} "}' http://localhost:4000
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

