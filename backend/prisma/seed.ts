import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';

  // Verifica se o admin já existe
  const existeAdmin = await prisma.usuario.findUnique({ where: { username } });
  if (existeAdmin) {
    console.log('Usuário admin já existe.');
    return;
  }

  // Gera hash da senha 'admin'
  const hashedPassword = await bcrypt.hash('admin', 10);

  // Insere o admin usando SQL raw
  await prisma.$executeRaw`
    INSERT INTO usuarios (username, password, nome, tipo, status, quant_acesso)
    VALUES (${username}, ${hashedPassword}, 'Administrador', '0', 'A', 0)
  `;

  console.log('Usuário admin criado: admin/admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
