import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({ log: ["query"] });
let result: any = null;

// clear data
await prismaClient.maintenance.deleteMany();
await prismaClient.order.deleteMany();
await prismaClient.product.deleteMany();
await prismaClient.category.deleteMany();
await prismaClient.client.deleteMany();
await prismaClient.admin.deleteMany();

// seed clients
result = await prismaClient.client.createMany({
  data: [
    {
      id: 1,
      user: "lord.mayas",
      namePrefix: "Mr.",
      firstName: "Mayas",
      lastName: "Faraj",
      phone: "0960009710",
      avatar: "/uploads/avatars/mayas.jpg",
      birthDate: new Date(1986, 8, 24),
      isMale: true,
      email: "uniqueprogrammer@hotmail.com",
    },
    {
      id: 2,
      user: "zaherati",
      namePrefix: "Mr.",
      firstName: "Zaher",
      lastName: "Zaher",
      phone: "0911223344",
      avatar: "/uploads/avatars/zaher.jpg",
      birthDate: new Date(1988, 9, 1),
      isMale: true,
      email: "katsh88@hotmail.com",
    },
    {
      id: 3,
      user: "zainab",
      namePrefix: "Ms.",
      firstName: "Zainab",
      phone: "0955666777",
      avatar: "/uploads/avatars/zainab.jpg",
      birthDate: new Date(1992, 3, 1),
      isMale: false,
      email: "zainab@hotmail.com",
    },
  ],
});

console.log("client seed result: ", result);

// seed admins
result = await prismaClient.admin.createMany({
  data: [
    {
      id: 1,
      user: "admin",
      password: "Zxasqw12",
      role: "ADMIN",
    },
    {
      id: 2,
      user: "ali",
      password: "12345",
      role: "PRODUCT_MANAGER",
    },
    {
      id: 3,
      user: "alaa",
      password: "123",
      role: "SALES_MAN",
    },
    {
      id: 4,
      user: "feras",
      password: "9999",
      role: "TECHNICAL",
    },
  ],
});

console.log("admins seed result: ", result);

// seed category
result = await prismaClient.category.createMany({
  data: [
    {
      id: 1,
      name: "Residential",
      image: "/uploads/categories/resedental.png",
    },
    {
      id: 2,
      name: "Bussiness",
      image: "/uploads/categories/business.png",
    },
  ],
});

console.log("category seed result: ", result);

