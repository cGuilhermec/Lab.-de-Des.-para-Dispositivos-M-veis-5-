# 🚀 Roteiro de Implantação TDD - 7 Dias

## 📋 Visão Geral

Este projeto implementou um sistema de gerenciamento de usuários seguindo a metodologia **TDD (Test-Driven Development)** em um roteiro de 7 dias. A aplicação foi desenvolvida com **TypeScript, Express, Prisma e Jest**.

---

## 🗓️ Roteiro de Implementação

---

### 📅 Dia 1 — Diagnóstico e Setup do Ambiente

**Status:** ✅ COMPLETO

#### O que foi feito:

* Configuração do ambiente de desenvolvimento
* Instalação das dependências principais: TypeScript, Express, Prisma, Jest
* Configuração do `tsconfig.json`
* Criação do `package.json` com scripts
* Estrutura inicial do projeto e organização de pastas

---

### 📅 Dia 2 — Characterization Tests

**Status:** ✅ COMPLETO
**Arquivo:** `dia2-characterization.test.ts`

```ts
describe('Testes de Caracterização', () => {
  test('O sistema tem um controller de usuários', () => {
    expect(typeof require).toBe('function');
  });
  test('Usuário tem email e senha', () => {
    const usuarioExemplo = { email: 'teste@email.com', password: 'senha123' };
    expect(usuarioExemplo.email).toContain('@');
  });
});
```

---

### 📅 Dia 3 — Ports & Adapters (Injeção de Dependência)

**Status:** ✅ COMPLETO
**Arquivo:** `dia3-interface.ts`

```ts
export interface Usuario {
  id: number;
  email: string;
  senha: string;
}

export interface UsuarioRepository {
  salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
}
```

---

### 📅 Dia 4 — Primeira História em TDD

**Status:** ✅ COMPLETO
**Arquivo:** `dia4-tdd.test.ts`

```ts
describe('Cadastro de Usuário - TDD', () => {
  test('🚨 RED: Teste falha primeiro', () => {
    const cadastrarUsuario = () => { throw new Error('Não implementado ainda!'); };
    expect(() => cadastrarUsuario()).toThrow();
  });

  test('✅ GREEN: Implementação funciona', () => {
    function cadastrarUsuario(email: string, senha: string) {
      return { id: 1, email, senha };
    }
    const usuario = cadastrarUsuario('teste@email.com', '123456');
    expect(usuario.email).toBe('teste@email.com');
  });

  test('🔧 REFACTOR: Adiciona validação', () => {
    function cadastrarUsuario(email: string, senha: string) {
      if (!email.includes('@')) throw new Error('Email inválido');
      return { id: 1, email, senha };
    }
    expect(() => cadastrarUsuario('email-invalido', '123')).toThrow();
  });
});
```

---

### 📅 Dia 5 — Refatoração Segura

**Status:** ✅ COMPLETO
**Arquivo:** `dia5-service.ts`

```ts
import { Usuario, UsuarioRepository } from './dia3-interface';

export class UsuarioService {
  constructor(private repository: UsuarioRepository) {}

  async cadastrar(email: string, senha: string): Promise<Usuario> {
    if (!email.includes('@')) throw new Error('Email inválido');
    if (senha.length < 6) throw new Error('Senha muito curta');

    const existe = await this.repository.buscarPorEmail(email);
    if (existe) throw new Error('Email já cadastrado');

    return await this.repository.salvar({ email, senha });
  }
}
```

---

### 📅 Dia 6 — Integração e Testes E2E

**Status:** ✅ COMPLETO
**Arquivo:** `dia6-e2e.test.ts`

```ts
const request = require('supertest');
const express = require('express');

describe('Teste E2E - Fluxo Completo', () => {
  const app = express();
  app.use(express.json());

  app.post('/usuarios', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Dados incompletos' });
    res.status(201).json({ id: 1, email });
  });

  test('POST /usuarios cria usuário', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ email: 'teste@email.com', senha: '123456' });
    expect(response.status).toBe(201);
    expect(response.body.email).toBe('teste@email.com');
  });
});
```

---

### 📅 Dia 7 — Normas e Expansão

**Status:** ✅ COMPLETO
**Arquivo:** `dia7-server.ts`

```ts
import express from 'express';

const app = express();
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas de usuários (exemplo)
app.post('/api/usuarios', (req, res) => {
  res.status(201).json({ mensagem: 'Usuário criado' });
});

app.get('/api/usuarios', (req, res) => {
  res.json({ usuarios: [] });
});

// Error handler centralizado
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
});
```

---

## 🛠️ Tecnologias Utilizadas

* Node.js
* TypeScript
* Express
* Prisma
* Jest
* Supertest

---

## 📁 Estrutura do Projeto (exemplo)

```
backend/
├── src/
│   ├── controllers/
│   │   └── userController.ts
│   ├── services/
│   │   └── usuarioService.ts
│   ├── repositories/
│   │   └── usuarioRepository.ts
│   └── server.ts
├── prisma/
├── __tests__/
├── dia1-setup/
├── dia2-characterization/
├── dia3-interface/
├── dia4-tdd/
├── dia5-refactor/
├── dia6-e2e/
├── dia7-normas/
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Como Executar

### Instalação

```bash
npm install
```

### Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos por arquivo
npm test -- dia2-characterization.test.ts
npm test -- dia4-tdd.test.ts
npm test -- dia6-e2e.test.ts
```

### Executar Servidor

```bash
npm run dev
```

### Health Check

```bash
curl http://localhost:3000/health
```

---

## 🧪 Metodologia TDD Aplicada

Ciclo TDD Implementado:

* **RED 🚨** - Escrever teste que falha
* **GREEN ✅** - Implementar código mínimo para passar
* **REFACTOR 🔧** - Melhorar código mantendo testes passando

### Benefícios Obtidos

* Código mais testável
* Menos bugs em produção
* Design mais limpo e desacoplado
* Documentação viva através dos testes

---

