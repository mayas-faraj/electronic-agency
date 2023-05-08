import resolvers from './client/resolvers.js';

export default {
    Query: {
        ...resolvers.Query
    },
    Mutation: {
        ...resolvers.Mutation
    }
};