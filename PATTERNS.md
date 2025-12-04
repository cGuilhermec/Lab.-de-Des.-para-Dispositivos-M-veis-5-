# 📘 Design Patterns do Projeto (MySQL + Prisma + Node + TypeScript)

Este documento descreve de forma simples e objetiva os principais **Design Patterns** utilizados no projeto, considerando a estrutura atual:

* `controllers/` com `loginController.ts` e `userController.ts`
* `router/routers.ts`
* `MySQL` utilizando `Prisma ORM`
* `server.ts`
* Arquivos de teste

---

# 🧱 1. Controller Pattern (MVC)

Os **Controllers** recebem as requisições HTTP e repassam o trabalho para os Services.

**No seu projeto:**

* `loginController.ts`
* `userController.ts`

**Responsabilidades:**

* Validar entradas simples
* Chamar os Services
* Retornar respostas ao cliente

**Benefícios:**

* Código limpo
* Reaproveitamento de lógica

---

# ⚙️ 2. Service Pattern (Regra de Negócio)

Os **Services** contêm toda a lógica da aplicação.

**Sugestão de estrutura:**

```
services/
  loginService.ts
  userService.ts
```

**Benefícios:**

* Separação de responsabilidades
* Controllers mais organizados
* Facilita testes unitários

---

# 🗄 3. Repository Pattern (Camada de Acesso ao Banco)

O **Repository Pattern** separa o acesso ao banco da lógica de negócio.

Com Prisma, isso fica ainda mais simples.

**Sugestão:**

```
repositories/
  userRepository.ts
```

**Funções típicas:**

* Criar usuário
* Atualizar usuário
* Buscar por email ou ID

**Benefícios:**

* Facilidade para trocar de banco no futuro
* Regras de negócio ficam mais limpas

---

# 🔌 4. Factory Pattern (Criação de Objetos)

Factories criam e retornam instâncias prontas com suas dependências configuradas.

**Sugestão:**

```
factories/
  loginFactory.ts
  userFactory.ts
```

**Uso:**

* Evita “undefined service”
* Simplifica instâncias de Controller + Service + Repository

---

# 🔒 5. Singleton Pattern (Conexão Prisma)

O Prisma **deve** ser um Singleton para evitar múltiplas conexões simultâneas.

**Estrutura recomendada:**

```
database/
  prisma.ts
```

Essa abordagem garante que apenas **uma instância** do Prisma seja utilizada em todo o projeto.

---

# 🧩 6. Adapter Pattern (Padronização de Dados)

Serve para padronizar dados vindos de requisições ou respostas.

**Possíveis usos:**

* Padronizar payloads de entrada
* Gerar resposta limpa após ações do Prisma
* Converter formatos (ex.: datas)

**Exemplo de estrutura:**

```
adapters/
  userAdapter.ts
  loginAdapter.ts
```

---

# 📦 Estrutura Sugerida do Projeto

```
src/
  controllers/
    loginController.ts
    userController.ts

  services/
    loginService.ts
    userService.ts

  repositories/
    userRepository.ts

  factories/
    loginFactory.ts
    userFactory.ts

  adapters/
    userAdapter.ts

  database/
    prisma.ts

  router/
    routers.ts

  server.ts
```

---

# 🚀 Execução do Projeto

```
npm install
npm run dev
```

---

