# Controle de Tarefas

Aplicativo mobile de controle de tarefas (todo list) construído com **React Native + Expo (SDK 54)**, consumindo uma **API REST** em **Node.js + Express** que se comunica com o **MySQL** via `mysql2`.

## Estrutura do projeto

```
task-manager/
├── mobile/                  # Aplicativo Expo (React Native + TypeScript)
│   ├── App.tsx
│   └── src/
│       ├── components/      # TaskCard, FilterTabs, TaskFormModal, EmptyState
│       ├── screens/         # HomeScreen
│       ├── services/        # api.ts e taskService.ts (comunicação com a API)
│       ├── types/           # Tipos Task, TaskInput, FilterType
│       └── theme/           # Cores, espaçamentos, tipografia
└── backend/                 # API Node.js + Express + TypeScript
    └── src/
        ├── config/          # Conexão com o MySQL (pool mysql2)
        ├── controllers/     # task.controller.ts
        ├── database/        # schema.sql (criação do banco/tabela)
        └── routes/          # task.routes.ts
```

## Tecnologias

- **Frontend:** React Native + Expo (SDK 54, compatível com Expo Go), TypeScript
- **Backend:** Node.js + Express, TypeScript
- **Banco de dados:** MySQL (conexão via `mysql2` com queries parametrizadas)
- **Ícones:** `@expo/vector-icons`

O aplicativo mobile **não** se conecta diretamente ao MySQL — toda a comunicação passa pela API REST (`/api/tasks`).

## Requisitos

- Node.js 18 ou superior
- MySQL 8 rodando localmente (ou em um servidor acessível)
- Aplicativo **Expo Go** instalado no celular (ou emulador Android/iOS)

---

## 1. Backend (API + MySQL)

### 1.1 Criar o banco de dados

Com o MySQL em execução, execute o script SQL que cria o banco `task_manager` e a tabela `tasks`:

```bash
cd backend
mysql -u root -p < src/database/schema.sql
```

### 1.2 Configurar as credenciais

Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme o seu MySQL:

```bash
cd backend
cp .env.example .env
```

Conteúdo do `.env`:

```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua-senha
DB_NAME=task_manager
```

### 1.3 Instalar e executar

```bash
cd backend
npm install
npm run dev
```

O servidor inicia em `http://localhost:3333`. Ao subir, ele valida a conexão com o MySQL e exibe:

```
Conexão com o MySQL estabelecida com sucesso.
API de tarefas rodando em http://localhost:3333
```

### 1.4 Endpoints da API

| Método | Rota               | Descrição                                         |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/api/categories`  | Lista todas as categorias cadastradas             |
| POST   | `/api/categories`  | Cria uma nova categoria (`{ title }`)             |
| GET    | `/api/tasks`       | Lista todas as tarefas com a categoria associada  |
| POST   | `/api/tasks`       | Cria uma tarefa (`{ title, description?, id_categories }`) |
| PUT    | `/api/tasks/:id`   | Atualiza título, descrição, categoria e/ou status |
| DELETE | `/api/tasks/:id`   | Exclui uma tarefa                                 |

---

## 2. Mobile (Expo)

### 2.1 Instalar e iniciar

```bash
cd mobile
npm install
npx expo start
```

No terminal do Expo, escaneie o **QR Code** com o aplicativo **Expo Go** (celular e computador devem estar na **mesma rede Wi-Fi**).

### 2.2 Como o app encontra a API

O `src/services/api.ts` descobre automaticamente o IP da máquina que está rodando o Expo (via `Constants.expoConfig.hostUri`) e usa a porta **3333** da API. Ou seja:

- **Celular físico (Expo Go):** usa o IP local da sua máquina automaticamente.
- **Emulador Android:** usa `10.0.2.2` automaticamente se o host não for detectado.
- **Simulador iOS:** usa `localhost`.

Se a API rodar em outra máquina/porta, basta ajustar a constante `API_URL` em `src/services/api.ts`.

---

## 3. Funcionalidades

- Listar todas as tarefas com visualização da respectiva categoria
- Criar novas categorias pelo cabeçalho ou durante o cadastro de tarefas
- Criar tarefas selecionando uma categoria existente ou recém-criada via dropdown/select
- Editar e excluir tarefas
- Marcar/desmarcar tarefa como concluída
- Filtrar por **Todas**, **Pendentes** e **Concluídas**
- Contador de tarefas pendentes no cabeçalho
- Estados de carregamento, erro e lista vazia

## Estrutura do banco de dados

```sql
CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_categories INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_categories) REFERENCES categories(id)
) ENGINE = InnoDB;
```