// Interface SIMPLES para usuário
export interface Usuario {
  id: number;
  email: string;
  senha: string;
}

// Interface SIMPLES para repositório
export interface UsuarioRepository {
  salvar(usuario: Omit<Usuario, "id">): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
}
