const typeDefs = `#graphql
	extend type Query {
        advertisements: [Advertisement]
        advertisement(id: Int!): Advertisement
    }

    extend type Mutation {
        createAdvertisement(input: AdvertisementCreate!): Advertisement
        updateAdvertisement(id: Int!, input: AdvertisementUpdate!): Advertisement
        deleteAdvertisement(id: Int!): Advertisement
    }

    type Advertisement {
        id: Int!
        imageUrl: String!
        imageOrder: Int!
        createdAt: String!
    }

    input AdvertisementCreate {
        imageUrl: String!
        imageOrder: Int!
    }

    input AdvertisementUpdate {
        imageUrl: String
        imageOrder: Int
    }
`;

export default typeDefs;
