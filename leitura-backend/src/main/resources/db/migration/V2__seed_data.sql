-- ============================================================
-- Sistema de Clubes de Leitura
-- V2 - Dados iniciais para desenvolvimento
-- ============================================================

USE clube_leitura;

-- Usuários de teste (senhas são hash BCrypt de "Senha@123")
INSERT INTO usuario (nome, email, senha, tipo_perfil, data_cadastro) VALUES
('Admin Sistema',   'admin@clubeleitura.com',  '$2a$10$w9ZnXgV.m0eFoXJRL41ZK.zX9wxRyBpTI/r9IbZXDUP5WM5DL9EBK', 'admin',  CURRENT_DATE),
('Isabel Freire',   'isabel@email.com',        '$2a$10$w9ZnXgV.m0eFoXJRL41ZK.zX9wxRyBpTI/r9IbZXDUP5WM5DL9EBK', 'leitor', CURRENT_DATE),
('Caio Soares',     'caio@email.com',          '$2a$10$w9ZnXgV.m0eFoXJRL41ZK.zX9wxRyBpTI/r9IbZXDUP5WM5DL9EBK', 'leitor', CURRENT_DATE),
('Maycon Maia',     'maycon@email.com',        '$2a$10$w9ZnXgV.m0eFoXJRL41ZK.zX9wxRyBpTI/r9IbZXDUP5WM5DL9EBK', 'leitor', CURRENT_DATE),
('Pedro Sousa',     'pedro@email.com',         '$2a$10$w9ZnXgV.m0eFoXJRL41ZK.zX9wxRyBpTI/r9IbZXDUP5WM5DL9EBK', 'autor',  CURRENT_DATE);

-- Livros de demonstração
INSERT INTO livro (titulo, autor, genero, descricao, tipo, data_publicacao) VALUES
('Dom Casmurro',                    'Machado de Assis',   'Romance',        'Clássico da literatura brasileira narrado por Bentinho.', 'livro', '1899-01-01'),
('O Cortiço',                       'Aluísio Azevedo',    'Naturalismo',    'Retrato da vida coletiva no Rio de Janeiro do século XIX.', 'livro', '1890-01-01'),
('A Hora da Estrela',               'Clarice Lispector',  'Ficção',         'A história de Macabéa, uma nordestina no Rio de Janeiro.', 'livro', '1977-01-01'),
('O Senhor dos Anéis',              'J.R.R. Tolkien',     'Fantasia',       'A grande jornada de Frodo para destruir o Um Anel.', 'livro', '1954-07-29'),
('Harry Potter e a Pedra Filosofal','J.K. Rowling',       'Fantasia',       'O início da jornada de Harry Potter no mundo mágico.', 'livro', '1997-06-26'),
('1984',                            'George Orwell',      'Distopia',       'Um futuro totalitário onde o Grande Irmão vigia tudo.', 'livro', '1949-06-08'),
('O Pequeno Príncipe',              'Antoine de Exupéry', 'Fábula',         'Um aviador encontra um pequeno príncipe no deserto.', 'livro', '1943-04-06'),
('Sapiens',                         'Yuval Noah Harari',  'Não-ficção',     'Uma breve história da humanidade.', 'livro', '2011-01-01');

-- Grupos de leitura
INSERT INTO grupo_leitura (nome, descricao, privado, id_usuario) VALUES
('Clássicos Brasileiros', 'Grupo dedicado à leitura de obras clássicas da literatura brasileira.', 0, 1),
('Fantasia e Aventura',   'Para quem ama mundos mágicos e grandes aventuras.', 0, 2),
('Não-ficção & Ciência',  'Explorando o conhecimento através de boas leituras.', 1, 3);

-- Associar usuários aos grupos
INSERT INTO usuario_grupo (id_usuario, id_grupo_leitura) VALUES
(1, 1), (2, 1), (3, 1),
(2, 2), (4, 2), (5, 2),
(3, 3), (4, 3);

-- Registros de leitura
INSERT INTO leitura (id_usuario, id_livro, status, data_inicio, data_fim) VALUES
(2, 1, 'lido',      '2026-01-10', '2026-01-25'),
(2, 3, 'lendo',     '2026-06-01', NULL),
(2, 5, 'quero_ler', NULL,         NULL),
(3, 4, 'lido',      '2026-02-01', '2026-02-20'),
(3, 6, 'lendo',     '2026-06-05', NULL),
(4, 7, 'lido',      '2026-03-01', '2026-03-05'),
(4, 8, 'lendo',     '2026-06-10', NULL),
(5, 2, 'lido',      '2026-04-01', '2026-04-15');

-- Resenhas
INSERT INTO resenha (id_usuario, id_livro, texto, nota, data) VALUES
(2, 1, 'Uma obra-prima! A narrativa de Bentinho é envolvente e cheia de ambiguidade. Machado de Assis é genial.', 5.0, '2026-01-26'),
(3, 4, 'Tolkien criou um universo incrível. A jornada de Frodo é épica e emocionante do início ao fim.', 4.5, '2026-02-21'),
(4, 7, 'Uma leitura rápida e profunda ao mesmo tempo. O Pequeno Príncipe nunca envelhece.', 5.0, '2026-03-06');

-- Estatísticas iniciais
INSERT INTO estatistica (id_usuario, livros_lidos, livros_em_leitura, livros_desejados) VALUES
(1, 0, 0, 0),
(2, 1, 1, 1),
(3, 1, 1, 0),
(4, 1, 1, 0),
(5, 1, 0, 0);

-- Metas de leitura
INSERT INTO meta_leitura (id_usuario, quantidade_livros, prazo, progresso) VALUES
(2, 12, '2026-12-31 23:59:59', 1),
(3, 6,  '2026-12-31 23:59:59', 1),
(4, 10, '2026-12-31 23:59:59', 1);
