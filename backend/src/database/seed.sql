INSERT INTO categories (title) VALUES
('Estudos'),
('Trabalho'),
('Pessoal'),
('Projetos'),
('Compras');

INSERT INTO tasks (title, description, completed, id_categories) VALUES
('Estudar SQL', 'Revisar comandos SELECT, INSERT, UPDATE e DELETE', 0, 1),
('Fazer exercícios de matemática', 'Resolver os exercícios da lista de matemática', 1, 1),
('Enviar relatório', 'Enviar o relatório para o responsável', 0, 2),
('Organizar documentos', 'Organizar os documentos pendentes', 1, 2),
('Ir à academia', 'Fazer o treino de hoje', 0, 3),
('Limpar o quarto', 'Organizar e limpar o quarto', 0, 3),
('Finalizar API', 'Terminar os endpoints da API do projeto', 0, 4),
('Corrigir bugs', 'Corrigir os problemas encontrados nos testes', 1, 4),
('Comprar material escolar', 'Comprar cadernos e canetas', 0, 5),
('Comprar alimentos', 'Comprar os alimentos da semana', 0, 5);
