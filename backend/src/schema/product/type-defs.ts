const typeDefs = `#graphql
	extend type Query {
        products(categoryId: Int!, filter: SearchFilter): [ProductBasic]
		productsCount: AggregateResult
		product(id: Int!): Product
		productItem(sn: String!): ProductItem
		productItemsByAuth: [ProductItem]
    }

    extend type Mutation {
        createProduct(input: ProductInput!): ProductBasic
		updateProduct(id: Int!, input: ProductUpdate!): ProductBasic
		deleteProduct(id: Int!): ProductBasic
		createProductItem(productId: Int!, sn: String!): ProductItemBasic
		updateProductItem(sn: String!, newSn: String!): ProductItemBasic
		deleteProductItem(sn: String!): ProductItemBasic
		createProductItemOnClientByAuth(sn: String!): ProductItemOnClient
		deleteProductItemOnClientByAuth(sn: String!): ProductItemOnClient
		createProductReviewByAuth(productId: Int!, input: ProductReviewInput!): ProductReviewBasic
		deleteProductReview(id: Int!): ProductReviewBasic
    }

    type Product {
		id: Int!
		name: String!
		model: String
		image: String
		description: String
		price: Float!
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		category: Category
		reviews: [ProductReviewBasic]
		items: [ProductItemBasic]
	}

	type ProductBasic {
		id: Int!
		name: String!
		model: String
		image: String
		description: String
		price: Float!
		isDisabled: Boolean
	}

	input ProductInput {
		categoryId: Int!
		name: String!
		model: String
		image: String
		description: String
		price: Float!
	}

	input ProductUpdate {
		categoryId: Int
		name: String
		model: String
		image: String
		description: String
		price: Float
		isDisabled: Boolean
	}

	type ProductItemBasic {
		sn: String
		createdAt: String
	}

	type ProductItem {
		sn: String
		createdAt: String
		product: ProductBasic
	}

	type ProductItemOnClient {
		productSn: String
		clientId: Int
		createdAt: String
	}


	type ProductReview {
		id: Int!
		rating: Int!
		comment: String
		createdAt: String
		client: ClientBasic
	}

	type ProductReviewBasic {
		id: Int!
		rating: Int!
		comment: String
		createdAt: String
	}

	input ProductReviewInput {
		rating: Int!
		comment: String
	}
`;

export default typeDefs;