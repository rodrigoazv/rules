interface MainProduct {
    target_name: string,
    target_values:{type: "input" | "value", name: string, value: number | string | null}[],
    products_applied: Operations[],
    output:{
        [key: string]: number;
    }
}

type Products = "seguro" | "location" | "sflevel" | "cupom" | "ampera" | "state_validation"

interface Operations {
    type: Products
    main_product_type: MainProduct["target_name"]
    target_calc:{
        operator: "-" | "+" | "*" | "/"
        target_element: string;
    },
    value:{
        origin: "api" | "db" | "input"
        operation: string | null,
        options: Elements["optionals"]
        value: number 
    }
}

interface Elements {
    type: Products
    optionals: {
        [key: string]: number;
    }
}

function pricing(){

    const element: Elements = {
        type: "sflevel",
        optionals: {
            "SF5": 1,
            "SF4": 2,
            "SF3": 1,
            "SF2": 2,
            "": 0,
        }
    }

    

    const sflevel: Operations = {
        type: "sflevel",
        main_product_type: "financiamento",
        target_calc:{
            operator: "+",
            target_element: "taxa_cadastro",
        },
        value:{
            origin: "api",
            operation: null,
            options: element.optionals,
            value: 0
        }
    }

    const financiamento: MainProduct = {
        target_name: "financiamento",
        target_values:[
            {type: "input", name: "carencia", value: null},
            {type: "input", name: "valor_do_projeto", value: null},
            {type: "input", name: "comissao", value: null},
            {type: "input", name: "entrada", value: null},
            {type: "value", name: "taxa_cadastro", value: 2},
            {type: "value", name: "taxa_juros", value: 2},
            {type: "value", name: "parcelas", value: 12},
            {type: "value", name: "titulo", value: "PRE_FIXADO"},
        ],
        output:{
            taxa_cadastro: 0,
            valor_do_projeto: 0,
            taxa_juros: 0,
        },
        products_applied:[sflevel],
    }


    let memory = new Map()

    function searchAndMemoized(name, data){
        if(!data[name]){
            return console.log("Valor nao encontrado", name)
        }
        memory.set(name, data[name])
    }

    function process(main = financiamento, data){
        main.target_values.map((value) => {
            if(value.type === "input"){
                searchAndMemoized(value.name, data)
            }
            if(value.type === "value"){
                memory.set(value.name, value.value)
            }
        })

        main.products_applied.map((value) => {
            if(value.target_calc.operator === "+"){
                let response = "";
                if(value.value.origin === "api"){
                    response = ""
                }
                memory.set(value.target_calc.target_element , (memory.get(value.target_calc.target_element) + element.optionals[response]))
            }
        })




    }
    const data = { carencia: 10, valor_do_projeto: 1000, entrada: 10, comissao: 1 }
    process(financiamento, data)
    console.log(memory)

}

pricing()