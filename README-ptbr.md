# OCR Case Outline - PT-BR
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![Nest](https://img.shields.io/badge/Nest.js-%23E0234E.svg?logo=nestjs&logoColor=white)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)

[README English](README.md)

<p>Este repositório contém o código fonte para uma solução completa de OCR (Reconhecimento Óptico de Caracteres) integrada com um modelo de linguagem (LLM), que permite aos usuários fazer upload de imagens, extrair o texto e solicitar explicações interativas sobre os dados extraídos.</p>

Link do Deploy: 
[Vercel](https://ocr-llm-jade.vercel.app/)

## Estrutura do Repositório

O repositório está dividido em duas pastas principais:

    backend-ocr-llm: Contém o backend desenvolvido com o framework NestJS e o Banco de Dados com o Prisma ORM.
    frontend-ocr-llm: Contém o frontend desenvolvido com o Next.js.

### Funcionalidades

- **Upload de Documentos:** Permite aos usuários fazer upload de uma imagem.
- **Extração de Texto (OCR):** Processamento da imagem para extração de texto usando OCR.
- **Interação com LLM:** Usuários podem fazer perguntas sobre os dados extraídos e obter respostas interativas usando O modelo de linguagem (GPT-4o-mini).
- **Exibição de Documentos Carregados:** Exibe a lista de documentos previamente carregados e as interações com o LLM.
- **Download de Documentos:** Oferece a possibilidade de baixar os documentos carregados com o texto extraído e as interações com o LLM em um formato de PDF.
- **Gerenciamento de Usuários:** Oferece ao usuário para criar uma conta e realizar o login.

### Requisitos

    Prisma ORM: Usado para modelar o banco de dados.
    NestJS: Framework usado para o backend.
    Next.js: Framework usado para o frontend.
    Node.js
    npm (Node Package Manager)

## Instruções de Configuração para Rodar Local

- Clone o repositório para sua máquina:

```bash
git clone https://github.com/DaniOrze/ocr-llm.git
```

- Navegue até a pasta do projeto:

```bash
cd ocr-llm
```

## Configuração do Ambiente

Antes de rodar o projeto localmente, é necessário configurar algumas variáveis de ambiente essenciais.

### Arquivo .env

No diretório tanto do backend quanto do frontend, você encontrará um arquivo .env.example. Faça uma cópia desse arquivo e renomeie para .env, depois preencha as seguintes variáveis com os valores apropriados:

Backend (backend-ocr-llm/.env):

    DATABASE_URL: URL de conexão com o banco de dados do prisma.
    PULSE_API_KEY: Chave também disponibilizada pelo prisma.
    JWT_SECRET: Chave de segurança para o JWT.
    OPENAI_API_KEY: Chave de API para o modelo de linguagem (GPT-4 ou outro).
    UPLOAD_DIR: Pasta de arquivos onde ficará os uploads das imagens.
    COOKIE_DOMAIN: Domínio que irá criar os cookies.

Frontend (frontend-ocr-llm/.env):

    NEXT_PUBLIC_API_BASE_URL: Chave de URL da API do backend.

Preencha esses valores antes de rodar a aplicação localmente.

## Backend

- Navegue até a pasta do backend:

```bash
cd backend-ocr-llm
```

- Instalar dependências do backend:

```bash
npm install
```

- Rodando o Backend:

```bash
npm run start:dev
```

    O backend estará disponível em http://localhost:4200.

## Banco de Dados

- Configuração do Banco de Dados:

No arquivo .env do projeto backend, defina as variáveis de ambiente conforme .env.example para a conexão com o banco de dados.

- Para gerar as migrações do Prisma, execute:

```bash
npx prisma migrate dev --name init
```

- Visualizar Banco de Dados:

``` bash
npx prisma studio
```

## Frontend

- Navegue até a pasta do frontend:

```bash
cd frontend-ocr-llm
```

- Instalar dependências do frontend:

```bash
npm install
```

- Rodando o Frontend:

```bash
npm run dev
```

    O frontend estará disponível em http://localhost:3000.

## Deploy

O projeto foi implantado na Vercel, facilitando o processo de deploy e garantindo que a aplicação esteja disponível online. Para acessar a versão em produção do projeto, basta visitar o seguinte link:

Link do Deploy: 
[Vercel](https://ocr-llm-jade.vercel.app/)

