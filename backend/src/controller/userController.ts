import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

class userController {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async createProdutor(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const hash_password = await bcrypt.hash(password, 8);

      const user = await this.prismaClient.user.create({
        data: {
          email,
          password: hash_password,
        },
      });

      return res.status(201).json(user);
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao criar usuário", details: error.message });
    }
  }
}


export const UserController = new userController();