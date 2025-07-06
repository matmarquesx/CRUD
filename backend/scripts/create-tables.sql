-- Script SQL para criação das tabelas do projeto CRUD com Autenticação
-- Este script é uma alternativa às migrations do Prisma

-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo CHAR(1) NOT NULL, -- 0=Admin, 1=Usuário
    status CHAR(1) NOT NULL, -- A=Ativo, I=Inativo, B=Bloqueado
    quant_acesso INTEGER NOT NULL DEFAULT 0
);

-- Criação da tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_username VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario_username) REFERENCES usuarios(username) ON DELETE CASCADE
);

-- Criação de índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_username);
CREATE INDEX IF NOT EXISTS idx_tarefas_concluida ON tarefas(concluida);

-- Inserção de um usuário administrador inicial (senha: admin123)
-- A senha está criptografada com bcrypt
INSERT INTO usuarios (username, password, nome, tipo, status, quant_acesso)
VALUES ('admin', '$2b$10$3euPcmQFCiblsZeEu5s7p.9wVdtdHCKTSJdpgWcNxFN5auAqEo3wy', 'Administrador', '0', 'A', 0)
ON CONFLICT (username) DO NOTHING;
