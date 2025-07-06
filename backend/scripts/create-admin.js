// Script para criar um usuário administrador
// Este script pode ser usado para criar um usuário administrador com senha criptografada

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Configurações
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    const nome = process.argv[4] || 'Administrador';
    
    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar usuário admin
    const admin = await prisma.usuario.upsert({
      where: { username },
      update: {
        password: hashedPassword,
        nome,
        tipo: '0',
        status: 'A'
      },
      create: {
        username,
        password: hashedPassword,
        nome,
        tipo: '0', // 0 = Admin
        status: 'A', // A = Ativo
        quant_acesso: 0
      }
    });
    
    console.log(`Usuário administrador criado/atualizado com sucesso:`);
    console.log(`- Username: ${admin.username}`);
    console.log(`- Nome: ${admin.nome}`);
    console.log(`- Tipo: Administrador`);
    console.log(`- Status: Ativo`);
    console.log(`\nVocê pode fazer login com:`);
    console.log(`- Username: ${admin.username}`);
    console.log(`- Senha: ${password} (não criptografada)`);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar função
createAdmin();
