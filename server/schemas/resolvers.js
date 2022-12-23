// Todo: resolvers.js: Define the query and mutation functionality to work with the Mongoose models.
const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
      me: async (_parent, _args, context) => {
          if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                  .select('-__v -password');
                  // returns everything BUT password
    
              return userData;
          }
        throw new AuthenticationError("No user found. Please login or register");
      },
    },
    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
         addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("No profile with this email found!");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials!");
            }

            const token = signToken(user);
            return { token, user };
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, args, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                // take the input type to replace "body" as the arguement
                { $addToSet: { savedBooks: args.input } },
                { new: true, runValidators: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError("You need to be logged in!");
          },

          removeBook: async (parent, args, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError("You need to be logged in!");
          },
    },

};

module.exports = resolvers;