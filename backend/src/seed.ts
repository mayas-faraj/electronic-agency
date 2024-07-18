import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({ log: ["query"] });
let result: any = null;

// clear data
await prismaClient.order.deleteMany();
await prismaClient.product.deleteMany();
await prismaClient.subCategory.deleteMany();
await prismaClient.category.deleteMany();
await prismaClient.client.deleteMany();
await prismaClient.admin.deleteMany();
await prismaClient.center.deleteMany();

// seed centers
result = await prismaClient.center.createMany({
  data: [
    {
      id: 1,
      name: "Baghdad call center",
    },
    {
      id: 2,
      name: "Erbil call center",
    },
    {
      id: 3,
      name: "Review baghdad",
      parentId: 1,
    },
    {
      id: 4,
      name: "Review Cities",
      parentId: 1,
    },
    {
      id: 5,
      name: "Review Ticket",
      parentId: 2,
    },
  ],
});

console.log("client seed result: ", result);

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
      user: "sara",
      password: "Zxasqw1234",
      role: "CONTENT_WRITER",
      level: 2,
      centerId: 1,
    },
    {
      id: 3,
      user: "hendreen",
      password: "Zxasqw1234",
      role: "CONTENT_WRITER",
      level: 2,
      centerId: 1,
    },
    {
      id: 4,
      user: "firas",
      password: "Zxasqw1234",
      role: "CONTENT_READER",
      level: 3,
      centerId: 3,
    },
    {
      id: 5,
      user: "ahmad sabtti",
      password: "Zxasqw1234",
      role: "CONTENT_READER",
      level: 3,
      centerId: 4,
    },
    {
      id: 6,
      user: "mussa",
      password: "Zxasqw1234",
      role: "CONTENT_READER",
      level: 3,
      centerId: 5,
    },
    {
      id: 7,
      user: "tech1",
      password: "Zxasqw1234",
      role: "LOGESTICS_MANAGER",
      centerId: 5,
    },
  ],
});

console.log("admins seed result: ", result);

// seed category
result = await prismaClient.category.createMany({
  data: [
    {
      id: 1,
      name: "CAC",
      nameTranslated: "مركزي",
      image: "/uploads/categories/pc1.png",
    },
    {
      id: 2,
      name: "GMV",
      nameTranslated: "GMV",
      image: "/uploads/categories/pc2.png",
    },
  ],
});

console.log("category seed result: ", result);

// seed category
result = await prismaClient.subCategory.createMany({
  data: [
    {
      id: 1,
      categoryId: 1,
      name: "Cassette",
      nameTranslated: "سقفي",
      image: "/uploads/categories/c1.png",
    },
    {
      id: 2,
      categoryId: 1,
      name: "Chiller",
      nameTranslated: "تشيلر",
      image: "/uploads/categories/c2.png",
    },
    {
      id: 3,
      categoryId: 1,
      name: "Chiller (A Series)",
      nameTranslated: "تشيلر (الفئة A)",
      image: "/uploads/categories/c3.png",
    },
    {
      id: 4,
      categoryId: 1,
      name: "Chiller (D Series)",
      nameTranslated: "تشيلر (الفئة D)",
      image: "/uploads/categories/c4.png",
    },
    {
      id: 5,
      categoryId: 1,
      name: "Chiller (E Series)",
      nameTranslated: "تشيلر (الفئة E)",
      image: "/uploads/categories/c5.png",
    },
    {
      id: 6,
      categoryId: 1,
      name: "Chiller (MS Series)",
      nameTranslated: "تشلر (فئة MS)",
      image: "/uploads/categories/c6.png",
    },
    {
      id: 7,
      categoryId: 1,
      name: "Chiller (MSA Series)",
      nameTranslated: "تشلر (فئة MSA)",
      image: "/uploads/categories/c7.png",
    },
    {
      id: 8,
      categoryId: 2,
      name: "Ducted Unit",
      nameTranslated: "مكيف مخفي",
      image: "/uploads/categories/c8.png",
    },
    {
      id: 9,
      categoryId: 2,
      name: "1 - Way Cassette",
      nameTranslated: "سقفي منفذ1",
      image: "/uploads/categories/c9.png",
    },
    {
      id: 10,
      categoryId: 2,
      name: "2 - Way Cassette",
      nameTranslated: "سقفي منفذ 2",
      image: "/uploads/categories/c10.png",
    },
    {
      id: 11,
      categoryId: 2,
      name: "4 - Way Cassette",
      nameTranslated: "سقفي منفذ 4",
      image: "/uploads/categories/c11.png",
    },
    {
      id: 12,
      categoryId: 2,
      name: "8 - Way Cassette",
      nameTranslated: "سقفي منفذ 8",
      image: "/uploads/categories/c12.png",
    },
    {
      id: 13,
      categoryId: 2,
      name: "Wall Type",
      nameTranslated: "جداري",
      image: "/uploads/categories/c13.png",
    },
    {
      id: 14,
      categoryId: 2,
      name: "Floor Ceiling",
      nameTranslated: "سقفي أرضي",
      image: "/uploads/categories/c14.png",
    },
    {
      id: 15,
      categoryId: 2,
      name: "Floor Standing",
      nameTranslated: "عامودي",
      image: "/uploads/categories/c15.png",
    },
    {
      id: 16,
      categoryId: 2,
      name: "console",
      nameTranslated: "كونسول",
      image: "/uploads/categories/c16.png",
    },
    {
      id: 17,
      categoryId: 2,
      name: "Concealed Floor Standing",
      nameTranslated: "المكيف العامودي المخفي",
      image: "/uploads/categories/c17.png",
    },
    {
      id: 18,
      categoryId: 2,
      name: "AHU Kit",
      nameTranslated: "AHU Kit",
      image: "/uploads/categories/c18.png",
    },
    {
      id: 19,
      categoryId: 2,
      name: "Heat Recovery",
      nameTranslated: "المبادل الحراري",
      image: "/uploads/categories/c19.png",
    },
    {
      id: 20,
      categoryId: 2,
      name: "Heat Recovery Unit with Dx Coil",
      nameTranslated: "مبادل حراري مع كويل",
      image: "/uploads/categories/c20.png",
    },
  ],
});

