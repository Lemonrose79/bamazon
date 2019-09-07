DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon; 

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price DECIMAL (10, 2) NOT NULL,
  stock_quantity INT (10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Herschel Messenger Bag", 
"Accessories", 
79.99,
 30), 
 ("Purina Beyond 12 pk Chicken and Kale", 
 "Pets", 
 9.89, 
 200),  
 ("Vega All in One Vegan Protein Shake",
  "Pantry", 
  44.99, 
  40),  
  ("Tall Kitchen Trash Bags 50 pk", 
  "Pantry", 
  12.99, 
  18),  
  ("What Should Be Wild"by Julia Fine, 
  "Books", 
  24.99, 
  75),  
  ("Nice Try" by Josh Gondelman, 
  "Books",
   23.99, 
   15),
     ("Excuse Me" by Liana Finck, 
     "Books", 
     22.99,
      20),  
      ("High School" by Tegan and Sara Quin,
       "Books", 
       27.99, 
       50),  
       ("Eye Makeup Remover", 
       "Cosmetics", 
       6.99, 
       100),  
       ("Little Weirds" by Jenny Slate, 
       "Books", 
       25.99, 
       100);

SELECT * FROM products