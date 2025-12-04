import express from "express";

const app = express();
app.use(express.json());

// Health Check (boas práticas)
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Rota de usuários (organização)
app.post("/api/usuarios", (req, res) => {
  // Aqui viria a lógica real
  res.status(201).json({ mensagem: "Usuário criado" });
});

app.get("/api/usuarios", (req, res) => {
  res.json({ usuarios: [] });
});

// Error handler (boas práticas)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno" });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
