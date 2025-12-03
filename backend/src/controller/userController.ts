import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = "seusegredo";

// Definir tipos para os níveis de acesso
type AccessLevel = "visualizacao" | "gerencial" | "administrativo";

class UserController {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  // Verificar permissões com tipos corretos
  private checkPermission(
    userLevel: AccessLevel,
    requiredLevel: AccessLevel
  ): boolean {
    const levels: Record<AccessLevel, number> = {
      visualizacao: 1,
      gerencial: 2,
      administrativo: 3,
    };

    return levels[userLevel] >= levels[requiredLevel];
  }

  // Obter usuário do token
  private async getUserFromToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    try {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, secret);

      const user = await this.prismaClient.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          accessLevel: true,
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  // CREATE
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, accessLevel } = req.body;

      // Verificar permissões
      const currentUser = await this.getUserFromToken(req);
      if (
        !currentUser ||
        !this.checkPermission(
          currentUser.accessLevel as AccessLevel,
          "administrativo"
        )
      ) {
        return res
          .status(403)
          .json({
            error:
              "Permissão negada. Apenas administradores podem criar usuários.",
          });
      }

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
          accessLevel: (accessLevel || "visualizacao") as AccessLevel,
        } as any,
      });

      // Remover password da resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        user: userWithoutPassword,
      });
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
      const currentUser = await this.getUserFromToken(req);
      if (!currentUser) {
        return res.status(401).json({ error: "Token inválido" });
      }

      const users = await this.prismaClient.user.findMany({
        select: {
          id: true,
          email: true,
          accessLevel: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        users,
        currentUser,
      });
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
        select: {
          id: true,
          email: true,
          accessLevel: true,
          createdAt: true,
          updatedAt: true,
        },
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
      const { email, password, accessLevel } = req.body;

      const currentUser = await this.getUserFromToken(req);
      if (!currentUser) {
        return res.status(401).json({ error: "Token inválido" });
      }

      // Verificar se usuário existe
      const userToUpdate = await this.prismaClient.user.findUnique({
        where: { id: Number(id) },
      });
      if (!userToUpdate) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verificar permissões
      if (
        accessLevel === "administrativo" &&
        !this.checkPermission(
          currentUser.accessLevel as AccessLevel,
          "administrativo"
        )
      ) {
        return res
          .status(403)
          .json({
            error: "Apenas administradores podem definir nível administrativo",
          });
      }

      if (
        !this.checkPermission(
          currentUser.accessLevel as AccessLevel,
          "gerencial"
        )
      ) {
        return res
          .status(403)
          .json({ error: "Permissão negada para editar usuários" });
      }

      // Não permitir que usuários editem a si mesmos para evitar lockout
      if (
        currentUser.id === userToUpdate.id &&
        accessLevel &&
        accessLevel !== currentUser.accessLevel
      ) {
        return res
          .status(403)
          .json({ error: "Você não pode alterar seu próprio nível de acesso" });
      }

      // Se atualizar senha, gera hash
      let hash_password: string | undefined = undefined;
      if (password) {
        hash_password = await bcrypt.hash(password, 8);
      }

      const updatedUser = await this.prismaClient.user.update({
        where: { id: Number(id) },
        data: {
          email: email || userToUpdate.email,
          password: hash_password || userToUpdate.password,
          accessLevel: (accessLevel || userToUpdate.accessLevel) as AccessLevel,
        } as any,
      });

      // Remover password da resposta
      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: "Usuário atualizado",
        updatedUser: userWithoutPassword,
      });
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

      const currentUser = await this.getUserFromToken(req);
      if (
        !currentUser ||
        !this.checkPermission(
          currentUser.accessLevel as AccessLevel,
          "administrativo"
        )
      ) {
        return res
          .status(403)
          .json({
            error:
              "Permissão negada. Apenas administradores podem excluir usuários.",
          });
      }

      const user = await this.prismaClient.user.findUnique({
        where: { id: Number(id) },
      });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Não permitir que usuários se deletem
      if (currentUser.id === user.id) {
        return res
          .status(403)
          .json({ error: "Você não pode excluir sua própria conta" });
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
