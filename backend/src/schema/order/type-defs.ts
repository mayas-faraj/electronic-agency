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
		createOrder(user: String!, input: OrderCreate!): OrderBasic
				updateOrderStatus(id: Int!, status: String!): OrderBasic
				deleteOrder(id: Int!): OrderBasic
				createOfferByAuth(input: OfferInput!): OfferBasic
				updateOfferByAuth(id: Int!, input: OfferUpdate!): OfferBasic
				deleteOffer(id: Int!): OfferBasic
    }

    type Order {
		id: Int!
		projectNumber: Int!
		subject: String
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
		products: [OrderProduct]
		client: ClientBasic
		offer: OfferBasic
	}

	type OrderBasic {
		id: Int!
		projectNumber: Int!
		status: String
		isRead: Boolean
		isOfferRequest: Boolean
		createdAt: String
		products: [OrderProduct]
	}

	type OrderProduct {
		id: Int!
		product: ProductBasic!
		count: Int!
		price: Float
	}

	input OrderInput {
		productId: Int!
		count: Int!
		totalPrice: Float
		projectNumber: Int!
		subject: String
		address: String!
		note: String
		company: String
		delivery: String
		warranty: String
		terms: String
		isDraft: Boolean
		isOfferRequest: Boolean
	}

	input OrderCreate {
		projectNumber: Int!
		subject: String
		address: String!
		note: String
		company: String
		delivery: String
		warranty: String
		terms: String
		products: [OrderProductCreate]
	}

	input OrderProductCreate {
		productId: Int!
		count: Int!
		price: Float
	}

	type Offer {
		id: Int!
		discount: Float!
		isDiscountPercent: Boolean!
		validationDays: Int
		createdAt: String
		user: UserBasic
		order: OrderBasic
	}

	type OfferBasic {
		id: Int!
		discount: Float!
		isDiscountPercent: Boolean!
		validationDays: Int
		createdAt: String
	}

	input OfferInput {
		orderId: Int!
		discount: Float!
		isDiscountPercent: Boolean!
		validationDays: Int
	}

	input OfferUpdate {
		discount: Float!
		isDiscountPercent: Boolean!
		validationDays: Int
	}
`;

export default typeDefs;
