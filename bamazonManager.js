//enable packages
require("dotenv").config(); //hide password
const mysql = require("mysql"); //sql database
const inquirer = require("inquirer"); //prompts

//not required, but add to user experience
const chalk = require("chalk"); //colors
const Table = require("cli-table"); //nicely formatted table

//create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password, //hidden
    database: "bamazon"
});

//connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    //call main function
    manager()

});

//main program 
function manager() {
    inquirer.prompt([
        {
            name: "manage",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products"]

        }
    ]).then(function (input) {
        //cases for main
        switch (input.manage) {
            //option 1
            case "View Products for Sale":
                displayInventory();
                break;
            //option 2
            case "View Low Inventory":
                lowInventory();
                break;
            //option 3
            case "Add to Inventory":
                addInventory();
                break;
            //option 4
            case "Add New Products":
                console.log("Add New Products function");
                addProducts()
                break;
        }
    })
};

//option 1
function displayInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        let table = new Table({
            head: [chalk.green("ID#"), chalk.green("Product Name"), chalk.green("Department"), chalk.green("Price"), chalk.green("Available Qty")],
            colWidths: [5, 50, 15, 10, 20]
        });
        for (let i = 0; i < res.length; i++) {
            let tableID = res[i].id;
            let tableProd = res[i].product_name;
            let tableDept = res[i].department_name;
            let tablePrice = res[i].price;
            let tableQty = res[i].stock_quantity
            table.push(
                [tableID, tableProd, tableDept, tablePrice, tableQty]
            );
        }
        console.log(table.toString());
        manager();
    });
};

//option 2
function lowInventory() {
    connection.query("SELECT * FROM products WHERE products.stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: [chalk.blue("ID#"), chalk.blue("Product Name"), chalk.blue("Department"), chalk.blue("Price"), chalk.blue("Available Qty")],
            colWidths: [5, 50, 15, 10, 20]
        });
        for (var i = 0; i < res.length; i++) {
            var tableID = res[i].id;
            var tableProd = res[i].product_name;
            var tableDept = res[i].department_name;
            var tablePrice = res[i].price;
            var tableQty = res[i].stock_quantity
            table.push(
                [tableID, tableProd, tableDept, tablePrice, tableQty]
            );
        }
        console.log(table.toString());
        manager();
    });
};
    
//option 3
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to restock?"
                },
                {
                    name: "qtyAdd",
                    type: "input",
                    message: "Enter qty to be restocked:",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log(chalk.yellow("\nPlease enter in a number."));
                        return false;
                    }
                }
            ]).then(function (input) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === input.product) {
                        chosenItem = res[i];
                    }
                }

                var availQty = chosenItem.stock_quantity;
                var restockQty = parseInt(input.qtyAdd);
                //add quantity to stock_quantity in products database
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: availQty + restockQty,
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log(chalk.green("\nProducts restocked.\n"));
                        manager();
                    }

                )
            })
    })
};

//option 4
function addProduct() {
    inquirer
     .prompt([
       {
         name: "prodname",
         type: "input",
         message: "What is the name of the product?"
       },
       {
         name: "proddepartment",
         type: "input",
         message: "Which department does this product go under?"
       },
       {
         name: "prodprice",
         type: "input",
         message: "What is the price of the product?",
         validate: function (value) {
             if (isNaN(value) === false) {
                 return true;
             }
             console.log(chalk.yellow("\nPlease enter in a number."));
             return false;
         }
       },
       {
         name: "prodqty",
         type: "input",
         message: "How many units do you want to add?",
         validate: function (value) {
             if (isNaN(value) === false) {
                 return true;
             }
             console.log(chalk.yellow("\nPlease enter in a number."));
             return false;
         }
       }
     ]).then(function(input) {
     //insert new product into datable/table
     connection.query(
       "INSERT INTO products SET ?",
       {
         product_name: input.prodname,
         department_name: input.proddepartment,
         price: input.prodprice,
         stock_quantity: input.prodqty
       },
       function(err) {
           if (err) throw err;
           console.log(chalk.green("\nAdded!"));
           displayInventory();
       }
     )
     })
 };s