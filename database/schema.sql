CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20)
);

CREATE TABLE funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE ingredientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade_atual DECIMAL(10, 3) NOT NULL, 
    unidade VARCHAR(20) NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES clientes(id),
    id_garcom INT REFERENCES funcionarios(id),
    mesa VARCHAR(10),
    horario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Aguardando'
);

CREATE TABLE itens_pedido (
    id_pedido INT REFERENCES pedidos(id),
    id_produto INT REFERENCES produtos(id),
    quantidade INT NOT NULL,
    observacao VARCHAR(255)
);

CREATE TABLE ficha_tecnica (
    id_produto INT REFERENCES produtos(id),
    id_ingrediente INT REFERENCES ingredientes(id),
    quantidade_gasta DECIMAL(10, 3) NOT NULL
);

INSERT INTO funcionarios (nome, cargo) VALUES ('Carlos', 'Garçom');
INSERT INTO produtos (nome, preco, ativo) VALUES ('Hambúrguer Clássico', 25.50, true);
INSERT INTO clientes (nome, telefone) VALUES ('Gabriel', 51992934189);
SELECT * FROM produtos;
