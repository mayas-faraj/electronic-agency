const typeDefs = `#graphql
	extend type Query {
        orders(filter: StatusFilter): [Order]
		ordersByAuth(isDraft: Boolean): [Order]
    }

    extend type Mutation {
        createOrderByAuth(input: OrderInput!): OrderBasic
		deleteOrderByAuth(id: Int!): OrderBasic
		createOffer(input: OfferInput!): OfferBasic
		updateOffer(id: Int!, input: OfferInput!): OfferBasic
		deleteOffer(id: Int!): OfferBasic
    }

    type Order {
		id: Int!
		count: Int!
		totalPrice: Float!
		address: String!
		note: String
		status: String
		createdAt: String
		product: ProductBasic
		client: ClientBasic
		offer: OfferBasic
	}

	type OrderBasic {
		id: Int!
		count: Int!
		totalPrice: Float!
		status: String
		createdAt: String
	}

	input OrderInput {
		clientId: Int!
		productId: Int!
		count: Int!
		totalPrice: Float!
		address: String!
		note: String
		isDraft: Boolean
	}

	type Offer {
		id: Int!
		price: Int!
		validationDays: Int
		createdAt: String
		admin: AdminBasic
		order: OrderBasic
	}

	type OfferBasic {
		id: Int!
		price: Int!
		validationDays: Int
		createdAt: String
	}

	input OfferInput {
		adminId: Int!
		orderId: Int!
		price: Int!
		validationDays: Int
	}
`;

export default typeDefs;