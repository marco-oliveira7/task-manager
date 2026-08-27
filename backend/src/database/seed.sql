USE task_manager;

-- Categorias
INSERT INTO categories (title) VALUES
  ('Trabalho'),
  ('Estudos'),
  ('Pessoal'),
  ('Casa'),
  ('Compras');

-- Tarefas
INSERT INTO tasks (title, description, completed, id_categories) VALUES
  ('Finalizar relatório mensal',
   'Revisar os dados e enviar o relatório para a equipe.',
   0,
   1),

  ('Preparar apresentação',
   'Criar os slides para a reunião da próxima semana.',
   0,
   1),

  ('Estudar MySQL',
   'Revisar criação de tabelas, relacionamentos e consultas SQL.',
   1,
   2),

  ('Fazer exercícios de programação',
   'Resolver exercícios sobre SQL e desenvolvimento backend.',
   0,
   2),

  ('Fazer exercícios físicos',
   'Realizar pelo menos 30 minutos de atividade física.',
   0,
   3),

  ('Ler um livro',
   'Ler pelo menos um capítulo do livro atual.',
   1,
   3),

  ('Limpar a casa',
   'Organizar os cômodos e fazer a limpeza geral.',
   0,
   4),

  ('Lavar roupa',
   'Separar e lavar as roupas acumuladas.',
   1,
   4),

  ('Comprar alimentos',
   'Comprar frutas, verduras, arroz, feijão e outros itens necessários.',
   0,
   5),

  ('Comprar produtos de limpeza',
   'Repor detergente, sabão em pó e desinfetante.',
   0,
   5);
