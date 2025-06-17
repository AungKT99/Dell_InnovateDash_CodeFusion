const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());


const chatbotRoutes = require("./routes/chat"); 


app.use("/", chatbotRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});