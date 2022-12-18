// Todo: resolvers.js: Define the query and mutation functionality to work with the Mongoose models.
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // get single user by either their id or username
    },
    Mutations: {
    },

};

module.exports = resolvers;