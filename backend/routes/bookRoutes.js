import express from "express";
import expressAsyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";
import { isAdmin, isAuth } from "../utils.js";

const bookRouter = express.Router();
bookRouter.get("/", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

bookRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newBook = new Book({
      title: "sample book title " + Date.now(),
      author: "sample author",
      slugs: "sample-name-" + Date.now(),
      category: "sample category",
      image: "/images/b5.jpg",
      price: 0,
      stock: 0,
      rating: 0,
      numberOfReviews: 0,
      description: "sample description",
    });
    const book = await newBook.save();
    res.send({ message: "Book Added", book });
  })
);

bookRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (book) {
      book.title = req.body.name;
      book.author = req.body.author;
      book.slugs = req.body.slugs;
      book.category = req.body.category;
      book.image = req.body.image;
      book.price = req.body.price;
      book.stock = req.body.stock;
      book.description = req.body.description;
      await book.save();
      res.send({ message: "Book Updated" });
    } else {
      res.status(404).send({ message: "Book Not Found" });
    }
  })
);

bookRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.remove();
      res.send({ message: "Book Deleted" });
    } else {
      res.status(404).send({ message: "Book Not Found" });
    }
  })
);

bookRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (book) {
      if (book.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      book.reviews.push(review);
      book.numberOfReviews = book.reviews.length;
      book.rating =
        book.reviews.reduce((a, c) => c.rating + a, 0) / book.reviews.length;
      const updatedBook = await book.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedBook.reviews[updatedBook.reviews.length - 1],
        numReviews: book.numberOfReviews,
        rating: book.rating,
      });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

const PAGE_SIZE = 3;

bookRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const books = await Book.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countBooks = await Book.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      books,
      countBooks,
      page,
      pages: Math.ceil(countBooks / pageSize),
    });
  })
);

bookRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const books = await Book.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countBooks = await Book.countDocuments();
    res.send({
      books,
      countBooks,
      page,
      pages: Math.ceil(countBooks / pageSize),
    });
  })
);

bookRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Book.find().distinct("category");
    res.send(categories);
  })
);

bookRouter.get("/slugs/:slugs", async (req, res) => {
  const book = await Book.findOne({ slugs: req.params.slugs });
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: "Book Not Found" });
  }
});

bookRouter.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: "Book Not Found" });
  }
});

export default bookRouter;
