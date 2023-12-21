import mongoose from 'mongoose'

const postScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tags: {
      type: Array,
      default: [],
    },

    imageUrl: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Post', postScheme)
