const typeDefs = `#graphql
	extend type Query {
        orders(filter: StatusFilter): [OrderBasic]
				order(id: Int!): Order
				ordersByAuth(isDraft: Boolean): [OrderBasic]
				ordersCount: AggregateResult
				ordersUnreadCount: AggregateResult
    }

    extend type Mutation {
        createOrderByAuth(input: OrderInput!): OrderBasic
		createOrder(clientId: Int!, input: OrderInput!): OrderBasic
				updateOrderStatus(id: Int!, status: String!): OrderBasic
				deleteOrder(id: Int!): OrderBasic
				createOfferByAuth(input: OfferInput!): OfferBasic
				updateOfferByAuth(id: Int!, input: OfferUpdate!): OfferBasic
				deleteOffer(id: Int!): OfferBasic
    }

    type Order {
		id: Int!
		count: Int!
		totalPrice: Float
		address: String!
		note: String
		company: String
		delivery: String
		warranty: String
		terms: String
		status: String
		isRead: Boolean
		isOfferRequest: Boolean
		createdAt: String
		product: ProductBasic
		client: ClientBasic
		offer: OfferBasic
	}

	type OrderBasic {
		id: Int!
		count: Int!
		totalPrice: Float
		status: String
		isRead: Boolean
		isOfferRequest: Boolean
		createdAt: String
		product: ProductBasic
	}

	input OrderInput {
		productId: Int!
		count: Int!
		totalPrice: Float
		address: String!
		note: String
		company: String
		delivery: String
		warranty: String
		terms: String
		isDraft: Boolean
		isOfferRequest: Boolean
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
