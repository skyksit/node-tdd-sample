const app = require("./app");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => console.log(`this server listening on ${PORT}`));
