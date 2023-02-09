"use strict";
exports.__esModule = true;
var data_1 = require("./data");
function pricing() {
    var memory = new Map();
    function searchAndMemoized(name, data) {
        if (!data[name]) {
            return console.log("Valor nao encontrado", name);
        }
        memory.set(name, data[name]);
    }
    function processElementValue(value, data) {
        if (value.value.origin === "input") {
            return data[value.value.value];
        }
    }
    function processMathOperations(value, response) {
        if (value.target_calc.operator === "+") {
            value.target_calc.target_element.map(function (target) {
                memory.set(target, (memory.get(target) + value.value.options[response]));
            });
        }
        if (value.target_calc.operator === "-") {
            value.target_calc.target_element.map(function (target) {
                memory.set(target, (memory.get(target) - value.value.options[response]));
            });
        }
        if (value.target_calc.operator === "*") {
            value.target_calc.target_element.map(function (target) {
                if (memory.get(target) === 0)
                    throw new Error("O valor de ".concat(target, " nao pode ser 0"));
                memory.set(target, (memory.get(target) * value.value.options[response]));
            });
        }
        if (value.target_calc.operator === "/") {
            value.target_calc.target_element.map(function (target) {
                if (memory.get(target) === 0)
                    throw new Error("O valor de ".concat(target, " nao pode ser 0"));
                memory.set(target, (memory.get(target) / value.value.options[response]));
            });
        }
    }
    function process(main, data, products) {
        main.input_values.map(function (value) {
            searchAndMemoized(value.name, data);
        });
        main.specify_values.values.map(function (value) {
            memory.set(value.name, value.value);
        });
        var default_validations = data_1.operations.filter(function (operation) {
            return main.default_validations.includes(operation.id);
        });
        var products_applied = data_1.operations.filter(function (operation) {
            return products.includes(operation.id);
        });
        var sorted = default_validations.sort(function (a, b) {
            if (a.target_calc.operator == "*" || a.target_calc.operator == "/") {
                return -1;
            }
            return 0;
        });
        products_applied.map(function (value) {
            var response = processElementValue(value, data);
            return processMathOperations(value, response);
        });
        sorted.map(function (value) {
            var response = processElementValue(value, data);
            return processMathOperations(value, response);
        });
        var output = new Map();
        for (var index in main.output) {
            output.set(index, memory.get(index));
        }
        return output;
    }
    var data = { carencia: 10, valor_do_projeto: 1000, entrada: 10, comissao: 1, solfacilplus: "SF4", estado: "BA", risk: "BOM", cpf: "07409571551", valor_do_projeto_entrada: 990, parcelas: 12, seguro: "true", ampera: "true" };
    function processEachProducts() {
        var response = process(data_1.financiamento, data, data_1.financiamento.specify_values.products);
        console.log(data_1.financiamento.specify_values.products, response);
        var response_empty = process(data_1.financiamento, data, []);
        console.log(data_1.financiamento.specify_values.products, response);
        data_1.financiamento.specify_values.products.map(function (product) {
            var response = process(data_1.financiamento, data, [product]);
            console.log(product, response);
        });
    }
    processEachProducts();
}
pricing();