// seed products
result = await prismaClient.product.create({
  data: {
    id: 1,
    categoryId: 1,
    name: "LG",
    model: "z-12889",
    image: "/uploads/products/p1.png",
    price: 150.5,
    description: `
            TruWifi
            TruSmart Sensors
            Dual Inveter
            18 degree in 30 seconds
            Smart Geofencing
            Self Cleaning Technology
            6 in 1 filter
            10 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [
          { sn: "241784194" },
          { sn: "241784195" },
          { sn: "241784196" },
          { sn: "241784197" },
          { sn: "241784198" },
        ],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 1,
            rating: 5,
            comment: "best device",
          },
          {
            clientId: 2,
            rating: 4,
            comment: "good air condition",
          },
          {
            clientId: 3,
            rating: 5,
            comment: "high quality",
          },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 2,
    categoryId: 1,
    name: "Samsung",
    model: "ab-23895-s",
    image: "/uploads/products/p2.png",
    price: 210,
    description: `
            Smart watch
            TruSmart Sensors
            Dual Inveter
            Self Cleaning Technology
            6 in 1 filter
            10 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [
          { sn: "82780001" },
          { sn: "82780002" },
          { sn: "82780003" },
          { sn: "82780004" },
          { sn: "82780005" },
          { sn: "82780006" },
        ],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 1,
            rating: 4,
            comment: "good device",
          },
          {
            clientId: 3,
            rating: 5,
            comment: "long live air condition",
          },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 3,
    categoryId: 1,
    name: "Haier",
    model: "a28394dj",
    image: "/uploads/products/p3.png",
    price: 88.5,
    description: `
            TruWifi
            TruSmart Sensors
            18 degree in 30 seconds
            Smart Geofencing
            4 in 1 filter
        `,
    items: {
      createMany: {
        data: [
          { sn: "32000045" },
          { sn: "32000046" },
          { sn: "32000047" },
          { sn: "32000048" },
        ],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 2,
            rating: 3,
            comment: "better thant older one",
          },
          {
            clientId: 3,
            rating: 2,
          },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 4,
    categoryId: 1,
    name: "General",
    model: "ge-283927",
    image: "/uploads/products/p4.png",
    price: 250,
    description: `
            TruWifi
            Dual Inveter
            18 degree in 30 seconds
            Smart Geofencing
            12 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [
          { sn: "1002320005" },
          { sn: "1002320006" },
          { sn: "1002320007" },
        ],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 1,
            rating: 5,
          },
          {
            clientId: 2,
            rating: 4,
          },
          {
            clientId: 3,
            rating: 5,
          },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 5,
    categoryId: 1,
    name: "Mitsubishi",
    model: "z-12889",
    image: "/uploads/products/p5.png",
    price: 773.5,
    description: `
            TruSmart Sensors
            Dual Inveter
            Smart Geofencing
            Self Cleaning Technology
            6 in 1 filter
            20 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [
          { sn: "24400000012" },
          { sn: "24400000013" },
          { sn: "24400000014" },
          { sn: "24400000015" },
          { sn: "24400000016" },
          { sn: "24400000017" },
          { sn: "24400000018" },
          { sn: "24400000019" },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 6,
    categoryId: 2,
    name: "LG",
    model: "z-329249",
    image: "/uploads/products/p6.png",
    price: 225.5,
    description: `
            TruSmart Sensors
            18 degree in 30 seconds
            Self Cleaning Technology
            6 in 1 filter
            10 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [{ sn: "2385000" }, { sn: "2385001" }, { sn: "2385002" }],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 3,
            rating: 1,
          },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 7,
    categoryId: 2,
    name: "Generals",
    model: "ge-234927",
    image: "/uploads/products/p7.png",
    price: 289,
    description: `
            TruWifi
            Dual Inveter
            18 degree in 30 seconds
            6 in 1 filter
            2 year warranty on compressor
        `,
    items: {
      createMany: {
        data: [{ sn: "3520043107" }, { sn: "3520043108" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 8,
    categoryId: 1,
    name: "GREE Pular On-Off",
    model: "GWH12AGCXB-K3NTA1A",
    image: "/uploads/products/p8.png",
    price: 100,
    description: "GREE Wall Split, Pular, ON/OFF, R410a, Cool & Heat, T3, with 4m pipe, Nom. Cap: 1 Ton",
    items: {
      createMany: {
        data: [{ sn: "4T58310004747" }, { sn: "4T58410002151" }],
      },
    },
  },
});

result = await prismaClient.product.create({
  data: {
    id: 9,
    categoryId: 2,
    name: "GREE Cassette Inverter",
    model: "GUD18TASF5/GUTD18WAS",
    image: "/uploads/products/p9.png",
    price: 120,
    description: "GREE Cassette Split, 8-way, Eco-Inverter, C/H, R410a, T3, Nominal Capacity: 1.5 Ton",
    items: {
      createMany: {
        data: [{ sn: "9AC9920000553" }, { sn: "9ADO120000627" }, { sn: "9P40130002562" }],
      },
    },
  },
});

console.log("product seed result: ", result);


result = await prismaClient.product.create({
  data: {
    id: 10,
    categoryId: 1,
    name: "GREE Window",
    model: "GJE24AE-K3NMTG1C",
    image: "/uploads/products/p10.png",
    price: 120,
    description: "GREE Air conditioner, Window type, ON/OFF, R410a, Nominal capacity: 2 Ton.",
    items: {
      createMany: {
        data: [{ sn: "2101810002878" }],
      },
    },
  },
});

console.log("product seed result: ", result);


result = await prismaClient.product.create({
  data: {
    id: 11,
    categoryId: 2,
    name: "GREE Outdoor unit",
    model: "GMV-680WM/B-X (P)",
    image: "/uploads/products/p11.png",
    price: 130,
    description: "GREE GMV, Multi VRF, Outdoor, Inverter, T3,  Modular, Nominal Cap:68 KW.",
    items: {
      createMany: {
        data: [{ sn: "9CB4130000082" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 12,
    categoryId: 2,
    name: "GREE Indoor unit",
    model: "GMV-ND112T/A-T",
    image: "/uploads/products/p12.png",
    price: 120,
    description: "GMV- Four Way Cassette, Indoor Unit, Nominal Capacity: 11.2 KW.",
    items: {
      createMany: {
        data: [{ sn: "8600030000111" }],
      },
    },
  },
});

console.log("product seed result: ", result);

// seed product on clients review
result = await prismaClient.productItemsOnClients.createMany({
  data: [
    {
      clientId: 1,
      productSn: "241784196",
    },
    {
      clientId: 1,
      productSn: "82780005",
    },
    {
      clientId: 2,
      productSn: "32000047",
    },
  ],
});

console.log("product on clients review seed result: ", result);

// seed orders
result = await prismaClient.order.create({
  data: {
    clientId: 1,
    productId: 1,
    count: 3,
    address: "Zahera-Damascus-Syria",
    totalPrice: 453.5,
    isDraft: false,
    status: "ACCEPTED",
    note: "no comment",
    offer: {
      create: {
        adminId: 1,
        price: 350,
        validationDays: 3,
      },
    },
  },
});

console.log("order seed result: ", result);

result = await prismaClient.order.create({
  data: {
    clientId: 2,
    productId: 5,
    count: 1,
    address: "Muhajreen-Damascus-Syria",
    totalPrice: 773.5,
    isDraft: true,
    status: "PENDING",
    note: "no comment",
  },
});

console.log("order seed result: ", result);

// seed maintenance
result = await prismaClient.maintenance.create({
  data: {
    productSn: "82780005",
    propertyType: "OFFICE",
    description: "the air condition is not working at all",
    bookedAt: new Date(2023, 5, 1),
    address: "Jaramaran-Damascus",
    status: "FIXED",
    repair: {
      create: {
        adminId: 4,
        price: 20,
        description: "the power supply circuit has been replaced",
      },
    },
  },
});

result = await prismaClient.maintenance.create({
  data: {
    productSn: "32000047",
    propertyType: "HOME",
    description: "there are a sound when I trun on the condition",
    bookedAt: new Date(2023, 6, 12),
    address: "Mazzeh-Damascus",
    status: "PENDING",
    isDraft: true
  },
});

console.log("maintenace seed result: ", result);
