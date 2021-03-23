const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/valid-auth')

const app = express()

require('dotenv').config()
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')      // everyone can send request to your server
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)
app.use('/graphql', graphqlHTTP({
    // mongoDB 的 id 為 _id，而 graphQL 的 id type 必須為 ID
    // [Event!]! 代表值可以為空，但是不能為 null，可以為空陣列，但是不能為 null
    // Don't return password in type User
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect('mongodb://localhost:27017/graphql-practice', {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', (req, res, next) => {
  res.send('Hello Wolrd')
})

app.listen(5000, () => {
    console.log('server is running...')
})