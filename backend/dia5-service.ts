// Service SIMPLES usando a interface do Dia 3
import { Usuario, UsuarioRepository } from "./dia3-interface";

export class UsuarioService {
  constructor(private repository: UsuarioRepository) {}

  async cadastrar(email: string, senha: string): Promise<Usuario> {
    // 1. Validar
    if (!email.includes("@")) throw new Error("Email inválido");
    if (senha.length < 6) throw new Error("Senha muito curta");

    // 2. Verificar se já existe
    const existe = await this.repository.buscarPorEmail(email);
    if (existe) throw new Error("Email já cadastrado");

    // 3. Salvar
    return await this.repository.salvar({ email, senha });
  }
}
