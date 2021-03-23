const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
    const event = await Event.findById(eventId)
         return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
            throw err
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            }
        })
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // can receive req, it represent req.userId can pass into this block, and if you pass if { }, you will get req.userId
        // then we can replace creator as real userId instead of hardcode id
        if (!req.isAuth) {
            throw new Error('使用者未經過認證')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        })
        let createdEvent    // 提早儲存 _doc 的區域變數
        try {
        const result = await event.save()
        createdEvent = {
            ...result._doc,
            _id: result._doc._id.toString(),
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator)
        }
        const creator = await User.findById(req.userId)

        if (!creator) {
            throw new Error('找不到使用者')
        }
        creator.createdEvents.push(event)
        await creator.save()

        return createdEvent
        } catch (err) {
            throw err
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('使用者已存在')
            }
            // 確認沒有相同的使用者之後，對使用者傳入的密碼進行加密再儲存
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })

            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id }

        } catch (err) {
        throw err
        }
    },
    login: async ({ email, password }) => {
        // validate user input
        const unLoginUser = await User.findOne({ email: email })
        if (!unLoginUser) 
            throw new Error('使用者不存在')
        const isEqual = await bcrypt.compare(password, unLoginUser.password)
        if (!isEqual)
            throw new Error('帳號或密碼錯誤')
        // *** 以 userId, email, jwt_secret, expiresIn 進行jwt編碼，到時候解開可以取得這些屬性 ***
        const token = jwt.sign({ userId: unLoginUser.id, email: unLoginUser.email }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        })
        return { userId: unLoginUser.id, token: token, tokenExpiration: 2 }
    }
}