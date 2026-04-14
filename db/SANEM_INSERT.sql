INSERT INTO usuario (nome, email, senha_hash, tipo) VALUES
('João Silva', 'joao.silva@sanem.org', '$2b$10$XYZ...HashDaSenha...', 'Administrador'),
('Maria Santos', 'maria.santos@sanem.org', '$2b$10$ABC...HashDaSenha...', 'Operador'),
('Carlos Oliveira', 'carlos.oliveira@sanem.org', '$2b$10$DEF...HashDaSenha...', 'Operador');

INSERT INTO categoria (nome, descricao, unidade_medida) VALUES
('Alimentos Não Perecíveis', 'Arroz, feijão, macarrão, óleo, etc.', 'kg'),
('Alimentos Perecíveis', 'Frutas, verduras, carnes, laticínios', 'kg'),
('Roupas', 'Vestuário em geral', 'unidade'),
('Calçados', 'Sapatos, tênis, chinelos', 'par'),
('Produtos de Higiene', 'Sabonete, xampu, pasta de dente, etc.', 'unidade'),
('Produtos de Limpeza', 'Detergente, sabão em pó, desinfetante', 'unidade'),
('Brinquedos', 'Brinquedos para crianças', 'unidade'),
('Material Escolar', 'Cadernos, lápis, canetas, mochilas', 'unidade');

INSERT INTO item (id_categoria, nome, descricao, quantidade_estoque, estoque_minimo) VALUES
(1, 'Arroz tipo 1', 'Arroz branco tipo 1, pacote de 5kg', 150.00, 50.00),
(1, 'Feijão carioca', 'Feijão carioca, pacote de 1kg', 80.00, 30.00),
(1, 'Macarrão espaguete', 'Macarrão espaguete 500g', 120.00, 40.00),
(1, 'Óleo de soja', 'Óleo de soja 900ml', 60.00, 20.00),
(1, 'Açúcar cristal', 'Açúcar cristal 1kg', 45.00, 20.00),
(1, 'Café em pó', 'Café em pó 500g', 35.00, 15.00),
(1, 'Sal refinado', 'Sal refinado 1kg', 40.00, 15.00),
(1, 'Farinha de trigo', 'Farinha de trigo 1kg', 55.00, 20.00),
(2, 'Leite integral', 'Leite integral 1L', 30.00, 10.00),
(2, 'Carne moída', 'Carne moída bovina', 15.00, 5.00),
(3, 'Camiseta adulto M', 'Camiseta básica tamanho M', 25.00, 10.00),
(3, 'Calça jeans adulto', 'Calça jeans diversos tamanhos', 18.00, 8.00),
(3, 'Roupa infantil 2-4 anos', 'Conjuntos infantis variados', 30.00, 10.00),
(4, 'Chinelo adulto', 'Chinelo de borracha tamanhos variados', 22.00, 10.00),
(4, 'Tênis infantil', 'Tênis diversos tamanhos', 15.00, 5.00),
(5, 'Sabonete', 'Sabonete em barra 90g', 100.00, 40.00),
(5, 'Xampu', 'Xampu 350ml', 45.00, 20.00),
(5, 'Pasta de dente', 'Creme dental 90g', 60.00, 25.00),
(5, 'Papel higiênico', 'Papel higiênico 4 rolos', 50.00, 20.00),
(5, 'Absorvente feminino', 'Absorvente com abas', 35.00, 15.00),
(6, 'Detergente', 'Detergente líquido 500ml', 40.00, 15.00),
(6, 'Sabão em pó', 'Sabão em pó 1kg', 30.00, 10.00),
(6, 'Água sanitária', 'Água sanitária 1L', 28.00, 12.00),
(7, 'Boneca', 'Bonecas diversas', 12.00, 5.00),
(7, 'Carrinho', 'Carrinhos de brinquedo', 10.00, 5.00),
(8, 'Caderno universitário', 'Caderno 10 matérias', 40.00, 15.00),
(8, 'Estojo completo', 'Estojo com lápis, canetas e borracha', 25.00, 10.00),
(8, 'Mochila escolar', 'Mochila para estudantes', 18.00, 8.00);

