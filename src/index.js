const express = require("express");
const cors = require("cors");

require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/account");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const Task = require("./models/account");
const User = require("./models/user");
