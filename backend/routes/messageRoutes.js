import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";
import Message from "../models/messageModel.js";
const messageRouter = express.Router();

messageRouter.get("/", async (req, res) => {
  const msg = await Message.find();
  res.send(msg);
});

messageRouter.post(
  "/send",

  expressAsyncHandler(async (req, res) => {
    console.log("this is working", req.body);
    const allMsg = await Message.find();
    const newMsg = new Message({
      message: req.body.message,
      sender: req.body.sender,
      receiver: req.body.reciever,
      time: allMsg.length + 1,
    });

    const msg = await newMsg.save();
    res.send({ message: "Message Sent", msg });
  })
);

messageRouter.get(
  "/:id1/:id2",
  expressAsyncHandler(async (req, res) => {
    const msg = await Message.find({
      $or: [
        { sender: req.params.id1, receiver: req.params.id2 },
        { sender: req.params.id2, receiver: req.params.id1 },
      ],
    });
    msg.sort((a, b) => a.time - b.time);
    res.send(msg);
  })
);
export default messageRouter;
