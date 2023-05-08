const typeDefs = `#graphql
	extend type Query {
        products(categoryId: Int!, filter: SearchFilter): [ProductBasic]
		product(id: Int!): Product
		productBySn(sn: String!): Product
    }

    extend type Mutation {
        createProduct(input: ProductInput!): ProductBasic
		updateProduct(id: Int!, input: ProductInput!): ProductBasic
		deleteProduct(id: Int!): ProductBasic
		createProductItem(productId: Int!, sn: String!): ProductItemBasic
		updateProductItem(sn: String!, newSn: String!): ProductItemBasic
		deleteProductItem(sn: String!): ProductItemBasic
		createProductItemClientByAuth(sn: String!): ProductItemBasic
		deleteProductItemClientByAuth(sn: String!): ProductItemBasic
		createProductReviewByAuth(input: ProductReviewInput!): ProductReviewBasic
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
		items: [ProductItem]
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

	type ProductItem {
		sn: String
		createdAt: String
		product: [ProductBasic]
	}

	type ProductItemBasic {
		sn: String
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