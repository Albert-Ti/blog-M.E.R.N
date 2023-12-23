import { validationResult } from 'express-validator'
import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getById = async (req, res) => {
  try {
    const postId = await PostModel.findOneAndUpdate(
      {
        _id: req.params.id, // элемент
      },
      {
        $inc: { viewCount: 1 }, // обновить
      },
      {
        returnDocument: 'after', // обновить и вернуть обновленный результат после обнов...
      },
    )

    if (!postId) {
      return res.status(404).json({
        message: 'Статья не найдена',
      })
    }

    res.json(postId)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const create = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json({ post })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete({
      _id: req.params.id,
    })

    if (!deletedPost) {
      return res.status(404).json({
        message: 'Статья не найдена',
      })
    }
    res.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось удалить статью',
    })
  }
}

export const update = async (req, res) => {
  try {
    await PostModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    )

    res.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}
