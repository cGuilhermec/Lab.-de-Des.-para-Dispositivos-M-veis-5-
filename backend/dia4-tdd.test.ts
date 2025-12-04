// HISTÓRIA: "Como usuário, quero me cadastrar com email e senha"

describe("Cadastro de Usuário - TDD", () => {
  // FASE 1: RED (teste falha)
  test("🚨 RED: Teste falha primeiro (função não existe)", () => {
    const cadastrarUsuario = () => {
      throw new Error("Não implementado ainda!");
    };
    expect(() => cadastrarUsuario()).toThrow();
  });

  // FASE 2: GREEN (implementação mínima)
  test("✅ GREEN: Implementação funciona", () => {
    // Função SIMPLES que cria usuário
    function cadastrarUsuario(email: string, senha: string) {
      return {
        id: 1,
        email: email,
        senha: senha,
      };
    }

    const usuario = cadastrarUsuario("teste@email.com", "123456");
    expect(usuario.email).toBe("teste@email.com");
  });

  // FASE 3: REFACTOR (validação)
  test("🔧 REFACTOR: Adiciona validação de email", () => {
    function cadastrarUsuario(email: string, senha: string) {
      if (!email.includes("@")) {
        throw new Error("Email inválido");
      }
      return { id: 1, email: email, senha: senha };
    }

    expect(() => cadastrarUsuario("email-invalido", "123")).toThrow();
    const usuario = cadastrarUsuario("valido@email.com", "123");
    expect(usuario).toBeDefined();
  });
});
