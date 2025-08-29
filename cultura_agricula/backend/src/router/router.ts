import express from "express";
import { Culture, CultureInput, cultures } from "../models/models";


export const router = express.Router();

// Endpoint 1: Listar todas as culturas
router.get("/cultures", (req, res) => {
  res.json(cultures);
});

// Endpoint 2: Buscar cultura por ID
router.get("/cultures/:id", (req, res) => {
  const id = Number(req.params.id);
  const culture = cultures.find((c) => c.id === id);
  if (culture) res.json(culture);
  else res.status(404).json({ message: "Cultura não encontrada" });
});

// Endpoint 3: Criar nova cultura (opcional)
router.post("/cultures", (req, res) => {
  const { name, soil, minTemp, maxTemp, minHumidity, maxHumidity } = req.body;
  const newCulture: Culture = {
    id: cultures.length + 1,
    name,
    soil,
    minTemp,
    maxTemp,
    minHumidity,
    maxHumidity,
  };
  cultures.push(newCulture);
  res.status(201).json(newCulture);
});

// Endpoint 4: Recomendação de cultura
router.post("/recommend", (req, res) => {
  const { temperature, humidity, soil } = req.body as CultureInput;

  const recommended = cultures.find(
    (c) =>
      c.soil === soil &&
      temperature >= c.minTemp &&
      temperature <= c.maxTemp &&
      humidity >= c.minHumidity &&
      humidity <= c.maxHumidity
  );

  if (recommended) res.json({ culture: recommended.name });
  else
    res
      .status(404)
      .json({
        message: "Nenhuma cultura recomendada para os parâmetros fornecidos",
      });
});

// Endpoint 5: Deletar cultura por ID
router.delete("/cultures/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cultures.findIndex((c) => c.id === id);
  if (index >= 0) {
    const deleted = cultures.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Cultura não encontrada" });
  }
});
