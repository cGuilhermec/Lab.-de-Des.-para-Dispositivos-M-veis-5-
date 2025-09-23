import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = "seusegredo";

class loginController {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.prismaClient.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "2h",
    });
    res.json({ token });
  }
}

export const LoginController = new loginController();
