const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
