const typeDefs = `#graphql
	extend type Query {
        orders(filter: StatusFilter): [OrderBasic]
		order(id: Int!): Order
		ordersByAuth(isDraft: Boolean): [OrderBasic]
    }

    extend type Mutation {
        createOrderByAuth(input: OrderInput!): OrderBasic
		deleteOrderByAuth(id: Int!): BatchResult
		createOfferByAuth(input: OfferInput!): OfferBasic
		updateOfferByAuth(id: Int!, input: OfferUpdate!): OfferBasic
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
		product: ProductBasic
	}

	input OrderInput {
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
		orderId: Int!
		price: Int!
		validationDays: Int
	}

	input OfferUpdate {
		price: Int!
		validationDays: Int
	}
`;

export default typeDefs;