import app from './app';
import { testConnection } from './config/database';

const PORT = Number(process.env.PORT) || 3333;

async function start() {
  try {
    await testConnection();
    console.log('Conexão com o MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao MySQL. Verifique se o serviço está rodando e as credenciais no arquivo .env.');
    console.error(error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API de tarefas rodando em http://localhost:${PORT}`);
  });
}

start();