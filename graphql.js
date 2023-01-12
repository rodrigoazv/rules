function EstrategiaXYZ(entrada, valor_do_projeto){

    const mainRule = {
        type: 'financing',
        output: {
            parcelas: 'parcelas',
            value: 'valor_do_projeto_entrada',
            value_com_seguro: 'valor_do_projeto_com_seguro',
        },
        data: [
        {
            identity: 5,
            depends: [
                "entrada",
                "valor_do_projeto"
            ],
            name: "valor_do_projeto_entrada",
            pricing_formula: "valor_do_projeto - entrada",
        },
        {
            identity: 5,
            depends: [
                "seguro",
                "valor_do_projeto_entrada"
            ],
            name: "valor_do_projeto_com_seguro",
            pricing_formula: "valor_do_projeto_entrada + seguro",
        },
          {
            identity: 2,
            depends: null,
            name: "entrada",
            input: true,
            pricing_formula: null,
          },
          {
            identity: 2,
            depends: null,
            name: "seguro",
            input: false,
            value: 10,
            pricing_formula: null,
          },
          {
            identity: 2,
            depends: null,
            input: true,
            name: "valor_do_projeto",
            pricing_formula: null,
          },
          {
            identity: 2,
            depends: null,
            name: "parcelas",
            input: false,
            output: true,
            value: 12,
            pricing_formula: null,
          },
        ]}

    const payload = {
        entrada: 1000,
        valor_do_projeto: 20000
    }

    let memory = new Map()

    function processing(){
        for(index in mainRule.data){
            if(!mainRule.data[index].depends && !mainRule.data[index].input){
                memory.set(mainRule.data[index].name, mainRule.data[index].value)
            }
            if(!mainRule.data[index].depends && mainRule.data[index].input){
                memory.set(mainRule.data[index].name, payload[mainRule.data[index].name])
            }
        }

        const filteredData = mainRule.data.filter((rule) => rule.depends)

        let rules = new Map()

        function processRule(ruleName, dependencie, pricingFormula){
        
            if(rules.get(ruleName)){
                const value = rules.get(ruleName).replace(dependencie, memory.get(dependencie))
                return rules.set(ruleName, value)
            }

            const value = pricingFormula.replace(dependencie, memory.get(dependencie))
            return rules.set(ruleName, value)
            
        }

        function processDependencie(rule, oldRule){
            rule.depends.map((dependencies, i) => {
                if(memory.has(dependencies) && rule.depends.length == i+1){
                    processRule(rule.name, dependencies, rule.pricing_formula)
                    const ruleToSave = rules.get(rule.name)
                    memory.set(rule.name, eval(ruleToSave))
                }
                if(memory.has(dependencies) && oldRule){
                    const nextToProcess = data.find(rul => oldRule == rul.name)
                    console.log(nextToProcess)
                    return processDependencie(nextToProcess)
                }if(memory.has(dependencies)){
                    return processRule(rule.name, dependencies, rule.pricing_formula)
                }else{
                    const nextRule = data.find(rul => rul.name == dependencies)
                    console.log(nextRule, 'next', rule.name, 'old')
                    return processDependencie(nextRule, rule.name)
                }
            })
        }

        filteredData.map(rule => {
            processDependencie(rule) 
        })

        
    }    

    processing()

    const response = new Map()

    const output = Object.keys(mainRule.output).map((value) => mainRule.output[value])

    output.map(out => response.set(out, memory.get(out)))
    //response.set()
    console.log(response)
    return response


}

EstrategiaXYZ(10, 10)

