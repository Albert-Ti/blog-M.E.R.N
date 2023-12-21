import { body } from 'express-validator'

export const loginValidation = [
   body('email', 'Неверный формат почты').isEmail(),
   body('password', 'Пароль должен иметь не меньше пяти символов').isLength({
      min: 5,
   }),
]

export const registerValidation = [
   body('email', 'Неверный формат почты').isEmail(),
   body('password', 'Пароль должен иметь не меньше пяти символов').isLength({
      min: 5,
   }),
   body('fullName', 'Имя должно иметь больше трех символов').isLength({
      min: 3,
   }),
   body('avatarUrl', 'Не корректная ссылка').optional().isURL(),
]

export const postCreateValidation = [
   body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
   body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
   body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
   body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
