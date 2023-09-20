const chalk = require('chalk');

function printRojo(mensaje) {
    console.log(chalk.red(mensaje));
}

function printVerde(mensaje) {
    console.log(chalk.green(mensaje));
}

function printAmarillo(mensaje) {
    console.log(chalk.yellow(mensaje));
}

function printAzul(mensaje) {
    console.log(chalk.blue(mensaje));
}

function printMagenta(mensaje) {
    console.log(chalk.magenta(mensaje));
}

function printCyan(mensaje) {
    console.log(chalk.cyan(mensaje));
}

module.exports = {
    printRojo,
    printVerde,
    printAmarillo,
    printAzul,
    printMagenta,
    printCyan
};
