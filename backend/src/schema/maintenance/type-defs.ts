const typeDefs = `#graphql
	extend type Query {
        maintenances(filter: StatusFilter): [MaintenanceBasic]
		maintenance(id: Int!): Maintenance
		maintenancesByAuth(isDraft: Boolean): [MaintenanceBasic]
		maintenancesUnreadCount: BatchResult
    }

    extend type Mutation {
        createMaintenance(input: MaintenanceInput!): MaintenanceBasic
		deleteMaintenanceByAuth(id: Int!): BatchResult
		createRepairByAuth(input: RepairInput!): RepairBasic
		updateRepairByAuth(id: Int!, input: RepairUpdate!): RepairBasic
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
		isRead: Boolean
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
		isRead: Boolean
		productItem: ProductItem
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
		maintenanceId: Int!
		price: Int!
		description: String
	}

	input RepairUpdate {
		price: Int!
		description: String
	}
`;

export default typeDefs;