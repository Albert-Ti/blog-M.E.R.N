import express from 'express'
import mongoose from 'mongoose'
import checkAuth from './utils/checkAuth.js'
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validation/auth.js'
import * as userController from './controllers/UserController.js'
import * as postController from './controllers/PostController.js'

mongoose
  .connect(
    'mongodb+srv://Admin:OCU01VLoAMhxbp7S@cluster0.lefofxs.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK'))
  .catch(error => console.warn(`DB Error: ${error}}`))

const app = express()
app.use(express.json())

app.post('/auth/register', registerValidation, userController.register)
app.post('/auth/login', loginValidation, userController.login)
app.get('/auth/me', checkAuth, userController.getMe)

app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getById)
app.post('/posts', checkAuth, postCreateValidation, postController.create)
// app.patch('/posts', postController.update)
// app.delete('/posts', postController.remove)

// пишем и запускаем сервер командой "node <file.js>", либо через nodemon
app.listen(3333, error => {
  if (error) {
    return console.log(error)
  }
  console.log('Server OK')
})
