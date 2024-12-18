# OCR Case Outline - EN
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![Nest](https://img.shields.io/badge/Nest.js-%23E0234E.svg?logo=nestjs&logoColor=white)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)

[README Portuguese](README-ptbr.md)

<p>This repository contains the source code for a complete OCR (Optical Character Recognition) solution integrated with a language model (LLM), allowing users to upload images, extract text, and request interactive explanations of the extracted data.</p>

Deploy Link: 
[Vercel](https://ocr-llm-jade.vercel.app/)

## Repository Structure

The repository is divided into two main folders:

    backend-ocr-llm: Contains the backend developed with the NestJS framework and the database with Prisma ORM.
    frontend-ocr-llm: Contains the frontend developed with Next.js.

### Features

- **Document Upload:** Allows users to upload an image.
- **Text Extraction (OCR):** Processes the image to extract text using OCR.
- **LLM Interaction:** Users can ask questions about the extracted data and get interactive responses using the language model (GPT-4 mini).
- **Display Uploaded Documents:** Shows a list of previously uploaded documents and interactions with the LLM.
- **Download Documents:** Provides the option to download the uploaded documents with extracted text and LLM interactions in PDF format.
- **User Management:** Allows the user to create an account and log in.

### Requirements

    Prisma ORM: Used for modeling the database.
    NestJS: Framework used for the backend.
    Next.js: Framework used for the frontend.
    Node.js
    npm (Node Package Manager)

## Setup Instructions to Run Locally

- Clone the repository to your machine:

```bash
git clone https://github.com/DaniOrze/ocr-llm.git
```


- Navigate to the project folder:

```bash
cd ocr-llm
```

## Environment Setup

Before running the project locally, you need to set up some essential environment variables.

### .env file

In both the backend and frontend directories, you will find an .env.example file. Copy this file and rename it to .env, then fill in the following variables with the appropriate values:

Backend (backend-ocr-llm/.env):

    DATABASE_URL: Prisma database connection URL.
    PULSE_API_KEY: Key provided by Prisma.
    JWT_SECRET: Security key for JWT.
    OPENAI_API_KEY: API key for the language model (GPT-4 or other).
    UPLOAD_DIR: Folder where image uploads will be stored.
    COOKIE_DOMAIN: Domain for cookie creation.

Frontend (frontend-ocr-llm/.env):

    NEXT_PUBLIC_API_BASE_URL: API base URL key for the backend.

Fill in these values before running the application locally.

## Backend

- Navigate to the backend folder:

```bash
cd backend-ocr-llm
```

- Install backend dependencies:

```bash
npm install
```

- Running the Backend:

```bash
npm run start:dev
```

    The backend will be available at http://localhost:4200.

## Database

- Database Configuration:

In the .env file of the backend project, set the environment variables according to .env.example for the database connection.

- To generate Prisma migrations, run:

```bash
npx prisma migrate dev --name init
```

- View Database:

``` bash
npx prisma studio
```

## Frontend

- Navigate to the frontend folder:

```bash
cd frontend-ocr-llm
```

- Install frontend dependencies:

```bash
npm install
```

- Running the Frontend:

```bash
npm run dev
```

    The frontend will be available at http://localhost:3000.

## Deployment

The project has been deployed on Vercel, simplifying the deployment process and ensuring the application is available online. To access the production version of the project, visit the following link:

Deploy Link: 
[Vercel](https://ocr-llm-jade.vercel.app/)

