import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { router } from "./router/router";

const app = express();
const PORT = 3005;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rotas
app.use("/api", router);

// Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
