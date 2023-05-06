const typeDefs = `#graphql
	type Query {
		clients(filter: SearchFilter): [ClientBasic]
		client(id: Int!): Client
		admins(filter: SearchFilter): [Admin]
		admin(id: Int!): Admin
		categories: [Category]
		products(categoryId: Int!, filter: SearchFilter): [ProductBasic]
		product(id: Int!): Product
		product(sn: String!): Product
	}

	input SearchFilter {
		onlyEnabled: Boolean
		keyword: String
	}

	type Client {
		id: Int!
		user: String!
		phone: String
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		orders: [Order]
		maintenance: [Maintenance]
		products: [ProductBasic]
		reviews: [ProductReview]
	}

	type ClientBasic {
		id: Int!
		user: String!
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		isMale: Boolean
		isDisabled: Boolean
	}

	type Admin {
		id: Int!
		user: String!
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		role: String
		offers: [Offer]
		repairs: [Repair]
	}

	type AdminBasic {
		id: Int!
		user: String!
		isDisabled: Boolean
		role: String
	}

	type Category {
		id: Int!
		name: String!
		image: String
		createdAt: String
		updatedAt: String
	}

	type Product {
		id: Int!
		sn: String!
		name: String!
		model: String
		image: String
		description: String
		price: Float!
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		reviews: [ProductReview]
	}

	type ProductBasic {
		id: Int!
		sn: String!
		name: String!
		model: String
		image: String
		description: String
		price: Float!
		isDisabled: Boolean
	}

	type ProductReview {
		rading: Int!
		comment: String
		createdAt: String
		client: ClientBasic
	}


`;

export default typeDefs;