INSERT INTO doador (nome, cpf_cnpj, tipo_pessoa, telefone, email, endereco) VALUES
('Supermercado Bom Preço Ltda', '12.345.678/0001-90', 'Jurídica', '(41) 3333-4444', 'contato@bompreco.com.br', 'Av. Principal, 1000 - Centro - Curitiba/PR'),
('Ana Paula Ferreira', '123.456.789-00', 'Física', '(41) 99999-8888', 'ana.paula@email.com', 'Rua das Flores, 234 - Batel - Curitiba/PR'),
('Padaria Pão Quente', '98.765.432/0001-11', 'Jurídica', '(41) 3232-5656', 'paoquente@gmail.com', 'Rua do Comércio, 567 - Agua Verde - Curitiba/PR'),
('Roberto Carlos da Silva', '987.654.321-00', 'Física', '(41) 98888-7777', 'roberto.silva@email.com', 'Av. Sete de Setembro, 890 - Centro - Curitiba/PR'),
('Igreja Assembleia de Deus', '11.222.333/0001-44', 'Jurídica', '(41) 3344-5566', 'assembleia@igreja.org', 'Rua da Paz, 123 - Portão - Curitiba/PR');

INSERT INTO beneficiario (nome, cpf, telefone, endereco, situacao_social, numero_membros_familia) VALUES
('Joana Maria dos Santos', '111.222.333-44', '(41) 97777-6666', 'Rua Esperança, 45 - CIC - Curitiba/PR', 'Desempregada, mãe solteira', 4),
('Pedro Henrique Costa', '222.333.444-55', '(41) 96666-5555', 'Av. das Nações, 234 - Cajuru - Curitiba/PR', 'Trabalhador informal', 3),
('Francisca Aparecida Lima', '333.444.555-66', '(41) 95555-4444', 'Rua do Sol, 678 - Tatuquara - Curitiba/PR', 'Aposentada por invalidez', 2),
('José Carlos Pereira', '444.555.666-77', '(41) 94444-3333', 'Rua da Alegria, 901 - Sítio Cercado - Curitiba/PR', 'Desempregado', 5),
('Maria das Graças Oliveira', '555.666.777-88', '(41) 93333-2222', 'Av. Paraná, 1234 - Pinheirinho - Curitiba/PR', 'Trabalho temporário', 3);

INSERT INTO doacao (id_doador, id_usuario, observacao, valor_estimado) VALUES
(1, 1, 'Doação mensal do supermercado - alimentos não perecíveis', 1500.00),
(2, 2, 'Doação de roupas e calçados usados em bom estado', 300.00),
(3, 2, 'Doação de pães e produtos de padaria', 200.00),
(4, 3, 'Doação de materiais de higiene e limpeza', 250.00),
(5, 1, 'Doação da campanha de Natal - diversos itens', 800.00);

INSERT INTO item_doacao (id_doacao, id_item, quantidade, lote, validade) VALUES
(1, 1, 50.00, 'LOT001', '2027-12-31'),
(1, 2, 30.00, 'LOT002', '2027-10-15'),
(1, 3, 40.00, 'LOT003', '2027-08-20'),
(1, 4, 20.00, 'LOT004', '2026-12-31'),
(2, 11, 10.00, NULL, NULL),
(2, 12, 5.00, NULL, NULL),
(2, 14, 8.00, NULL, NULL),
(3, 9, 15.00, 'LOT005', '2026-04-10'),
(4, 16, 30.00, 'LOT006', '2028-05-15'),
(4, 18, 20.00, 'LOT007', '2027-11-30'),
(4, 21, 15.00, 'LOT008', '2028-01-15'),
(5, 13, 12.00, NULL, NULL),
(5, 24, 8.00, NULL, NULL),
(5, 26, 15.00, NULL, NULL),
(5, 27, 10.00, NULL, NULL);

INSERT INTO distribuicao (id_beneficiario, id_usuario, observacao, status) VALUES
(1, 2, 'Cesta básica mensal', 'Concluída'),
(2, 2, 'Kit higiene e limpeza', 'Concluída'),
(3, 3, 'Cesta básica + roupas', 'Concluída'),
(4, 2, 'Cesta básica mensal', 'Concluída'),
(5, 3, 'Kit material escolar + alimentos', 'Concluída');

INSERT INTO item_distribuicao (id_distribuicao, id_item, quantidade, lote) VALUES
(1, 1, 10.00, 'LOT001'),
(1, 2, 5.00, 'LOT002'),
(1, 3, 5.00, 'LOT003'),
(1, 4, 2.00, 'LOT004'),
(1, 16, 4.00, 'LOT006'),
(2, 16, 5.00, 'LOT006'),
(2, 18, 3.00, 'LOT007'),
(2, 21, 2.00, 'LOT008'),
(3, 1, 5.00, 'LOT001'),
(3, 2, 3.00, 'LOT002'),
(3, 11, 3.00, NULL),
(4, 1, 15.00, 'LOT001'),
(4, 2, 8.00, 'LOT002'),
(4, 3, 8.00, 'LOT003'),
(5, 1, 8.00, 'LOT001'),
(5, 26, 5.00, NULL),
(5, 27, 3.00, NULL);