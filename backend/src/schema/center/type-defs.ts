const typeDefs = `#graphql
  type Query {
    "read Centers"
    centers(parentId: Int): [Center]
    "read center"
    center(id: Int!): Center
  }

  type Mutation {
    "create center by Admin, content manager"
    createCenter(input: CenterCreate!): Center
    "update center by Admin, content manager"
    updateCenter(id: Int!, input: CenterUpdate!): Center
    "delete center by Admin, content manager"
    deleteCenter(id: Int!): Center
  }

  type Center {
    id: Int!
    name: String!
    parentId: Int
    createdAt: String!
  }

  input CenterCreate {
    name: String!
    parentId: Int
  }

  input CenterUpdate {
    name: String
    parentId: Int
  }
`;
export default typeDefs;