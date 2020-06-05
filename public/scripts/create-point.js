// DADOS DE ENTIDADE

function pupulateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")
    // Vai até o site, então retorna o coteúdo em json, então a função anônima states
    // adiciona o id do Estado e seu nome no html
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then((res) => { return res.json() })
        .then(states => {

            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }

        })
}

pupulateUFs()

function getCities(event) {
    // seleciona no doc atual o parâmetro
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")
    // Pega o valor do estado selecionado e faz busca do id do Estado no site
    const ufValue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    // Atualiza dinamicamente qual o value do input do Estado selecionado
    // no "<input type="hidden" name="state">"
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    // Reseta os valores de cidades para possíveis bugs e trava a célula
    citySelect.innerHTML = `<option value="">Selecione a Cidade</option>`
    citySelect.disabled = true;

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }
            // Tira o disabled para poder selecionar a Cidade
            citySelect.disabled = false;
        })
}
// Usa a seleção do html para checar se há alteração (change) na seleção do Estado
// e chama getCities caso haja alteração
document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


// ITENS DE COLETA

// pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


let selectedItems = []
const collectedItems = document.querySelector("input[name=items]")

function handleSelectedItem(event) {
    const itemLi = event.target
    // Adicionar, se não existir (ou remover, se existir), uma classe com JS
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // Verificar se existem itens selecionados, se sim pegar esses itens
    const alreadySelected = selectedItems.findIndex((item) => {
        return item == itemId
    })

    // Se já estiver selecionado, tirar da seleção
    if (alreadySelected >= 0) { // Quando -1: não existe no index
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        // Se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    // Atualizar o hidden com itens selecionados
    collectedItems.value = selectedItems
}