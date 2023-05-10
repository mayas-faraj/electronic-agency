# Air Condition System

ADMIN:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtIjoiYWRtaW4iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTY4MzY1MTc0OH0.QdYiPQdWPWCgCnwamMYPFNtmsR0rLG3I2n1E30Kohso

PRODUCT_MANAGER:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtIjoiYWxpIiwicm9sIjoiUFJPRFVDVF9NQU5BR0VSIiwiaWF0IjoxNjgzNzM0MDkwfQ.QV3Fvl1PsVQ7F7audDh9svft8cGkf8cudvjm8LNSptk

SALES_MAN: 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoiYWxhYSIsInJvbCI6IlNBTEVTX01BTiIsImlhdCI6MTY4MzczMzk1NX0.C6w9rqynE2T8hcv8t4sk15WYUvd38jOtSbIzYBWs-B4

TECHNICAL:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtIjoiZmVyYXMiLCJyb2wiOiJURUNITklDQUwiLCJpYXQiOjE2ODM3MzQwNjF9.BrUAyuaUzknqdDT31LJnzC3qeyf-oOvWuVx0fWz6Hrc


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
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createCategory(input: {name: \"test cat\", image: \"cat.png\"}) { id name image createdAt }}"}' http://localhost:4000
```

```json
{
  "data": {
    "createCategory": {
      "id": 3,
      "name": "test cat",
      "image": "cat.png",
      "createdAt": "1683560564271"
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.category.create()` invocation:\n\n\nUnique constraint failed on the constraint: `category_name_key`",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "createCategory"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "createCategory": null
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateCategory(id: 3, input: {name: \"test cat2\", image: \"cat2.png\"}) { id name image createdAt }}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateCategory": {
      "id": 3,
      "name": "test cat2",
      "image": "cat2.png",
      "createdAt": "1683560564271"
    }
  }
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteCategory(id: 3) { id name }}"}' http://localhost:4000 
```

```json
{
  "data": {
    "deleteCategory": {
      "id": 3,
      "name": "test cat2",
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.category.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteCategory"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "deleteCategory": null
  }
}
```
---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { product(id: 1) { id name model image description price createdAt category {name } items { sn createdAt} reviews {rating comment } }}"}' http://localhost:4000
```

```json
{
  "data": {
    "product": {
      "id": 1,
      "name": "LG",
      "model": "z-12889",
      "image": "/imgs/products/p1.jpg",
      "description": "10 year warranty on compressor",
      "price": 150.5,
      "createdAt": "1683578700640",
      "category": {
        "name": "Residential"
      },
      "items": [
        {
          "sn": "241784194",
          "createdAt": "1683578700640"
        },
        {
          "sn": "241784195",
          "createdAt": "1683578700640"
        },
        {
          "sn": "241784196",
          "createdAt": "1683578700640"
        },
        {
          "sn": "241784197",
          "createdAt": "1683578700640"
        },
        {
          "sn": "241784198",
          "createdAt": "1683578700640"
        }
      ],
      "reviews": [
        {
          "rating": 5,
          "comment": "best device"
        },
        {
          "rating": 4,
          "comment": "good air condition"
        },
        {
          "rating": 5,
          "comment": "high quality"
        }
      ]
    }
  }
}
```


---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createProduct(input: {categoryId: 1, name: \"freshair\", model: \"s11\", image: \"fa.jpg\", description: \"and desc\", price: 120})  {id name model image description price}}"}' http://localhost:4000
```

```json
{
  "data": {
    "createProduct": {
      "id": 8,
      "name": "freshair",
      "model": "s11",
      "image": "fa.jpg",
      "description": "and desc",
      "price": 120
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.product.create()` invocation:\n\n\nUnique constraint failed on the constraint: `product_name_model_key`",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "createProduct"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "createProduct": null
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateProduct(id: 8, input: {name: \"freshair2\", model: \"s12\", image: \"fa2.jpg\", description: \"and desc2\", price: 125})  {id name model image description price}}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateProduct": {
      "id": 8,
      "name": "freshair2",
      "model": "s12",
      "image": "fa2.jpg",
      "description": "and desc2",
      "price": 125
    }
  }
}
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteProduct(id: 11)  {id name model}}"}' http://localhost:4000
```

```json
{
  "data": {
    "deleteProduct": {
      "id": 11,
      "name": "freshair",
      "model": "s11"
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.product.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteProduct"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "deleteProduct": null
  }
}
```

---

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createProductItem(productId: 1, sn: \"1111111\")  {sn createdAt}}"}' http://localhost:4000 
```

```json
{
  "data": {
    "createProductItem": {
      "sn": "1111111",
      "createdAt": "1683651933467"
    }
  }
}
```

```json
  "errors": [
    {
      "message": "\nInvalid `prisma.productItem.create()` invocation:\n\n\nUnique constraint failed on the constraint: `PRIMARY`",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "createProductItem"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "createProductItem": null
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateProductItem(sn: \"1111111\", newSn: \"22222222222\")  {sn createdAt}}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateProductItem": {
      "sn": "22222222222",
      "createdAt": "1683651933467"
    }
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteProductItem(sn: \"22222222222\")  {sn createdAt}}"}' http://localhost:4000 
```

```json
{
  "data": {
    "deleteProductItem": {
      "sn": "22222222222",
      "createdAt": "1683651933467"
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.productItem.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteProductItem"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "deleteProductItem": null
  }
}
```

---


```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createProductReviewByAuth(productId: 5, input: {rating: 5, comment: \"five stars\"}) {id rating comment createdAt}}"}' http://localhost:4000
```

```json
{
  "data": {
    "createProductReviewByAuth": {
      "id": 57,
      "rating": 5,
      "comment": "five stars",
      "createdAt": "1683655120288"
    }
  }
}
```

---


```bash
curl -H 'Content-Type: application/json'  -H 'Authorization: BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtIjoiYWRtaW4iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTY4MzY1MTc0OH0.QdYiPQdWPWCgCnwamMYPFNtmsR0rLG3I2n1E30Kohso' -X POST -d '{"query": "mutation { deleteProductReview(id: 56) {id rating comment createdAt}}"}' http://localhost:4000
```

```json
{
  "data": {
    "deleteProductReview": {
      "id": 56,
      "rating": 6,
      "comment": "six",
      "createdAt": "1683654601176"
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "\nInvalid `prisma.productReview.delete()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": [
        "deleteProductReview"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
      }
    }
  ],
  "data": {
    "deleteProductReview": null
  }
}
```

---


```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { orders(filter: {status: \"ACCEPTED\", fromDate: \"2023-05-01\"}) {id count totalPrice status createdAt product{name model} }}"}' http://localhost:4000
```

```json
{
  "data": {
    "orders": [
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

```json
{
  "data": {
    "orders": []
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "query { order(id: 9) {id count totalPrice status createdAt product{name model} client { user avatar } offer {id price validationDays createdAt} }}"}' http://localhost:4000
```

```json
{
  "data": {
    "order": {
      "id": 9,
      "count": 3,
      "totalPrice": 453.5,
      "status": "ACCEPTED",
      "createdAt": "1683553150815",
      "product": {
        "name": "LG",
        "model": "z-12889"
      },
      "client": {
        "user": "lord.mayas",
        "avatar": "/imgs/avatar/mayas.jpg"
      },
      "offer": {
        "id": 5,
        "price": 350,
        "validationDays": 3,
        "createdAt": "1683553150815"
      }
    }
  }
}
```

```json
{
  "data": {
    "order": null
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { createOfferByAuth {id price validationDays createdAt  }}"}' http://localhost:4000 | jq
```

```json
{
  "data": {
    "createOfferByAuth": {
      "id": 6,
      "price": 400,
      "validationDays": 5,
      "createdAt": "1683734656028"
    }
  }
}
```

```json
{
  "errors": [
    {
      "message": "the order of this offer is already exist"
    }
  ],
  "data": {
    "createOfferByAuth": null
  }
}
```

---


```bash
curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { updateOfferByAuth(id: 6, input: {price: 420, validationDays: 6}) {id price validationDays createdAt  }}"}' http://localhost:4000
```

```json
{
  "data": {
    "updateOfferByAuth": {
      "id": 6,
      "price": 420,
      "validationDays": 6,
      "createdAt": "1683734656028"
    }
  }
}
```

---


```bash
 curl -H 'Content-Type: application/json' -X POST -d '{"query": "mutation { deleteOffer(id: 6) {id price validationDays createdAt  }}"}' http://localhost:4000
```

```json
{
  "data": {
    "deleteOffer": {
      "id": 6,
      "price": 420,
      "validationDays": 6,
      "createdAt": "1683734656028"
    }
  }
}
```

```json
```

---


```bash
```

```json
```

```json
```

---


```bash
```

```json
```

```json
```

---

