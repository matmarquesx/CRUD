-- Criação da tabela de usuários
CREATE TABLE "usuarios" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "quant_acesso" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("username")
);

-- Criação da tabela de tarefas
CREATE TABLE "tarefas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_username" TEXT NOT NULL,
    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- Adição de chave estrangeira
ALTER TABLE "tarefas"
ADD CONSTRAINT "tarefas_usuario_username_fkey"
FOREIGN KEY ("usuario_username")
REFERENCES "usuarios"("username")
ON DELETE RESTRICT
ON UPDATE CASCADE;
