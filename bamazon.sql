DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  price INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (item_name, product_name, item_name, quantity)
VALUES ("item", 2.50, 100);

