import { PrismaClient } from "@prisma/client";
import fs from "fs";
import readLine from "readline";

// define database consts
const prismaClient = new PrismaClient();

const subCategoryId = 52;
const isDisabled = true;
const image = "/uploads/categories/c-1702762747730.png";
const model = "-";

// insert function
const createProduct = async (line: string) => {
  // extract product name and sn
  const sn = line.substring(0, line.indexOf(","));
  const productName = line.substring(line.indexOf(",") + 1);
  // check product if exists
  let productId = 0;
  const product = await prismaClient.product.findUnique({
    where: { name_model: { name: productName, model } },
    select: { id: true },
  });

  if (product === null) {
    const newProduct = await prismaClient.product.create({
      data: {
        name: productName,
        nameTranslated: productName,
        model,
        image,
        isDisabled,
        subCategoryId,
      },
      select: { id: true },
    });

    console.log("new product has created: ", productName);

    productId = newProduct.id;
  } else productId = product.id;

  // create sn
  try {
    await prismaClient.productItem.create({ data: { sn, productId, }, });
  } catch (ex) {
    console.log("error while creating sn: ", sn);
  }
};

// read file line by line
const fileStream = fs.createReadStream("../docs/products/bar-codes.csv");
const readlineInterface = readLine.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

//readlineInterface.on("line", async (line) => await createProduct(line));
readlineInterface.on("close", () => console.log("seeding is completed"));

async function processLines() {
  for await (const line of readlineInterface) await createProduct(line);
}

processLines().then(() => readlineInterface.close());
