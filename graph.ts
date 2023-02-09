
import { financiamento, operations } from './data'
function pricing(){
    
    let memory = new Map()

    function searchAndMemoized(name, data){
        if(!data[name]){
            return console.log("Valor nao encontrado", name)
        }
        memory.set(name, data[name])
    }

    function processElementValue(value, data){
       
        if(value.value.origin === "input"){
            return data[value.value.value]
        }
    }

    function processMathOperations(value, response){
        if(value.target_calc.operator === "+"){
            value.target_calc.target_element.map((target) => {
                memory.set(target , (memory.get(target) + value.value.options[response]))
            }) 
        }
        if(value.target_calc.operator === "-"){
            value.target_calc.target_element.map((target) => {
                memory.set(target , (memory.get(target) - value.value.options[response]))
            }) 
        }
        if(value.target_calc.operator === "*"){
            value.target_calc.target_element.map((target) => {
                if(memory.get(target) === 0) throw new Error(`O valor de ${target} nao pode ser 0`)
                memory.set(target , (memory.get(target) * value.value.options[response]))
            }) 
        }
        if(value.target_calc.operator === "/"){
            value.target_calc.target_element.map((target) => {
                if(memory.get(target) === 0) throw new Error(`O valor de ${target} nao pode ser 0`)
                memory.set(target , (memory.get(target) / value.value.options[response]))
            }) 
        }
    }

    function process(main, data, products){
        main.input_values.map((value) => {
            searchAndMemoized(value.name, data)
        })

        main.specify_values.values.map((value) => {
            memory.set(value.name, value.value)
        })

        const default_validations = operations.filter((operation) => {
            return main.default_validations.includes(operation.id)
        })

        const products_applied = operations.filter((operation) => {
            return products.includes(operation.id)
        })

        const sorted = default_validations.sort((a, b) =>{
            if (a.target_calc.operator == "*" ||  a.target_calc.operator == "/" ) {
                return -1;
              }
              return 0;
        })
        
        products_applied.map((value) => {
            const response = processElementValue(value, data)
            return processMathOperations(value, response)
        })

        sorted.map((value) => {
            const response = processElementValue(value, data)
            return processMathOperations(value, response)
        })

        const output = new Map();
        for(const index in main.output){
            output.set(index, memory.get(index))
        }

        return output

    }
    const data = { carencia: 10, valor_do_projeto: 1000, entrada: 10, comissao: 1, solfacilplus: "SF4", estado: "BA", risk: "BOM", cpf:"07409571551" ,valor_do_projeto_entrada: 990, parcelas: 12, seguro: "true", ampera: "true" }

    function processEachProducts(){
        const response = process(financiamento, data, financiamento.specify_values.products)
        console.log(financiamento.specify_values.products, response)

        const response_empty = process(financiamento, data, [])
        console.log(financiamento.specify_values.products, response)

        financiamento.specify_values.products.map((product) => {
            const response = process(financiamento, data, [product])
            console.log(product, response)
        })
    }
    processEachProducts()
   
}

pricing()