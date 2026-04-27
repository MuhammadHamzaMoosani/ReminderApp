const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const financialRoutes = require("./routes/financial.routes");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:4200",   // your Angular app URL
  credentials: true                  // allow cookies / auth headers if needed
}));// Routes
app.use("/users", userRoutes);
app.use("/workspace", taskRoutes);
app.use("/financial", financialRoutes);

module.exports = app;
