//enable packages
require("dotenv").config(); //hidden password
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
    displayInventory()

});

//display inventory in table
function displayInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        let table = new Table({
            head: [chalk.red("ID#"), chalk.red("Product Name"), chalk.red("Department"), chalk.red("Price"), chalk.red("Available Qty")],
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
        customer();
    });
};

//customer says what product they want
//customer says how many units they want
function customer() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "idBuy",
                    type: "rawlist",
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                        }
                        return choiceArray;
                    },
                    message: "Which product would you like to buy?"
                },
                {
                    name: "qtyBuy",
                    type: "input",
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        //error for non num
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log(chalk.yellow("\nEnter a number."));
                        return false;
                    }
                }
            ]).then(function (input) {
                //get info on selected item for inventory comparison (next)
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name === input.idBuy) {
                        chosenItem = res[i];
                    }
                }

                //define inventory terms for use
                let availQty = chosenItem.stock_quantity;
                let chosenQty = input.qtyBuy;

                //determine if desired qty is greater than avail qty of product
                if (parseInt(chosenQty) > availQty) {
                    //return error message
                    console.log(chalk.red("\nSorry. There's not enough inventory of this product.\n"));
                    //give the user the chance to continue shopping
                    shopAgain();

                } else {
                    //update quantity if the sale can be successfully completed based on inventory
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                              stock_quantity: availQty - parseInt(chosenQty)
                            },
                            {
                              id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            //give success message (and price)
                            console.log(chalk.green("\nSold! Your total is\n" + "$" +(chosenQty * (chosenItem.price  * 100) / 100)));
                             //give the user the chance to continue shopping
                            shopAgain();
                        }
                    )
                }
            });
    });

    //function to shop again or quit the program
    function shopAgain() {
        inquirer.prompt([
            {
                name: "shop",
                type: "list",
                message: "Would you like to buy another products?",
                choices: ["Yes.", "No. Thank you."]
            }
        ]).then(function (input) {
            if (input.shop === "Yes.") {
                displayInventory();
            } else {
                connection.end();
            }
        })
    };
};