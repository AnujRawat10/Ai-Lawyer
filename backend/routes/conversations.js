const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Conversation = require("../models/Conversation");

// Get all conversations for a user
router.get("/", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort(
      { updatedAt: -1 }
    );
    res.json(conversations);
  } catch (err) {
    console.error("Error in get conversations:", err);
    res.status(500).send("Server error");
  }
});

// Get a specific conversation
router.get("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    res.json(conversation);
  } catch (err) {
    console.error("Error in get conversation:", err);
    res.status(500).send("Server error");
  }
});

// Create a new conversation
router.post("/", auth, async (req, res) => {
  try {
    const newConversation = new Conversation({
      userId: req.user.id,
      title: req.body.title || "New Conversation",
      messages: [],
    });
    const conversation = await newConversation.save();
    res.json(conversation);
  } catch (err) {
    console.error("Error in create conversation:", err);
    res.status(500).send("Server error");
  }
});

// Add a message to conversation
router.post("/:id/messages", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    conversation.messages.push(req.body);
    await conversation.save();

    res.json(conversation);
  } catch (err) {
    console.error("Error in add message:", err);
    res.status(500).send("Server error");
  }
});

// Update conversation title
router.put("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { title: req.body.title } },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Error in update conversation:", err);
    res.status(500).send("Server error");
  }
});

// Delete a conversation
router.delete("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    res.json({ msg: "Conversation deleted" });
  } catch (err) {
    console.error("Error in delete conversation:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
