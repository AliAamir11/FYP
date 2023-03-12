import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { generateToken, isAdmin, isAuth } from '../utils.js';
import User from '../models/userModel.js';
import Book from '../models/bookModel.js';
import axios from 'axios';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);



userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

/*
userRouter.get(
  '/favorites',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params._id);
      const books = await Book.find({ _id: { $in: user.favoriteBooks.book } });
      res.send(books)
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })
);
*/

//api/books/:id

userRouter.get(
  '/:id/favorites',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const books = await Book.find({ _id: { $in: user.favoriteBooks } });
      //const books = await Book.find({ _id: { $in: user.favoriteBooks.book } });
      res.send(books)
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })
);

userRouter.post(
  '/:id/favorites',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const book = req.body.item;
      // console.log(user.favoriteBooks)
      if (user?.favoriteBooks?.length > 0) {
        const existingBook = user.favoriteBooks.find((x) => x == book._id);
        if (existingBook) {
          return res.status(400).send('Event already exists in favorite books');
        }
      }
        user?.favoriteBooks?.push(book._id);
        await user?.save();
        res.send('Event added to favorite books successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })
);

userRouter.put(
  '/:id/favorites',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const book = req.body.item;
      console.log("Testing",req)
      if (user?.favoriteBooks?.length > 0) {
        const existingBook = user.favoriteBooks.find((x) => x == book._id);
        if (existingBook) {
          user.favoriteBooks = user.favoriteBooks.filter((x) => x !== book._id);
          await user.save();
          console.log('Event removed from favorite books successfully');
          res.send('Event removed from favorite books successfully');
        } else {
          return res.status(400).send('Event not found in favorite books');
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;
