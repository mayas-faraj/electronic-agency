const typeDefs = `#graphql
	extend type Query {
        products(subCategoryId: Int, pagination: Pagination, filter: SearchFilter): [ProductBasic]
        productsByIds(idList: [Int]!): [ProductBasic]
				productsCount: AggregateResult
				product(id: Int!): Product
				productItem(sn: String!): ProductItem
				productItems(snList: [String]!): [ProductItem]
				productItemsByAuth: [ProductItem]
    }

    extend type Mutation {
        createProduct(input: ProductInput!): ProductBasic
				updateProduct(id: Int!, input: ProductUpdate!): ProductBasic
				deleteProduct(id: Int!): ProductBasic
				createProductItems(productId: Int!, snList: [String]!): ImportReport
				updateProductItem(sn: String!, newSn: String!): ProductItemBasic
				deleteProductItem(sn: String!): ProductItemBasic
				updateProductItemSold(sn: String!, isSold: Boolean!): ProductItemBasic
				createProductItemOnClientByAuth(sn: String!): ProductItemOnClient
				deleteProductItemOnClientByAuth(sn: String!): ProductItemOnClient
    }

    type Product {
		id: Int!
		name: String!
		nameTranslated: String!
		model: String
		image: String
		description: String
		descriptionTranslated: String
		specification: String
		specificationTranslated: String
		specificationImage: String
		catalogFile: String
		price: Float
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		subCategory: SubCategory
		items: [ProductItemBasic]
	}

	type ProductBasic {
		id: Int!
		name: String!
		nameTranslated: String!
		model: String
		image: String
		description: String
		descriptionTranslated: String
		specification: String
		specificationTranslated: String
		specificationImage: String
		catalogFile: String,
		price: Float
		isDisabled: Boolean
	}

	input ProductInput {
		subCategoryId: Int!
		name: String!
		nameTranslated: String!
		model: String
		image: String
		description: String
		descriptionTranslated: String
		specification: String
		specificationTranslated: String
		specificationImage: String
		catalogFile: String
		price: Float
	}

	input ProductUpdate {
		subCategoryId: Int
		name: String
		nameTranslated: String
		model: String
		image: String
		description: String
		descriptionTranslated: String
		specification: String
		specificationTranslated: String
		specificationImage: String
		catalogFile: String
		price: Float
		isDisabled: Boolean
	}

	type ProductItemBasic {
		sn: String
		isSold: Boolean
		createdAt: String
	}

	type ProductItem {
		sn: String
		isSold: Boolean
		createdAt: String
		product: ProductBasic
		client: ProductItemOnClient
	}

	type ProductItemOnClient {
		productSn: String
		clientId: Int
		createdAt: String
	}

	type ImportReport {
		acceptCount: Int!
		errorCount: Int!
		errorSnList: [String]!
	}
`;

export default typeDefs;
