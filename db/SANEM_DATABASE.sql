CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('Administrador', 'Operador') NOT NULL,
    ativo TINYINT(1) DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
    tipo_pessoa ENUM('Física', 'Jurídica'),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE beneficiario (
    id_beneficiario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    situacao_social TEXT,
    numero_membros_familia INT DEFAULT 1,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    unidade_medida VARCHAR(20) NOT NULL,
    ativa TINYINT(1) DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE item (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    quantidade_estoque DECIMAL(10,2) DEFAULT 0,
    estoque_minimo DECIMAL(10,2) DEFAULT 0,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    CHECK (quantidade_estoque >= 0)
) ENGINE=InnoDB;

CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    id_usuario INT NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    valor_estimado DECIMAL(10,2),
    FOREIGN KEY (id_doador) REFERENCES doador(id_doador),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE item_doacao (
    id_item_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doacao INT NOT NULL,
    id_item INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    lote VARCHAR(50),
    validade DATE,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_doacao) REFERENCES doacao(id_doacao) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item(id_item),
    CHECK (quantidade > 0)
) ENGINE=InnoDB;

CREATE TABLE distribuicao (
    id_distribuicao INT AUTO_INCREMENT PRIMARY KEY,
    id_beneficiario INT NOT NULL,
    id_usuario INT NOT NULL,
    data_distribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    status ENUM('Pendente', 'Concluída', 'Cancelada') DEFAULT 'Concluída',
    FOREIGN KEY (id_beneficiario) REFERENCES beneficiario(id_beneficiario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE item_distribuicao (
    id_item_distribuicao INT AUTO_INCREMENT PRIMARY KEY,
    id_distribuicao INT NOT NULL,
    id_item INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    lote VARCHAR(50),
    FOREIGN KEY (id_distribuicao) REFERENCES distribuicao(id_distribuicao) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item(id_item),
    CHECK (quantidade > 0)
) ENGINE=InnoDB;

CREATE TABLE alerta_estoque (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    id_item INT NOT NULL,
    data_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_alerta VARCHAR(50) DEFAULT 'Estoque Baixo',
    mensagem TEXT,
    visualizado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (id_item) REFERENCES item(id_item)
) ENGINE=InnoDB;

CREATE TABLE relatorio (
    id_relatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_relatorio VARCHAR(100) NOT NULL,
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parametros TEXT,
    arquivo_caminho VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;