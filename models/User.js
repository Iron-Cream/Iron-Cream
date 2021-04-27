const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      originalname: { type: String },
      path: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      },
      cloudinaryId: { type: String },
    },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
  },
  { timestamps: true },
);

const User = model('User', userSchema);

module.exports = User;
