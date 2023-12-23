import express from 'express'
import multer from 'multer'
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
app.use('/upload', express.static('uploads'))

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.post('/auth/register', registerValidation, userController.register)
app.post('/auth/login', loginValidation, userController.login)
app.get('/auth/me', checkAuth, userController.getMe)

app.post('/posts', checkAuth, postCreateValidation, postController.create)
app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getById)
app.patch('/posts/:id', checkAuth, postController.update)
app.delete('/posts/:id', checkAuth, postController.remove)

// пишем и запускаем сервер командой "node <file.js>", либо через "nodemon <file.js>"
app.listen(3333, error => {
  if (error) {
    return console.log(error)
  }
  console.log('Server OK')
})
