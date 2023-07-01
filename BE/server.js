require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const port = 3000;
const drinksController = require('./controllers/drinks_controller')
const menuItemController = require('./controllers/menu_item_controller')
const menuItemRouter = require('./routers/menu_item_router')
const userRouter = require('./routers/user_router')

app.set('view engine', 'ejs') // FE + BE -> in a single app
app.use(express.static('public'))

// urlencoded middleware has already been built in to express
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: true})) // same as above
app.use(express.json())

app.use(methodOverride('_method'))

app.use(cors({
  origin: '*'
}))

// handle cors pre-flight requests
app.options('*', cors())

// API endpoint routes

// app.use('/api/menu-items', menuItemRouter)
app.use('/api/users', userRouter)

// LISTENER
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {

    console.log('DB connected')

    // boot up app
    app.listen(port, ()=> {
      console.log('GitPub running on port: ', port);
    })
  
  })  
  .catch(err => {
    console.log('err when connecting: ' + err)
  })


  // // App routes
// // READ routes
// app.get('/drinks', drinksController.index)
// // create drink form
// app.get('/drinks/new', drinksController.newDrinkForm)
// app.get('/drinks/:drinkID', drinksController.show)

// // CREATE route
// app.post('/drinks', drinksController.createDrink)

// // UPDATE routes
// app.get('/drinks/:drinkID/edit', drinksController.editDrinkForm)
// app.patch('/drinks/:drinkID', drinksController.updateDrink)

// // DELETE route
// app.delete('/drinks/:drinkID', drinksController.deleteDrink)