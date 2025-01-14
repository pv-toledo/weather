
const voltaRedonda = {
    lat: -22.52,
    long: -44.10,
};

const appid = '0ff848d65311793692cb5ea45c4e8ab7'; //chave da API
const unit = 'Metric' //configuração para vir em ºC
const lang = 'pt_br'

let container = document.querySelector('#linhaPrincipal');
const att = document.querySelector('button')


const getData = async () => { //função para obter os dados climáticos da localização
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${voltaRedonda.lat}&lon=${voltaRedonda.long}&appid=${appid}&lang=${lang}&units=${unit}`)
        return (res.data.list);
    }
    catch (e) {
        console.log("Erro: ", e);
    }
}

const criarElementos = (data, tempMax, tempMin) => {

    const primeiraColuna = document.createElement("DIV")
    primeiraColuna.classList.add("col")

    const cardPrincipal = document.createElement("DIV")
    cardPrincipal.classList.add("card", "text-center", "p-0")

    const cardHeader = document.createElement("DIV")
    cardHeader.classList.add("card-header")

    const h5 = document.createElement("H5")
    h5.append(data);

    const cardBody = document.createElement("DIV")
    cardBody.classList.add("card-body");

    const h2TempMax = document.createElement("H2")
    h2TempMax.classList.add("card-title")
    h2TempMax.append(`${tempMax} ºC`);

    const h2TempMin = document.createElement("H2")
    h2TempMin.classList.add("card-title")
    h2TempMin.append(`${tempMin} ºC`);

    primeiraColuna.appendChild(cardPrincipal);
    cardPrincipal.appendChild(cardHeader);
    cardHeader.appendChild(h5);
    cardPrincipal.appendChild(cardBody);
    cardBody.appendChild(h2TempMax);
    cardBody.appendChild(h2TempMin);

    container.appendChild(cardPrincipal)
    
}

const getTemperature = async () => { //função para obter a temperatura máxima dos dias da semana da localização

    const temp = await getData();
    const tempByDate = [];

    for (let item of temp) {
        const data = item.dt_txt.split(" ")[0];
        const tempMax = Math.round(item.main.temp_max);
        const tempMin = Math.round(item.main.temp_min);

        const dataExistente = tempByDate.find(d => d.data === data);

        if (dataExistente) {
            if (dataExistente.tempMax < tempMax) {
                dataExistente.tempMax = tempMax;
            }
            if (dataExistente.tempMin > tempMin) {
                dataExistente.tempMin = tempMin;
            }
        } else {
            tempByDate.push({
                data:data,
                tempMax:tempMax,
                tempMin:tempMin
            });
        }

    }


    for (let i in tempByDate) {

    
        const [ano, mes, dia] = tempByDate[i].data.split("-");
        const dataFormatada = `${dia}/${mes}`;

        criarElementos(dataFormatada, tempByDate[i].tempMax, tempByDate[i].tempMin);

    }

}


att.addEventListener('click', () => {

    while (container.firstChild) {

        container.removeChild(container.firstChild);
    }

    getTemperature();

})
