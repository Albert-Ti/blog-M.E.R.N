import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
  try {
    // ошибка при валидации даем ответ пользователю где он ошибся
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    // шифрование пароля
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign({ _id: user._id }, 'secret1', { expiresIn: '30d' })

    // удаляем из ответа для пользователя password
    const { passwordHash, ...userData } = user._doc

    res.json({
      message: 'Регистрация прошла успешно',
      user: userData,
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      res.status(400).json({
        message: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    )

    if (!isValidPass) {
      res.status(403).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign({ _id: user._id }, 'secret1', { expiresIn: '30d' })

    // удаляем из ответа для пользователя password
    const { passwordHash, ...userData } = user._doc

    res.status(200).json({
      message: 'Регистрация прошла успешно',
      user: userData,
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const { passwordHash, ...userData } = user._doc
    res.json({
      userData,
    })
  } catch (error) {}
}
