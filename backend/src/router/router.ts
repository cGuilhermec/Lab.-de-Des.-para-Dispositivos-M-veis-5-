import express, { Request, Response } from "express";

export const router = express.Router();

// Simulando um "banco de dados" em memória
let users: { id: number; name: string; email: string }[] = [];

// CREATE - POST /users
router.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Nome e email são obrigatórios" });
  }

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);

  return res.status(201).json(newUser);
});

// READ ALL - GET /users
router.get("/users", (req: Request, res: Response) => {
  return res.json(users);
});

// READ ONE - GET /users/:id
router.get("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  return res.json(user);
});

// UPDATE - PUT /users/:id
router.put("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  users[userIndex] = { ...users[userIndex], name, email };

  return res.json(users[userIndex]);
});

// DELETE - DELETE /users/:id
router.delete("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const deletedUser = users.splice(userIndex, 1);

  return res.json({ message: "Usuário deletado", user: deletedUser[0] });
});
