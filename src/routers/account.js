const express = require("express");
const Task = require("../models/account");
const auth = require("../middleware/auth");
const router = new express.Router();

//Add new Account
router.post("/accounts", auth, async (req, res) => {
  console.log("In add account");
  const task = new Task({
    ...req.body,
    createdBy: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// fetch Accounts
router.get("/accounts", auth, async (req, res) => {
  try {
    await req.user.populate("accounts").execPopulate();
    res.send(req.user.accounts);
  } catch (e) {
    res.status(500).send();
  }
});

// Fetch account Id
router.get("/accounts/:id", auth, async (req, res) => {
  console.log("In fetch with id");
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, createdBy: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Update account
router.patch("/accounts/:id", auth, async (req, res) => {
  console.log("in Patch");
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "address",
    "accountHolderName",
    "dateOfBirth",
    "age",
    "sex",
    "accountNo",
    "contactNo",
    "contactEmail",
    "accountType",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Account
router.delete("/accounts/:id", auth, async (req, res) => {
  console.log("in delete");
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
