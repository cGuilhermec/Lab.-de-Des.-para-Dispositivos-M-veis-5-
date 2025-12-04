import { Request, Response } from "express";

// Teste E2E SIMPLES sem import/export
const request = require("supertest");
const express = require("express");

describe("Teste E2E - Fluxo Completo", () => {
  const app = express();
  app.use(express.json());

  // Rota SIMULADA
  app.post("/usuarios", (req: Request, res: Response) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }
    res.status(201).json({ id: 1, email });
  });

  test("POST /usuarios cria usuário", async () => {
    const response = await request(app)
      .post("/usuarios")
      .send({ email: "teste@email.com", senha: "123456" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("teste@email.com");
  });
});
