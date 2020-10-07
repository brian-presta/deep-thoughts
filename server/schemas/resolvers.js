const { User, Thought} = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

function checkLoggedIn(user) {
    if (user) {
        return 
    }
    throw new AuthenticationError("You aren't logged in!")
}

const resolvers = {
    Query: {
        me: async (parent, args, { user }) => {
            checkLoggedIn(user)

            const foundUser = await User.findOne({ _id: user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends')
            return foundUser
        },
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
          },
        thought: async (parent, { _id }) => {
        return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            return { token, user}
        },
        login: async (parent, { email, password}) => {
            const user = await User.findOne({email})
            if (!user) {
                throw new AuthenticationError("No user found with that email address")
            }
            const correctPassword = await user.isCorrectPassword(password)
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect password")
            }
            const token = signToken(user)
            return { token, user}
        },
        addThought: async (parent, args, { user }) => {
            checkLoggedIn(user)
            const thought = await Thought.create({...args, username:user.username })
            await User.findByIdAndUpdate(
                {_id: user._id},
                {$push: { thoughts: thought._id}},
                {new:true}
            )
            return thought
        },
        addReaction: async (parent, { thoughtId, reactionBody }, { user }) => {
            checkLoggedIn(user)
            const updatedThought = await Thought.findOneAndUpdate(
                {_id: thoughtId},
                { $push: {reactions: {reactionBody, username: user.username}}}
            )
            return updatedThought
        },
        addFriend: async (parent, { friendId }, { user }) => {
            checkLoggedIn(user)
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$addToSet: {friends: friendId}},
                {new: true}
            ).populate('friends')
            return updatedUser
        }
    },
    
}

module.exports = resolvers

