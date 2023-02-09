interface MainProduct {
    id: string,
    specify_values: { 
        values: {
            [key: string]: number | string;
        }[],
        installments:  number[],
        products: string[],
    },
    target_name: string,
    input_values:{ name: string, value: number | string | null}[],
    default_validations: string[],
    products_applied: string[],
    output:{
        [key: string]: number | string;
    }
}

type Products = "seguro" | "estado" | "sflevel" | "cupom" | "ampera" | "state_validation" | "cpf" | "risk" | "parcelas"

interface Operations {
    id: string,
    type: Products
    is_optional: boolean,
    main_product_type: MainProduct["target_name"]
    target_calc:{
        operator: "-" | "+" | "*" | "/"
        target_element: string[];
    },
    value:{
        origin: "input"
        operation: string | null,
        options: {[key: string]: number},
        value: string
    }
}


export const operations: Operations[] = [
    {
        id: "0",
        is_optional: false,
        type: "parcelas",
        main_product_type: "financiamento",
        target_calc:{
            operator: "+",
            target_element: ["taxa_cadastro"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                12: 0.12,
                24: 0.02,
                36: 0.03,
                48: 0.04,
                60: 0.05,
                72: 0.06,
                "": 0,
            },
            value: "parcelas"
        }
    },
    {
        id: "1",
        is_optional: false,
        type: "estado",
        main_product_type: "financiamento",
        target_calc:{
            operator: "*",
            target_element: ["taxa_cadastro"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "BA": 0.5,
                "SC": 2,
                "AM": 1,
                "SP": 2,
                "": 0,
            },
            value: "estado"
        }
    },
    {
        id: "2",
        is_optional: false,
        type: "cpf",
        main_product_type: "financiamento",
        target_calc:{
            operator: "*",
            target_element: ["taxa_juros"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "07409571551": 1.01,
                "10239123991": 1.2,
                "1023912399": 1.2,
                "": 0
            },
            value: "cpf"
        }
    },
    {
        id: "3",
        is_optional: false,
        type: "sflevel",
        main_product_type: "financiamento",
        target_calc:{
            operator: "+",
            target_element: ["taxa_cadastro", "taxa_juros"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "SF5": 1,
                "SF4": 2,
                "SF3": 1,
                "SF2": 2,
                "": 0,
            },
            value: "solfacilplus"
        }
    },
    {
        id: "4",
        is_optional: false,
        type: "risk",
        main_product_type: "financiamento",
        target_calc:{
            operator: "+",
            target_element: ["taxa_juros"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "BOM": 0.5,
                "REGULAR": 1,
                "RUIM": 2,
                "": 0,
            },
            value: "risk"
        }
    },
    {
        id: "5",
        type: "seguro",
        is_optional: true,
        main_product_type: "financiamento",
        target_calc:{
            operator: "*",
            target_element: ["valor_do_projeto_entrada"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "true": 1.2,
                "false": 1,
                "": 1,
            },
            value: "seguro"
        }
    },
    {
        id: "6",
        type: "ampera",
        is_optional: true,
        main_product_type: "financiamento",
        target_calc:{
            operator: "+",
            target_element: ["valor_do_projeto_entrada"],
        },
        value:{
            origin: "input",
            operation: null,
            options: {
                "true": 1200,
                "false": 0,
                "": 0,
            },
            value: "ampera"
        }
    }
]

export const spec = {
    installments: [12, 24, 36],
    products: ["5", "6"],
    values: [
        {name: "valor_max", value: 10000},
        {name: "valor_min", value: 5000},
        {name: "cet", value: "POS_FIXADO"},
        {name: "taxa_juros", value: 11},
        {name: "taxa_cadastro", value: 10}
    ]
}

export const financiamento: MainProduct = {
    id: "0101",
    target_name: "financiamento",
    specify_values: spec,
    input_values:[
        {name: "carencia", value: null},
        {name: "valor_do_projeto", value: null},
        {name: "comissao", value: null},
        {name: "valor_do_projeto_entrada", value: null},
        {name: "entrada", value: null},
        {name: "parcelas", value: 12}
    ],
    output:{
        taxa_cadastro: "taxa_cadastro",
        valor_min: "valor_min",
        valor_max: "valor_max",
        valor_do_projeto_entrada: "valor_do_projeto_entrada",
        taxa_juros: "taxa_juros",
        parcelas: "parcelas",
        cet: "cet",
        carencia: "carencia",
        comissao: "comissao",
    },
    default_validations:["0", "1", "2", "3", "4"],
    products_applied:[],
}

export const financiamentoPos: MainProduct = {
    id: "0101",
    target_name: "financiamento",
    specify_values: spec,
    input_values:[
        {name: "carencia", value: null},
        {name: "valor_do_projeto", value: null},
        {name: "comissao", value: null},
        {name: "valor_do_projeto_entrada", value: null},
        {name: "entrada", value: null},
        {name: "parcelas", value: 12}
    ],
    output:{
        taxa_cadastro: "taxa_cadastro",
        valor_do_projeto_entrada: "valor_do_projeto_entrada",
        taxa_juros: "taxa_juros",
        parcelas: "parcelas",
        cet: "cet",
        carencia: "carencia",
        comissao: "comissao",
    },
    default_validations:["0", "1", "2", "3", "4"],
    products_applied:[],
}