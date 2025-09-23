import express from "express";
import cors from "cors";
import router  from "./router/router";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const Port = 3005;

// 1️⃣ Habilita o CORS
app.use(cors());

// 2️⃣ Habilita o parsing de JSON
app.use(express.json());

// 3️⃣ Suas rotas
app.use(router);

// 4️⃣ Inicia o servidor
app.listen(Port, () => {
  console.log(`The server is running on port: http://localhost:${Port}`);
});
