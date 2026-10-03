# 🛒 PDV — Frente de Caixa

Sistema completo de Ponto de Venda (PDV) desenvolvido para o teste prático da **Kasterweb**.

**Backend:** Laravel 11 + Sanctum + MySQL
**Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Utilizada](#-stack-utilizada)
- [Arquitetura](#-arquitetura)
- [Decisões Técnicas](#-decisões-técnicas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Executar](#-como-executar)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Endpoints da API](#-endpoints-da-api)
- [Collection do Postman](#-collection-do-postman)
- [Regras de Negócio](#-regras-de-negócio)
- [Estratégia de Versionamento](#-estratégia-de-versionamento)
- [O que ficou de fora](#-o-que-ficou-de-fora)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

O sistema é uma **frente de caixa (PDV)** onde um operador autenticado pode:

- 🔍 Buscar produtos por **nome** ou **código**
- 🛒 Adicionar produtos ao carrinho, ajustar quantidade e remover itens
- 💰 Ver o **total da venda calculado em tempo real**
- 💳 Finalizar a venda escolhendo a **forma de pagamento**
- 💵 No pagamento em dinheiro, informar o valor recebido e ver o **troco**
- 📄 Consultar uma venda finalizada (**comprovante/resumo**)
- 📊 Acompanhar o **histórico de vendas do dia**

**Toda regra de negócio crítica é validada no backend.** O frontend nunca é fonte de verdade para valores monetários.

---

## ✨ Funcionalidades

### Backend

| Área | Implementado |
|---|---|
| Autenticação | Login via API token (Sanctum), logout, `/me` |
| Usuários | CRUD completo (extra — documentado abaixo) |
| Produtos | CRUD completo + busca por nome/código + filtro de disponíveis |
| Vendas | Criação com regras de negócio, consulta de comprovante, histórico por data |
| Seeders | Usuário de teste + 10 produtos + 1 indisponível |

### Frontend

| Tela | Implementado |
|---|---|
| Login | Formulário com integração real à API |
| Dashboard | Cards de métricas + gráfico semanal + top produtos |
| PDV | Busca (debounce), carrinho, modal de pagamento com troco em tempo real, modal de sucesso |
| Produtos | CRUD completo com modal de criação/edição |
| Histórico | Filtro por data, resumo do dia, modal de comprovante |
| Tema | Claro/escuro persistente com `ThemeProvider` |
| Navegação | Sidebar ativa conforme rota, layout responsivo |

---

## 🧰 Stack Utilizada

### Backend

| Tecnologia | Motivo |
|---|---|
| **PHP 8.2+** | Requisito do Laravel 11 |
| **Laravel 11** | Framework exigido pelo teste |
| **Laravel Sanctum** | Autenticação stateless via API token |
| **MySQL 8.0+** | Banco relacional, ambiente padrão do desenvolvimento |

### Frontend

| Tecnologia | Motivo |
|---|---|
| **React 19** | Biblioteca exigida pelo teste |
| **TypeScript** | Tipagem estática (bem-vinda no enunciado) |
| **Vite** | Build tool moderna, padrão da comunidade |
| **Tailwind CSS 4** | Utilitários de estilo e tema consistente |
| **shadcn/ui** | Componentes acessíveis baseados em Radix UI (copiados para o projeto, não é dependência fechada) |
| **React Router 7** | Navegação client-side |
| **Axios** | Cliente HTTP com interceptors |
| **Lucide React** | Ícones modernos |

> 💡 **Sobre o shadcn/ui:** não é uma biblioteca tradicional — é uma coleção de componentes que você **copia e cola** no projeto. Os arquivos ficam em `src/components/ui/` e são totalmente editáveis. Ele combina Radix UI (acessibilidade), Tailwind (estilo) e CVA (variantes).

---

## 🏗 Arquitetura

### Backend — padrão em 3 camadas

```
HTTP Request
   │
   ▼
┌──────────────────┐
│   FormRequest    │  ← valida a entrada (formato, campos obrigatórios)
└──────────────────┘
   │
   ▼
┌──────────────────┐
│   Controller     │  ← adapta HTTP (recebe request, devolve JSON)
└──────────────────┘
   │
   ▼
┌──────────────────┐
│     Service      │  ← regra de negócio (recalcula total, valida pagamento, gera token)
└──────────────────┘
   │
   ▼
┌──────────────────┐
│      Model       │  ← persistência (Eloquent)
└──────────────────┘
```

**Benefícios:**

- **Controller magro:** só lida com HTTP.
- **Service testável:** recebe arrays, não `Request`, portanto é agnóstico de HTTP.
- **FormRequest dedicado:** validação isolada, sem poluir o Controller.
- **Model:** apenas persistência e relacionamentos.

### Frontend — separação em camadas

```
Component (página)
   │
   ▼
Hook customizado (useProdutos, useVendas)
   │
   ▼
Service (produtosService, vendasService, authService)
   │
   ▼
Axios (api.ts com interceptors de token e 401)
   │
   ▼
Backend Laravel
```

**Benefícios:**

- Componentes não conhecem Axios — só consomem hooks.
- Trocar a fonte de dados (API → cache → mock) não afeta as telas.
- Interceptors centralizam injeção de token e tratamento de 401.

---

## 🧠 Decisões Técnicas

### 1. Sanctum com API Tokens (não SPA cookie-based)

Optei por **tokens Bearer** em vez de cookies de sessão porque:

- O front roda em porta separada (`5173`) do back (`8000`).
- Tokens são simples de testar no Postman (`Authorization: Bearer ...`).
- Não exige configuração de CSRF, CORS com credenciais, `sanctum/csrf-cookie`.

### 2. Service recebe `array`, não `Request`

O `AuthService::login()` recebe `array $data`, e o `VendaService::criar()` recebe `array $data, User $user`.

**Motivo:** Services que recebem `Request` ficam **acoplados ao HTTP**. Ao receber arrays, podem ser chamados de um comando Artisan, um Job ou um teste unitário sem montar uma `Request` fake.

### 3. Total recalculado no servidor (nunca no cliente)

O front **nunca** envia `total`, `preco_unitario` ou `subtotal` — só `produto_id` e `quantidade`. O backend:

1. Busca o preço atual do produto no banco
2. Calcula `subtotal = preco × quantidade`
3. Soma os subtotais
4. Congela o `preco_unitario` no item da venda

Isso garante o requisito: *"O preço do produto no momento da venda deve ficar registrado na venda, mesmo que o preço do produto mude depois."*

### 4. Imutabilidade da venda finalizada

A rota de vendas usa `apiResource()->only(['index', 'store', 'show'])`. **Não existe** `PUT` nem `DELETE`. Isso materializa no roteamento a regra *"Uma venda finalizada não deve ser alterada."*

### 5. Uso do `decimal:2` com normalização no front

O Eloquent serializa `decimal` como **string** (`"5.50"`), não como float. No front, o `vendasService` e `produtosService` convertem com `Number(...)` ao receber, evitando bugs de `toFixed` em strings.

### 6. Frontend como projeto separado (não como branch)

Optei por **manter o frontend como uma pasta dentro do repositório** (`pdv-frontend/`), sem criar branches separadas por tela.

**Motivação:**

- O teste pede **um repositório com o projeto**, não um fluxo de PRs.
- Cada tela foi implementada e testada **de forma incremental**, com commits atômicos e descritivos.
- Criar uma branch por tela adicionaria burocracia sem benefício — o objetivo era entregar um sistema funcional, não demonstrar um fluxo de Git flow completo.
- O histórico de commits reflete a evolução: setup → auth → produtos → vendas → frontend → integração.

Se o projeto evoluísse para um time, aí sim faria sentido adotar Git flow com branches por feature.

### 7. Mocks → API real

Durante o desenvolvimento do frontend, usei **mocks** (`USE_MOCK = true`) para permitir construir a UI antes do backend estar pronto. Quando o backend ficou estável, troquei `USE_MOCK` para `false` e depois removi os mocks completamente.

Isso foi útil para **paralelizar desenvolvimento** — front e back evoluíram em ritmos diferentes, sem bloqueio mútuo.

---

## 🗂 Estrutura de Pastas

```
pdv/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ProdutoController.php
│   │   │   ├── UsuarioController.php
│   │   │   └── VendaController.php
│   │   └── Requests/
│   │       ├── LoginRequest.php
│   │       ├── StoreProdutoRequest.php
│   │       ├── UpdateProdutoRequest.php
│   │       └── StoreVendaRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Produto.php
│   │   ├── Venda.php
│   │   └── ItemVenda.php
│   └── Services/
│       ├── AuthService.php
│       ├── ProdutoService.php
│       ├── UsuarioService.php
│       └── VendaService.php
│
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── ProdutoSeeder.php
│
├── routes/
│   └── api.php
│
├── docs/
│   └── pdv.postman_collection.json
│
├── pdv-frontend/                    ← frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  ← shadcn/ui
│   │   │   ├── app-layout.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── payment-modal.tsx
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-produtos.ts
│   │   │   └── use-vendas.ts
│   │   ├── pages/
│   │   │   ├── login.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── pdv.tsx
│   │   │   ├── produtos.tsx
│   │   │   └── historico.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── produtos.service.ts
│   │   │   └── vendas.service.ts
│   │   └── types/
│   │       ├── produto.ts
│   │       └── venda.ts
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| MySQL | 8.0+ | `mysql --version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | qualquer | `git --version` |

> 💡 Se você usa **XAMPP**, **Laragon** ou **Docker**, o MySQL já vem instalado — só garanta que o serviço esteja rodando.

### 🔧 Backend (Laravel)

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd pdv

# 2. Instale as dependências PHP
composer install

# 3. Configure o ambiente
cp .env.example .env
php artisan key:generate

# 4. Crie o banco no MySQL
mysql -u root -p -e "CREATE DATABASE pdv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Configure o .env com suas credenciais
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=pdv
#    DB_USERNAME=root
#    DB_PASSWORD=sua_senha_aqui

# 6. Rode as migrations e seeders
php artisan migrate:fresh --seed

# 7. Suba o servidor
php artisan serve
```

✅ Backend disponível em **http://127.0.0.1:8000**

### 🎨 Frontend (React + Vite)

Em **outro terminal**:

```bash
# 1. Entre na pasta do frontend
cd pdv-frontend

# 2. Instale as dependências (lê o package.json automaticamente)
npm install

# 3. Configure o .env
cp .env.example .env

# 4. Suba o servidor de desenvolvimento
npm run dev
```

✅ Frontend disponível em **http://localhost:5173**

> 💡 O `npm install` lê o `package.json` e instala automaticamente **todas** as dependências (React, Axios, Tailwind, shadcn/ui, Lucide, etc.). Não é necessário instalar pacote por pacote.

### 🌐 Acessar o sistema

Abra **http://localhost:5173** no navegador. Você será redirecionado para o login.

---

## 🔐 Credenciais de Teste

| Campo | Valor |
|---|---|
| **E-mail** | `teste@pdv.com` |
| **Senha** | `senha123` |

> Essas credenciais são criadas automaticamente pelo `DatabaseSeeder`.

---

## 🛰 Endpoints da API

### 🌐 Públicos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/login` | Autentica e retorna token Sanctum |

### 🔒 Protegidos (`auth:sanctum`)

#### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/me` | Retorna o usuário autenticado |
| `POST` | `/api/logout` | Revoga o token atual |

#### Usuários (extra)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/usuarios` | Lista todos |
| `POST` | `/api/usuarios` | Cria |
| `GET` | `/api/usuarios/{id}` | Detalhe |
| `PUT` | `/api/usuarios/{id}` | Atualiza |
| `DELETE` | `/api/usuarios/{id}` | Remove |

#### Produtos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos?busca=xxx` | Lista (busca por nome/código) |
| `GET` | `/api/produtos?disponiveis=1` | Apenas disponíveis |
| `POST` | `/api/produtos` | Cria |
| `GET` | `/api/produtos/{id}` | Detalhe |
| `PUT` | `/api/produtos/{id}` | Atualiza |
| `DELETE` | `/api/produtos/{id}` | Remove |

#### Vendas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/vendas?data=YYYY-MM-DD` | Histórico (filtro por data) |
| `POST` | `/api/vendas` | Cria venda |
| `GET` | `/api/vendas/{id}` | Consulta comprovante |

> ⚠️ **Não existem** `PUT` nem `DELETE` para vendas — a venda é imutável.

### Exemplo de payload — criar venda (dinheiro)

```json
{
  "forma_pagamento": "dinheiro",
  "valor_recebido": 50.00,
  "itens": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 5, "quantidade": 1 }
  ]
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "total": "15.50",
  "forma_pagamento": "dinheiro",
  "valor_recebido": "50.00",
  "troco": "34.50",
  "status": "finalizada",
  "itens": [
    { "produto_id": 1, "quantidade": 2, "preco_unitario": "5.50", "subtotal": "11.00" },
    { "produto_id": 5, "quantidade": 1, "preco_unitario": "4.50", "subtotal": "4.50" }
  ]
}
```

---

## 📬 Collection do Postman

O repositório inclui uma collection completa em **`docs/pdv.postman_collection.json`**.

Ela contém:

- ✅ Autenticação (login, me, logout) — com token salvo automaticamente
- ✅ CRUD de usuários
- ✅ CRUD de produtos (com busca e filtro de disponíveis)
- ✅ Criação de venda (dinheiro, pix) + casos de erro (422)
- ✅ Consulta de venda
- ✅ Histórico por data

### Como importar

1. Abra o **Postman**
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `docs/pdv.postman_collection.json`
4. Clique em **Import**

### Variáveis da collection

| Variável | Valor inicial | Preenchida por |
|---|---|---|
| `base_url` | `http://127.0.0.1:8000/api` | Fixo |
| `token` | *(vazio)* | Requisição **Login** |
| `produto_id` | *(vazio)* | Requisição **Criar produto** |
| `venda_id` | *(vazio)* | Requisição **Criar venda - dinheiro** |
| `usuario_id` | *(vazio)* | Requisição **Criar usuário** |

### Fluxo de uso

1. Rode **Auth → Login** (o token é salvo automaticamente)
2. Rode **Produtos → Listar todos** (deve retornar os 10 do seeder)
3. Rode **Produtos → Criar** (salva o `produto_id`)
4. Rode **Vendas → Criar venda - dinheiro** (salva o `venda_id`)
5. Rode **Vendas → Consultar venda** (usa o `venda_id`)

### Credenciais de teste

Use `teste@pdv.com` / `senha123` na requisição **Auth → Login**.

---

## 📏 Regras de Negócio

| Regra do enunciado | Onde está implementada |
|---|---|
| Total e subtotais confiáveis | `VendaService::prepararItens()` recalcula tudo |
| Preço do produto congelado na venda | `venda_itens.preco_unitario` é salvo no momento da criação |
| Venda tem 1+ itens | `StoreVendaRequest` com `itens: required, array, min:1` |
| Dinheiro: valor recebido ≥ total | `VendaService::criar()` valida e lança 422 |
| Troco = valor recebido − total | Calculado no `VendaService` |
| Produtos indisponíveis bloqueados | `VendaService::prepararItens()` verifica `disponivel` |
| Venda finalizada imutável | Rota sem `PUT`/`DELETE` + `status = finalizada` |
| Ignorar valores do cliente | `StoreVendaRequest` não aceita `total`/`preco`/`subtotal` |

---

## 🌳 Estratégia de Versionamento

O projeto foi versionado com **commits atômicos e descritivos**, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): implementa autenticação com Laravel Sanctum
feat(produtos): adiciona CRUD completo de produtos
feat(vendas): implementa criação de venda com regras de negócio
feat(frontend): adiciona telas principais do PDV com tema claro/escuro
fix(frontend): corrige tsconfig, typos e imports faltantes
docs: adiciona README com instruções e decisões técnicas
```

### Por que não usei branches por tela?

O frontend foi desenvolvido **incrementalmente**, commitando parte por parte e testando cada etapa antes de seguir. A alternativa — criar uma branch por tela (`feature/login`, `feature/pdv`, `feature/dashboard`) — adicionaria burocracia sem benefício real num contexto de teste prático individual.

Além disso, **backend e frontend foram desenvolvidos em conjunto**, com o front consumindo o back à medida que os endpoints ficavam prontos. Isso torna branches por tela artificiais — as telas compartilham tipos, services e hooks entre si.

Se o projeto fosse para um time, aí sim faria sentido adotar Git flow com branches por feature e PRs.

---

## 🚫 O que ficou de fora

Para manter o escopo controlado (conforme orientação do enunciado: *"prefira um escopo menor, bem feito e explicado"*), os seguintes itens **não** foram implementados:

- ❌ **Testes automatizados** — priorizei cobrir as regras manualmente via Postman e validação end-to-end
- ❌ **Cadastro público de usuário** (`/register`) — não é exigido
- ❌ **Recuperação de senha** — não é exigido
- ❌ **Permissões/perfis** (admin vs operador) — não é exigido
- ❌ **Cancelamento de venda** — o enunciado diz que a venda é imutável
- ❌ **Controle de estoque transacional** — implementado como campo, mas sem decremento atômico
- ❌ **Paginação** nas listagens — o volume do seeder não justifica
- ❌ **Testes de frontend** — foco do bônus é backend

### Extra não pedido, mas incluído

- ✅ **CRUD completo de usuários** — implementado como extensão natural do bônus de autenticação
- ✅ **Histórico de vendas por data** — bônus do enunciado
- ✅ **Tema claro/escuro persistente** — melhoria de UX
- ✅ **Dashboard com métricas** — visão geral do movimento
- ✅ **Collection do Postman** — facilita testes manuais

---

## 👤 Autor

Desenvolvido por **[Caio Reis Alvarenga]** como parte do teste prático da **Kasterweb**.

- GitHub: [@seu-usuario](https://github.com/caioreisalvarenga)
- E-mail: caioreisalvarenga@gmail.com

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica. Não possui licença de uso comercial.
