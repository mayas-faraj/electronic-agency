const typeDefs = `#graphql
	extend type Query {
        maintenances(filter: StatusFilter): [Maintenance]
		maintenancesByAuth(isDraft: Boolean): [Maintenance]
    }

    extend type Mutation {
        createMaintenanceByAuth(input: MaintenanceInput!): MaintenanceBasic
		deleteMaintenanceByAuth(id: Int!): MaintenanceBasic
		createRepair(input: RepairInput!): RepairBasic
		updateRepair(id: Int!, input: RepairInput!): RepairBasic
		deleteRepair(id: Int!): RepairBasic
    }

    type Maintenance {
		id: Int!
		description: String!
		propertyType: String!
		address: String
		longitude: Float
		latitude: Float
		createdAt: String
		bookedAt: String
		status: String
		repair: RepairBasic
		productItem: ProductItem
	}

	type MaintenanceBasic {
		id: Int!
		description: String!
		propertyType: String!
		address: String
		longitude: Float
		latitude: Float
		createdAt: String
		bookedAt: String
		status: String
	}

	input MaintenanceInput {
		productSn: String!
		description: String!
		propertyType: String!
		address: String
		longitude: Float
		latitude: Float
		createdAt: String
		bookedAt: String
		status: String
		isDraft: Boolean
	}

	type Repair {
		id: Int!
		price: Int!
		description: String
		createdAt: String
		admin: AdminBasic
		maintenance: MaintenanceBasic
	}

	type RepairBasic {
		id: Int!
		price: Int!
		description: String
		createdAt: String
	}

	input RepairInput {
		adminId: Int!
		maintenanceId: Int!
		price: Int!
		description: String
	}
`;

export default typeDefs;