console.log("category seed result: ", result);

// seed products
result = await prismaClient.product.create({
  data: {
    id: 1,
    subCategoryId: 1,
    name: "GUD18T/A-SE",
    nameTranslated: "GUD18T/A-SE",
    model: "ET01002250",
    image: "/uploads/products/p1.png",
    price: 1100,
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
    specification: `
Capacity	Cooling	KW	1.6 - 5.5
Heating	KW	1.5 - 6
EER/C.O.P		W/W	3.39/3.62
Power Supply		Ph,V,Hz	1Ph, 220 - 240, 50Hz
Power Input	Cooling 	KW	0.3-2
Heating	KW	0.3-2
Current	Cooling 	A	1.4-9
Heating	A	1.4-9

Indoor Unit			
Air Flow Volume	Indoor		580/480/400
Sound Pressure Level	Indoor	dB (A)	39/35/31
Outline Dimension	W*H*D	mm	570*265*570

Panel			
Dimension	W*H*D	mm	620*47.5*620
Code			TF05

Outdoor Unit			
Outline Dimension	Outdoor	mm	818*596*302
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	1/4''
Liquid	Inch	1/2''
Max. Distance	Height/ Length	m	15/20
    `,
    specificationTranslated: `
السعة	تبريد	KW	1.6 - 5.5
تدفئة	KW	1.5 - 6
EER/C.O.P معامل كفاءة الطاقة		W/W	3.39/3.62
مصدر الطاقة		Ph,V,Hz	1Ph, 220 - 240, 50Hz
استهلاك الكهرباء	تبريد	KW	0.3-2
تدفئة	KW	0.3-2
الأمبيرية	تبريد	A	1.4-9
تدفئة	A	1.4-9

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		580/480/400
مستوى الصوت	الوحدة الداخلية	dB (A)	39/35/31
قياس الجهاز	W*H*D	mm	570*265*570

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	620*47.5*620
الكود			TF05

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	818*596*302
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	1/4''
غاز	Inch	1/2''
المسافة القصوى	الارتفاع \ الطول	m	15/20
    `,
    catalogFile:
      "https://www.fujitsu-general.com/shared/pdf-feur-support-ctlg-3ef018-1712e-01.pdf",
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
    id: 4,
    subCategoryId: 1,
    name: "GUD24T/A-SE",
    nameTranslated: "GUD24T/A-SE",
    model: "ET01002070",
    image: "/uploads/products/p1.png",
    price: 1330,
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 2Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
    specification: `
Capacity	Cooling	KW	2.4 - 8
Heating	KW	2.2 - 9
EER/C.O.P		W/W	3.5/4
Power Supply		Ph,V,Hz	1Ph, 220 - 240, 50Hz
Power Input	Cooling 	KW	0.4 - 3
Heating	KW	0.4 - 3
Current	Cooling 	A	1.81 - 13.6
Heating	A	1.81 - 13.6

Indoor Unit			
Air Flow Volume	Indoor		1150/950/850
Sound Pressure Level	Indoor	dB (A)	45/41/39
Outline Dimension	W*H*D	mm	840*200*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	892*698*340
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	15/30
    `,
    specificationTranslated: `
السعة	تبريد	KW	2.4 - 8
تدفئة	KW	2.2 - 9
EER/C.O.P معامل كفاءة الطاقة		W/W	3.5/4
مصدر الطاقة		Ph,V,Hz	1Ph, 220 - 240, 50Hz
استهلاك الكهرباء	تبريد	KW	0.4 - 3
تدفئة	KW	0.4 - 3
الأمبيرية	تبريد	A	1.81 - 13.6
تدفئة	A	1.81 - 13.6

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1150/950/850
مستوى الصوت	الوحدة الداخلية	dB (A)	45/41/39
قياس الجهاز	W*H*D	mm	840*200*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF06

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	892*698*340
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	15/30
    `,
    items: {
      createMany: {
        data: [
          { sn: "341784194" },
          { sn: "341784195" },
          { sn: "341784196" },
          { sn: "341784197" },
          { sn: "341784198" },
        ],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 3,
            rating: 5,
            comment: "good quality",
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
    subCategoryId: 1,
    name: "GUD36T/A-SE",
    nameTranslated: "",
    model: "ET01002050",
    image: "/uploads/products/p1.png",
    price: 1725,
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 3Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 3 طن",
    specification: `
Capacity	Cooling	KW	3 - 10.55
Heating	KW	3 - 11.5
EER/C.O.P		W/W	3.1/3.7
Power Supply		Ph,V,Hz	1Ph, 220 - 240, 50Hz
Power Input	Cooling 	KW	0.5 - 3.5
Heating	KW	0.5 - 3.3
Current	Cooling 	A	2.27 - 16
Heating	A	2.27 - 15

Indoor Unit			
Air Flow Volume	Indoor		1450/1350/1200
Sound Pressure Level	Indoor	dB (A)	48/46/42
Outline Dimension	W*H*D	mm	840*240*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF04A

Outdoor Unit			
Outline Dimension	Outdoor	mm	920*790*370
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	15/30
    `,
    specificationTranslated: `
السعة	تبريد	KW	3 - 10.55
تدفئة	KW	3 - 11.5
EER/C.O.P معامل كفاءة الطاقة		W/W	3.1/3.7
مصدر الطاقة		Ph,V,Hz	1Ph, 220 - 240, 50Hz
استهلاك الكهرباء	تبريد	KW	0.5 - 3.5
تدفئة	KW	0.5 - 3.3
الأمبيرية	تبريد	A	2.27 - 16
تدفئة	A	2.27 - 15

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1450/1350/1200
مستوى الصوت	الوحدة الداخلية	dB (A)	48/46/42
قياس الجهاز	W*H*D	mm	840*240*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF04A

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	920*790*370
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	15/30
    `,
    items: {
      createMany: {
        data: [{ sn: "441784194" }, { sn: "441784195" }, { sn: "441784196" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 1,
    name: "GUD48T/A-SE",
    nameTranslated: "GUD48T/A-SE",
    model: "ET01002060",
    image: "/uploads/products/p1.png",
    price: 2200,
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 4Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 4 طن",
    specification: `
Capacity	Cooling	KW	4.2 - 14.07
Heating	KW	4.2 - 15
EER/C.O.P		W/W	2.8/3.3
Power Supply		Ph,V,Hz	1Ph, 220 - 240, 50Hz
Power Input	Cooling 	KW	1.2 - 5.5
Heating	KW	1.0 - 5.0
Current	Cooling 	A	5.45 - 25
Heating	A	4.54 - 27

Indoor Unit			
Air Flow Volume	Indoor		1700/1500/1300
Sound Pressure Level	Indoor	dB (A)	49/46/42
Outline Dimension	W*H*D	mm	840*290*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF04A

Outdoor Unit			
Outline Dimension	Outdoor	mm	940*820*460
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	30/50
    `,
    specificationTranslated: `
السعة	تبريد	KW	4.2 - 14.07
تدفئة	KW	4.2 - 15
EER/C.O.P معامل كفاءة الطاقة		W/W	2.8/3.3
مصدر الطاقة		Ph,V,Hz	1Ph, 220 - 240, 50Hz
استهلاك الكهرباء	تبريد	KW	1.2 - 5.5
تدفئة	KW	1.0 - 5.0
الأمبيرية	تبريد	A	5.45 - 25
تدفئة	A	4.54 - 27

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1700/1500/1300
مستوى الصوت	الوحدة الداخلية	dB (A)	49/46/42
قياس الجهاز	W*H*D	mm	840*290*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF04A

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	940*820*460
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	30/50
    `,
    items: {
      createMany: {
        data: [{ sn: "641784194" }, { sn: "641784195" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    id: 3,
    subCategoryId: 1,
    name: "GUD60T/A-SE",
    nameTranslated: "GUD60T/A-SE",
    model: "ET01002220",
    image: "/uploads/products/p1.png",
    price: 2300,
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, Heat pump, R410a, T3, Nominal Capacity: 5Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، انفيرتر، تبريد وتدفئة، غاز 410a، السعة: 5 طن",
    specification: `
Capacity	Cooling	KW	5.4 - 15.83
Heating	KW	5.4 - 17.45
EER/C.O.P		W/W	2.8/3/3
Power Supply		Ph,V,Hz	1Ph, 220 - 240, 50Hz
Power Input	Cooling 	KW	1.4 - 5.6
Heating	KW	1.2 - 5
Current	Cooling 	A	6.36 - 27
Heating	A	5.45 - 27

Indoor Unit			
Air Flow Volume	Indoor		1900/1600/1400
Sound Pressure Level	Indoor	dB (A)	52/50/48
Outline Dimension	W*H*D	mm	840*290*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF04A

Outdoor Unit			
Outline Dimension	Outdoor	mm	900*1345*340
Fan			Double
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	30/50
    `,
    specificationTranslated: `
السعة	تبريد	KW	5.4 - 15.83
تدفئة	KW	5.4 - 17.45
EER/C.O.P معامل كفاءة الطاقة		W/W	2.8/3/3
مصدر الطاقة		Ph,V,Hz	1Ph, 220 - 240, 50Hz
استهلاك الكهرباء	تبريد	KW	1.4 - 5.6
تدفئة	KW	1.2 - 5
الأمبيرية	تبريد	A	6.36 - 27
تدفئة	A	5.45 - 27

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1900/1600/1400
مستوى الصوت	الوحدة الداخلية	dB (A)	52/50/48
قياس الجهاز	W*H*D	mm	840*290*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF04A

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	900*1345*340
المروحة			Double
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	30/50
    `,
    items: {
      createMany: {
        data: [{ sn: "741784197" }, { sn: "741784198" }],
      },
    },
    reviews: {
      createMany: {
        data: [
          {
            clientId: 1,
            rating: 5,
            comment: "best device22",
          },
          {
            clientId: 3,
            rating: 5,
            comment: "high quality22",
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
    subCategoryId: 1,
    name: "GUD18T/A-KE",
    nameTranslated: "GUD18T/A-KE",
    model: "ET010N2240",
    image: "/uploads/products/p2.png",
    price: 895,
    description:
      "GREE Cassette Split, 8-way, ON/OFF, Heat pump, R410a, T3, Nominal Capacity: 1.5Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 1.5 طن",
    specification: `
Function			Cooling/Heating
Capacity	Cooling	KW	5.3
Heating	KW	5.7
EER/C.O.P		W/W	3.44/3.85
Power Supply		Ph,V,Hz	220-240V/50Hz/1Ph
Power Input	Cooling 	KW	1.54
Heating	KW	1.48
Current	Cooling 	A	7
Heating	A	6.7

Indoor Unit			
Air Flow Volume	Indoor		650/600/500
Sound Pressure Level	Indoor	dB (A)	41/39/36
Outline Dimension	W*H*D	mm	570*265*570

Panel			
Dimension	W*H*D	mm	620*47.5*620
Code			TF05

Outdoor Unit			
Outline Dimension	Outdoor	mm	818*596*302
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	1/4''
Liquid	Inch	1/2''
Max. Distance	Height/ Length	m	15/20
    `,
    specificationTranslated: `
السعة	تبريد	KW	5.3
تدفئة	KW	5.7
EER/C.O.P معامل كفاءة الطاقة		W/W	3.44/3.85
مصدر الطاقة		Ph,V,Hz	220-240V/50Hz/1Ph
استهلاك الكهرباء	تبريد	KW	1.54
تدفئة	KW	1.48
الأمبيرية	تبريد	A	7
تدفئة	A	6.7

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		650/600/500
مستوى الصوت	الوحدة الداخلية	dB (A)	41/39/36
قياس الجهاز	W*H*D	mm	570*265*570

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	620*47.5*620
الكود			TF05

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	818*596*302
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	1/4''
غاز	Inch	1/2''
المسافة القصوى	الارتفاع \ الطول	m	15/20
  
    `,
    items: {
      createMany: {
        data: [{ sn: "841784197" }, { sn: "841784198" }],
      },
    },
    reviews: {
      createMany: {
        data: [
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
    subCategoryId: 1,
    name: "GU30T/A-KE",
    nameTranslated: "GU30T/A-KE",
    model: "ET010N2010",
    image: "/uploads/products/p2.png",
    price: 1170,
    description:
      "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2.5 Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2.5 طن",
    specification: `
Function			Cooling/Heating
Capacity	Cooling	KW	8.3
Heating	KW	9.2
EER/C.O.P		W/W	3.13/3.68
Power Supply		Ph,V,Hz	220-240V/50Hz/1Ph
Power Input	Cooling 	KW	2.65
Heating	KW	2.5
Current	Cooling 	A	12.05
Heating	A	11.36
4			
Indoor Unit			
Air Flow Volume	Indoor		1150/1000/900
Sound Pressure Level	Indoor	dB (A)	45/42/39
Outline Dimension	W*H*D	mm	840*240*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	892*698*340
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	15/30
    `,
    specificationTranslated: `
السعة	تبريد	KW	8.3
تدفئة	KW	9.2
EER/C.O.P معامل كفاءة الطاقة		W/W	3.13/3.68
مصدر الطاقة		Ph,V,Hz	220-240V/50Hz/1Ph
استهلاك الكهرباء	تبريد	KW	2.65
تدفئة	KW	2.5
الأمبيرية	تبريد	A	12.05
تدفئة	A	11.36

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1150/1000/900
مستوى الصوت	الوحدة الداخلية	dB (A)	45/42/39
قياس الجهاز	W*H*D	mm	840*240*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF06

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	892*698*340
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	15/30

    `,
    items: {
      createMany: {
        data: [{ sn: "941784197" }, { sn: "941784198" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 1,
    name: "GU36T/A-KE",
    nameTranslated: "GU36T/A-KE",
    model: "ET010N1950",
    image: "/uploads/products/p2.png",
    price: 1350,
    description:
      "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 3 Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 3 طن",
    specification: `
Function			Cooling/Heating
Capacity	Cooling	KW	9.96
Heating	KW	11.5
EER/C.O.P		W/W	2.89/3.38
Power Supply		Ph,V,Hz	220-240V/50Hz/1Ph
Power Input	Cooling 	KW	3.45
Heating	KW	3.4
Current	Cooling 	A	15.68
Heating	A	15.45
4			
Indoor Unit			
Air Flow Volume	Indoor		1500/1400/1300
Sound Pressure Level	Indoor	dB (A)	50/48/45
Outline Dimension	W*H*D	mm	840*240*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	920*790*370
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	15/30
    `,
    specificationTranslated: `
السعة	تبريد	KW	9.96
تدفئة	KW	11.5
EER/C.O.P معامل كفاءة الطاقة		W/W	2.89/3.38
مصدر الطاقة		Ph,V,Hz	220-240V/50Hz/1Ph
استهلاك الكهرباء	تبريد	KW	3.45
تدفئة	KW	3.4
الأمبيرية	تبريد	A	15.68
تدفئة	A	15.45
    
الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1500/1400/1300
مستوى الصوت	الوحدة الداخلية	dB (A)	50/48/45
قياس الجهاز	W*H*D	mm	840*240*840
    
لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF06
    
الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	920*790*370
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	15/30
    `,
    items: {
      createMany: {
        data: [{ sn: "141784197" }, { sn: "141784198" }],
      },
    },
    reviews: {
      createMany: {
        data: [
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
    subCategoryId: 1,
    name: "GU48T/A-KE",
    nameTranslated: "GU48T/A-KE",
    model: "ET010N1960",
    image: "/uploads/products/p2.png",
    price: 1800,
    description:
      "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 4 Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 4 طن",
    specification: `
Function			Cooling/Heating
Capacity	Cooling	KW	14.01
Heating	KW	15.1
EER/C.O.P		W/W	3.11/3.51
Power Supply		Ph,V,Hz	380-415V/50Hz/3Ph
Power Input	Cooling 	KW	4.5
Heating	KW	4.3
Current	Cooling 	A	8.49
Heating	A	8.11
4			
Indoor Unit			
Air Flow Volume	Indoor		1900/1800/1600
Sound Pressure Level	Indoor	dB (A)	51/47/45
Outline Dimension	W*H*D	mm	840*290*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	940*820*460
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	30/50
    `,
    specificationTranslated: `
السعة	تبريد	KW	14.01
تدفئة	KW	15.1
EER/C.O.P معامل كفاءة الطاقة		W/W	3.11/3.51
مصدر الطاقة		Ph,V,Hz	380-415V/50Hz/3Ph
استهلاك الكهرباء	تبريد	KW	4.5
تدفئة	KW	4.3
الأمبيرية	تبريد	A	8.49
تدفئة	A	8.11

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1900/1800/1600
مستوى الصوت	الوحدة الداخلية	dB (A)	51/47/45
قياس الجهاز	W*H*D	mm	840*290*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF06

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	940*820*460
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	30/50
    `,
    items: {
      createMany: {
        data: [{ sn: "441784197" }, { sn: "441784198" }],
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
    subCategoryId: 1,
    name: "GU60T/A-KE",
    nameTranslated: "GU60T/A-KE",
    model: "ET010N2080",
    image: "/uploads/products/p2.png",
    price: 2100,
    description:
      "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 5 Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 5 طن",
    specification: `
Capacity	Cooling	KW	15
Heating	KW	16.8
EER/C.O.P		W/W	2.97/3.36
Power Supply		Ph,V,Hz	380-415V/50Hz/3Ph
Power Input	Cooling 	KW	5.05
Heating	KW	5
Current	Cooling 	A	9.53
Heating	A	9.43
4			
Indoor Unit			
Air Flow Volume	Indoor		1900/1800/1600
Sound Pressure Level	Indoor	dB (A)	51/48/47
Outline Dimension	W*H*D	mm	840*290*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	900*1345*340
Fan			Double
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	30/50
    `,
    specificationTranslated: `
    السعة	تبريد	KW	15
    تدفئة	KW	16.8
  EER/C.O.P معامل كفاءة الطاقة		W/W	2.97/3.36
  مصدر الطاقة		Ph,V,Hz	380-415V/50Hz/3Ph
  استهلاك الكهرباء	تبريد	KW	5.05
    تدفئة	KW	5
  الأمبيرية	تبريد	A	9.53
    تدفئة	A	9.43
        
  الوحدة الداخلية			
  تدفق الهواء	الوحدة الداخلية		1900/1800/1600
  مستوى الصوت	الوحدة الداخلية	dB (A)	51/48/47
  قياس الجهاز	W*H*D	mm	840*290*840
        
  لوحة الجهاز			
  قياس الجهاز	W*H*D	mm	950*52*950
  الكود			TF06
        
  الوحدة الخارجية			
  قياس الجهاز	الوحدة الخارجية	mm	900*1345*340
  المروحة			Double
  توصيلات الأنابيب			
  قطر الأنابيب	سائل	Inch	3/8''
    غاز	Inch	5/8''
  المسافة القصوى	الارتفاع \ الطول	m	30/50  
    `,
    items: {
      createMany: {
        data: [{ sn: "541784197" }, { sn: "541784198" }],
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
    subCategoryId: 1,
    name: "GU24T/A-KE",
    nameTranslated: "GU24T/A-KE",
    model: "ET010N1970",
    image: "/uploads/products/p2.png",
    price: 1125,
    description:
      "GREE Eco Cassette Split , 8-way, ON/OFF, Cool and Heat, R410a, T3, Nominal Capacity: 2 Ton.",
    descriptionTranslated:
      "سبليت كري السقفي، 8 اتجاهات، أونأوف، تبريد وتدفئة، غاز 410a، السعة: 2 طن",
    specification: `
Capacity	Cooling	KW	7.1
Heating	KW	7.4
EER/C.O.P		W/W	3.3/3.61
Power Supply		Ph,V,Hz	220-240V/50Hz/1Ph
Power Input	Cooling 	KW	2.15
Heating	KW	2.05
Current	Cooling 	A	9.77
Heating	A	9.32

Indoor Unit			
Air Flow Volume	Indoor		1150/1000/900
Sound Pressure Level	Indoor	dB (A)	45/42/39
Outline Dimension	W*H*D	mm	840*240*840

Panel			
Dimension	W*H*D	mm	950*52*950
Code			TF06

Outdoor Unit			
Outline Dimension	Outdoor	mm	892*698*340
Fan			Single
Connection Pipe			
Pipe Diameter	Gas	Inch	3/8''
Liquid	Inch	5/8''
Max. Distance	Height/ Length	m	15/30
    `,
    specificationTranslated: `
السعة	تبريد	KW	7.1
تدفئة	KW	7.4
EER/C.O.P معامل كفاءة الطاقة		W/W	3.3/3.61
مصدر الطاقة		Ph,V,Hz	220-240V/50Hz/1Ph
استهلاك الكهرباء	تبريد	KW	2.15
تدفئة	KW	2.05
الأمبيرية	تبريد	A	9.77
تدفئة	A	9.32

الوحدة الداخلية			
تدفق الهواء	الوحدة الداخلية		1150/1000/900
مستوى الصوت	الوحدة الداخلية	dB (A)	45/42/39
قياس الجهاز	W*H*D	mm	840*240*840

لوحة الجهاز			
قياس الجهاز	W*H*D	mm	950*52*950
الكود			TF06

الوحدة الخارجية			
قياس الجهاز	الوحدة الخارجية	mm	892*698*340
المروحة			Single
توصيلات الأنابيب			
قطر الأنابيب	سائل	Inch	3/8''
غاز	Inch	5/8''
المسافة القصوى	الارتفاع \ الطول	m	15/30  
    `,
    items: {
      createMany: {
        data: [{ sn: "7417841917" }, { sn: "7417841918" }],
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
    subCategoryId: 2,
    name: "Air Cooled Scroll Chiller",
    nameTranslated: "Chiller نوع Scroll مبرد بالهواء",
    model: "35325253242",
    image: "/uploads/products/g1-1.png",
    description: "Split Type Air Cooled Scroll Chiller (R410)",
    descriptionTranslated: "سبلت Chiller نوع Scroll مبرد بالهواء غاز 410a",
    specification: `
Capacity Range (KW)
8.0 - 15
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
8.0 - 15
    `,
    items: {
      createMany: {
        data: [{ sn: "11323489" }, { sn: "11323479" }, { sn: "11323469" }],
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
    subCategoryId: 2,
    name: "Mini Chiller",
    nameTranslated: "Mini Chiller",
    model: "",
    image: "/uploads/products/g1-3.png",
    description: "Inverter Mini Chiller with heat pump (R410)",
    descriptionTranslated: "ميني تشيلر، انفيرتر مع مضخة تدفئة، غاز 410a",
    specification: `
Capacity Range (KW)
8.0 - 14
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
8.0 - 14
    `,
    items: {
      createMany: {
        data: [{ sn: "31323489" }, { sn: "31323479" }, { sn: "31323469" }],
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
    subCategoryId: 4,
    name: "Modular Air-cooled Scroll Chiller",
    nameTranslated: "Chiller نوع Scroll مبرد بالهواء",
    model: "8789787979",
    image: "/uploads/products/g1-4.png",
    description: "Modular Air-cooled Scroll Chiller with Heat Pump (R410)",
    descriptionTranslated:
      "تشيلر نوع سكرول مبرد بالهواء، مع مضخة تدفئة، غاز 410a",
    specification: `
Capacity Range (KW)
60 - 280
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
60 - 280
    `,
    items: {
      createMany: {
        data: [{ sn: "41323489" }, { sn: "41323479" }, { sn: "41323469" }],
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
    subCategoryId: 5,
    name: "Modular Air-cooled Scroll Chiller",
    nameTranslated: "Chiller نوع Scroll مبرد بالهواء",
    model: "35324214214",
    image: "/uploads/products/g1-5.png",
    description: "Modular Air-cooled Scroll Chiller with Heat Pump (R410)",
    descriptionTranslated:
      "تشيلر نوع سكرول مبرد بالهواء، مع مضخة تدفئة، غاز 410a",
    specification: `
Capacity Range (KW)
65 - 160
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
65 - 160
    `,
    items: {
      createMany: {
        data: [{ sn: "51323489" }, { sn: "51323479" }, { sn: "51323469" }],
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
    subCategoryId: 3,
    name: "Inverter Modular Air-cooled  Chiller",
    nameTranslated: "تشيلر انفيرتر مبرد بالهواء",
    model: "34532985289752",
    image: "/uploads/products/g1-6.png",
    description: "Inverter Modular Air-cooled  Chiller with Heat Pump (R410)",
    descriptionTranslated:
      "تشيلر انفيرتر مبرد بالهواء، مع مضخة تدفئة، غاز 410a",
    specification: `
Capacity Range (KW)
35 - 70
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
35 - 70
    `,
    items: {
      createMany: {
        data: [{ sn: "61323489" }, { sn: "61323479" }, { sn: "61323469" }],
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
    subCategoryId: 6,
    name: "Shell and Tube Scroll Chiller",
    nameTranslated: "Shell and Tube Chiller Screw Type",
    model: "786969876986",
    image: "/uploads/products/g1-7.png",
    description: "Shell and Tube Water Source Heat Pump Scroll Chiller (R410)",
    descriptionTranslated:
      "شل آند تيوب تشيلر نوع سكرول، مع مضخة تدفئة، غاز 410a",
    specification: `
Capacity Range (KW)
39 - 300
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
39 - 300
    `,
    items: {
      createMany: {
        data: [{ sn: "71323489" }, { sn: "71323479" }, { sn: "71323469" }],
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
    subCategoryId: 7,
    name: "Modular Water-cooled  Chiller",
    nameTranslated: "Chiller مبرد بالماء",
    model: "87689679876987",
    image: "/uploads/products/g1-8.png",
    description: "Modular Water-cooled  Chiller (R410)",
    descriptionTranslated: "تشيلر مبرد بالماء، غاز 410a",
    specification: `
Capacity Range (KW)
39 - 300
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
39 - 300
    `,
    items: {
      createMany: {
        data: [{ sn: "81323489" }, { sn: "81323479" }, { sn: "81323469" }],
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
    subCategoryId: 2,
    name: " Modular Air-cooled  Screw Chiller",
    nameTranslated: "Chiller نوع Screw مبرد بالهواء",
    model: "88698769876",
    image: "/uploads/products/g1-9.png",
    description: " High Efficency Modular Air-cooled  Screw Chiller (R134)",
    descriptionTranslated: "تشيلر عالي الكفاءة نوع سكرو مبرد بالهواء، غاز 134",
    specification: `
Capacity Range (KW)
320 - 1720
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
320 - 1720
    `,
    items: {
      createMany: {
        data: [{ sn: "91323489" }, { sn: "91323479" }, { sn: "91323469" }],
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
    subCategoryId: 2,
    name: "Water-cooled  Screw Chiller",
    nameTranslated: "Chiller نوع Screw مبرد بالماء",
    model: "463453252",
    image: "/uploads/products/g1-10.png",
    description: " High Efficency Water-cooled  Screw Chiller (R134)",
    descriptionTranslated: "تشيلر عالي الكفاءة نوع سكرو مبرد بالماء، غاز 134",
    specification: `
Capacity Range (KW)
261 - 2101
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
261 - 2101
    `,
    items: {
      createMany: {
        data: [{ sn: "101323489" }, { sn: "101323479" }, { sn: "101323469" }],
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
    subCategoryId: 8,
    name: "High Static Pressure Ducted Unit",
    nameTranslated: "مكيف مخفي كري ذو ضغط استاتيكي عالي",
    model: "2359823935872",
    image: "/uploads/products/g2-1.png",
    description: "GREE GMV, High Static Ducted, Indoor unit",
    descriptionTranslated: "كري، GMV، مكيف مخفي ذو ضغط استاتيكي عالي",
    specification: `
Capacity Range (KW)
2.2 - 56
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.2 - 56
    `,
    items: {
      createMany: {
        data: [{ sn: "16983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 8,
    name: "General Static Pressure Ducted Unit",
    nameTranslated: "مكيف مخفي، كري، ذو ضغط استاتيكي متوسط",
    model: "77769879769876",
    image: "/uploads/products/g2-2.png",
    description: "GREE GMV, Low Static Ducted, Indoor unit",
    descriptionTranslated: "كري، GMV، مكيف مخفي ذو ضغط استاتيكي متوسط",
    specification: `
Capacity Range (KW)
1.8 - 14
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
1.8 - 14
    `,
    items: {
      createMany: {
        data: [{ sn: "26983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 11,
    name: "Cassette Unit",
    nameTranslated: "سقفي",
    model: "983752985712",
    image: "/uploads/products/g2-3.png",
    description: "GREE GMV- 4 - Way Cassette, Indoor Unit",
    descriptionTranslated: "كري، GMV، مكيف سقفي، 4 اتجاهات ",
    specification: `
Capacity Range (KW)
2.8 - 16
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.8 - 16
    `,
    items: {
      createMany: {
        data: [{ sn: "36983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 12,
    name: "Cassette Unit",
    nameTranslated: "سقفي",
    model: "35972358",
    image: "/uploads/products/g2-4.png",
    description: "GREE GMV- 8 - Way Cassette, Indoor Unit",
    descriptionTranslated: "كري، GMV، مكيف سقفي، 8 اتجاهات ",
    specification: `
Capacity Range (KW)
2.2 - 16
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.2 - 16
    `,
    items: {
      createMany: {
        data: [{ sn: "46983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 12,
    name: "Cassette Unit",
    nameTranslated: "سقفي",
    model: "879879876986",
    image: "/uploads/products/g2-5.png",
    description: "GREE GMV- 8 - Way Cassette Compact, Indoor Unit",
    descriptionTranslated: "كري، GMV، مكيف سقفي، كومباكت، 8 اتجاهات ",
    specification: `
Capacity Range (KW)
1.5 - 5.6
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
1.5 - 5.6
    `,
    items: {
      createMany: {
        data: [{ sn: "56983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 10,
    name: "Cassette Unit",
    nameTranslated: "سقفي",
    model: "295839257583",
    image: "/uploads/products/g2-6.png",
    description: "GREE GMV- 2 - Way Cassette, Indoor Unit",
    descriptionTranslated: "كري، GMV، مكيف سقفي، اتجاهين",
    specification: `
Capacity Range (KW)
2.8 - 8
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.8 - 8
    `,
    items: {
      createMany: {
        data: [{ sn: "66983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 9,
    name: "Cassette Unit",
    nameTranslated: "سقفي",
    model: "9358329527387",
    image: "/uploads/products/g2-7.png",
    description: "GREE GMV- 1 - Way Cassette, Indoor Unit",
    descriptionTranslated: "كري، GMV، مكيف سقفي، اتجاه واحد",
    specification: `
Capacity Range (KW)
2.8 - 5.6
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.8 - 5.6
    `,
    items: {
      createMany: {
        data: [{ sn: "76983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 8,
    name: "Fresh Air Processing Indoor Unit",
    nameTranslated: "الوحدة الداخلية لدفع الهواء النقي",
    model: "5746583764564654",
    image: "/uploads/products/g2-8.png",
    description: "GREE GMV fresh air ducted indoor unit",
    descriptionTranslated: "كري GMV، الوحدة الداخلية لدفع الهواء النقي",
    specification: `
Capacity Range (KW)
12.5 - 45
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
12.5 - 45
    `,
    items: {
      createMany: {
        data: [{ sn: "86983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 13,
    name: "Wall Mounted Type Unit",
    nameTranslated: "المكيف الجداري",
    model: "9878786868",
    image: "/uploads/products/g2-9.png",
    description: "GREE GMV, Wall Type Indoor unit",
    descriptionTranslated: "كري GMV، المكيف الجداري",
    specification: `
Capacity Range (KW)
1.5 - 10
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
1.5 - 10
    `,
    items: {
      createMany: {
        data: [{ sn: "96983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 14,
    name: "Floor Ceiling Type",
    nameTranslated: "المكيف السقفي  الأرضي",
    model: "3523536252",
    image: "/uploads/products/g2-10.png",
    description: "GREE GMV,Floor CeilingType Indoor unit",
    descriptionTranslated: "كري GMV، المكيف السقفي  الأرضي",
    specification: `
Capacity Range (KW)
2.8 - 16
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.8 - 16
    `,
    items: {
      createMany: {
        data: [{ sn: "106983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 15,
    name: "Floor Standing Type",
    nameTranslated: "المكيف العامودي",
    model: "398251935812784",
    image: "/uploads/products/g2-11.png",
    description: "GREE GMV, Floor Standing Type Indoor unit",
    descriptionTranslated: "كري GMV، المكيف العامودي",
    specification: `
Capacity Range (KW)
10 & 14
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
10 & 14
    `,
    items: {
      createMany: {
        data: [{ sn: "116983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 16,
    name: "Console Indoor Unit",
    nameTranslated: "CONSOLE",
    model: "32083254698",
    image: "/uploads/products/g2-12.png",
    description: "GREE GMV, Console Type Indoor unit",
    descriptionTranslated: "كري، CONSOLE، GMV ",
    specification: `
Capacity Range (KW)
2.2 - 5
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.2 - 5
    `,
    items: {
      createMany: {
        data: [{ sn: "12983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 17,
    name: "Concealed Floor Standing",
    nameTranslated: "المكيف العامودي المخفي",
    model: "34598348399",
    image: "/uploads/products/g2-13.png",
    description: "GREE GMV, Concealed Floor Standing Indoor unit",
    descriptionTranslated: "كري جي أم في، المكيف العامودي المخفي",
    specification: `
Capacity Range (KW)
2.2 - 7.1
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
2.2 - 7.1
    `,
    items: {
      createMany: {
        data: [{ sn: "136983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 18,
    name: "AHU Kit",
    nameTranslated: "AHU Kit",
    model: "305823952778",
    image: "/uploads/products/g2-14.png",
    description: "GREE AHU kit",
    descriptionTranslated: "GREE AHU kit",
    specification: `
Capacity Range (KW)
3.6 - 56
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
3.6 - 56
    `,
    items: {
      createMany: {
        data: [{ sn: "146983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 19,
    name: "Heat Recovery Unit",
    nameTranslated: "المبادل الحراري",
    model: "23545726153657",
    image: "/uploads/products/g2-15.png",
    description: "GREE Heat Recovery Unit",
    descriptionTranslated: "كري GMV، المبادل الحراري",
    specification: `
Capacity Range (KW)
350 - 2800
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
350 - 2800
    `,
    items: {
      createMany: {
        data: [{ sn: "156983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 20,
    name: "Heat Recovery Unit with Dx Coil",
    nameTranslated: "مبادل حراري مع كويل",
    model: "463636534756",
    image: "/uploads/products/g2-16.png",
    description:
      "GREE Heat Recovery Unit with Dx Coil for fresh air processing",
    descriptionTranslated: "كري GMV، مبادل حراري مع كويل لدفع الهواء النقي",
    specification: `
Capacity Range (KW)
500 - 1000
    `,
    specificationTranslated: `
الاستطاعة (كيلوواط)
500 - 1000
    `,
    items: {
      createMany: {
        data: [{ sn: "1606983725927" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 13,
    name: "GREE Pular On-Off",
    nameTranslated: "GREE Pular On-Off",
    model: "GWH12AGCXB-K3NTA1A",
    image: "/uploads/products/p8.png",
    description:
      "GREE Wall Split, Pular, ON/OFF, R410a, Cool & Heat, T3, with 4m pipe, Nom. Cap: 1 Ton",
    descriptionTranslated: "مكيف حائط, مفتاح تشغيل اطفاء 1 طن",
    specification: "comming soon...",
    specificationTranslated: "سيتم ادخال البيانات قريباً",
    items: {
      createMany: {
        data: [
          { sn: "4T58310004747" },
          { sn: "4T58410002151" },
          { sn: "4T58310004836" },
          { sn: "4T58410002169" },
        ],
      },
    },
  },
});

result = await prismaClient.product.create({
  data: {
    subCategoryId: 12,
    name: "GREE Cassette Inverter",
    nameTranslated: "GREE Cassette Inverter",
    model: "GUD18TASF5/GUTD18WAS",
    image: "/uploads/products/p9.png",
    description:
      "GREE Cassette Split, 8-way, Eco-Inverter, C/H, R410a, T3, Nominal Capacity: 1.5 Ton",
    descriptionTranslated: "سقفي 1.5 طن",
    specification: "comming soon...",
    specificationTranslated: "سيتم ادخال البيانات قريباً",
    items: {
      createMany: {
        data: [
          { sn: "9AC9920000553" },
          { sn: "9ADO120000627" },
          { sn: "9P40130002562" },
          { sn: "9P40130009925" },
          { sn: "9AD0120000829" },
          { sn: "9AC9930000032" },
        ],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 4,
    name: "GREE Window",
    nameTranslated: "مكيف نافذة",
    model: "GJE24AE-K3NMTG1C",
    image: "/uploads/products/p10.png",
    description:
      "GREE Air conditioner, Window type, ON/OFF, R410a, Nominal capacity: 2 Ton.",
    descriptionTranslated: "نافذة سعة 2 طن",
    specification: "comming soon...",
    specificationTranslated: "سيتم ادخال البيانات قريباً",
    items: {
      createMany: {
        data: [{ sn: "2101810002878" }, { sn: "2101830004885" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 20,
    name: "GREE Outdoor unit",
    nameTranslated: "مكيف خارجي",
    model: "GMV-680WM/B-X (P)",
    image: "/uploads/products/p11.png",
    description:
      "GREE GMV, Multi VRF, Outdoor, Inverter, T3,  Modular, Nominal Cap:68 KW.",
    descriptionTranslated: "سيتم ادخال التفاصيل قريبا",
    items: {
      createMany: {
        data: [{ sn: "9CB4130000082" }, { sn: "9CB4120000054" }],
      },
    },
  },
});

console.log("product seed result: ", result);

result = await prismaClient.product.create({
  data: {
    subCategoryId: 5,
    name: "GREE Indoor unit",
    nameTranslated: "جهاز تكييف داخلي",
    model: "GMV-ND112T/A-T",
    image: "/uploads/products/p12.png",
    description:
      "GMV- Four Way Cassette, Indoor Unit, Nominal Capacity: 11.2 KW.",
    descriptionTranslated: "سيتم ادخال التفاصيل قريباً",
    items: {
      createMany: {
        data: [{ sn: "8600030000111" }, { sn: "8600030000093" }],
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
      productSn: "9AC9920000553",
    },
    {
      clientId: 1,
      productSn: "136983725927",
    },
    {
      clientId: 2,
      productSn: "116983725927",
    },
  ],
});

console.log("product on clients review seed result: ", result);

// seed orders
result = await prismaClient.order.create({
  data: {
    clientId: 1,
    address: "Zahera-Damascus-Syria",
    isDraft: false,
    status: "ACCEPTED",
    note: "no comment",
    products: {
      create: [
        {
          productId: 1,
          count: 2,
          price: 100,
        },
        {
          productId: 2,
          count: 1,
          price: 150,
        },
      ],
    },
    offer: {
      create: {
        adminId: 1,
        price: 320,
        validationDays: 3,
      },
    },
  },
});

console.log("order seed result: ", result);

result = await prismaClient.order.create({
  data: {
    clientId: 2,
    address: "Muhajreen-Damascus-Syria",
    isDraft: true,
    status: "PENDING",
    note: "no comment",
    products: {
      create: [
        {
          productId: 3,
          count: 5,
          price: 120,
        },
      ],
    },
  },
});

console.log("order seed result: ", result);
