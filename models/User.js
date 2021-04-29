const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
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
          'https://res.cloudinary.com/doh6rpdke/image/upload/w_200,h_200/v1619712362/iron-cream/avatar-1577909_960_720_r9xjzp.webp',
      },
      cloudinaryId: { type: String },
    },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
  },
  { timestamps: true },
);

const User = model('User', userSchema);

module.exports = User;
