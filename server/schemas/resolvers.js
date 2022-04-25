const { throwHttpGraphQLError } = require('apollo-server-core/dist/runHttpQuery');
const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        // get a user by username
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select(
                    "-__v -password"
                );
                return userData;
            }
            throw new AuthenticationError('Not logged in!');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            // look up the user by the provided email addy. since the email field is unique, we know that only one person will exist with that email
            const user = await User.findOne({ email });

            // if there is no user with that email addy, return an auth error
            if (!user) {
                throw new AuthenticationError('no user found with that email address');
            }

            // if there is a user found, execute the isCorrectPassword  instance method and check i the correct pass word was provided. 
            const correctPw = await user.isCorrectPassword(password);

            // if the passwrod is wrong
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // if email n password are right , sign user into the app with JWT
            const token = signToken(user);

            // return an 'auth' object that consist of the signed token and user info
            return { token, user };

        },
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);

            return { token, user };     
        }
    },

    saveBook: async (parent, args, context) => {
        if (context.user) {
            const newUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.input  }},
                { new: true }
            );

            return newUser;
        }
        throw new AuthenticationError('you need to be logged in!')
    }
}

module.exports = resolvers;