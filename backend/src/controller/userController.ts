import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

class UserController {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  // CREATE
  async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      // Verifica se o usuário já existe
      const existingUser = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(409).json({ error: "Usuário já cadastrado" });
      }

      const hash_password = await bcrypt.hash(password, 8);

      const user = await this.prismaClient.user.create({
        data: {
          email,
          password: hash_password,
        },
      });

      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso", user });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao criar usuário", details: error.message });
    }
  }

  // READ (listar todos)
  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.prismaClient.user.findMany();
      return res.status(200).json(users);
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar usuários", details: error.message });
    }
  }

  // READ (listar por ID)
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.prismaClient.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar usuário", details: error.message });
    }
  }

  // UPDATE
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, password } = req.body;

      const user = await this.prismaClient.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Se atualizar senha, gera hash
      let hash_password: string | undefined = undefined;
      if (password) {
        hash_password = await bcrypt.hash(password, 8);
      }

      const updatedUser = await this.prismaClient.user.update({
        where: { id: Number(id) },
        data: {
          email: email || user.email,
          password: hash_password || user.password,
        },
      });

      return res
        .status(200)
        .json({ message: "Usuário atualizado", updatedUser });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar usuário", details: error.message });
    }
  }

  // DELETE
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.prismaClient.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await this.prismaClient.user.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao deletar usuário", details: error.message });
    }
  }
}

export const userController = new UserController();
