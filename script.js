let mainText = document.querySelector('.main__text');
let description = document.querySelector('.description');
const url = 'https://api.nasa.gov/';
const apiKey = '8MwhBFzZBekhCEakGeorXN0pRZH2K57zgoMGcL5C';
let typeOfBtn = 0,numLastHandler=0;



function checkAgainClick(numberThisTab) {
    switch (typeOfBtn) {
        case numberThisTab: return false;
        default: return true;
    }
}

function checkServerResponse(response) {
    if (response.status >= 400 && response.status <= 500) {
        alert('Ошибка ответа сервера. Error' + response.status);
    }
    else if (response.status === 200) return true;
}

function apiApod(date) {
    const descriptionBlockImg = document.querySelector('.description__img')
    const descriptionBlock = document.querySelector('.description__block');
    fetch(url + 'planetary/apod?api_key=' + apiKey + '&date=' + date.value).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                descriptionBlockImg.setAttribute('src', response.url);
                descriptionBlock.textContent = response.explanation;
            })
        }
    });
}

function deleteLastHandler(date) {
    //Потом, когда буду дорабатывать все остальные табы более точно опишу параметры в цункциях, потому что они вероятно будут другие, пока что так накидал просто
    switch (numLastHandler) {
        case 1:
            date.removeEventListener('change', apiApod(date));
            break;
        case 2:
            date.removeEventListener('change', apiNeows(date));
            break;
        case 3:
            date.removeEventListener('change', apiEonet(date));
            break;
        case 4:
            date.removeEventListener('change', apiSatellite(date));
            break;
        case 5:
            date.removeEventListener('change', apInsight(date));
            break;
    }
}

allMenuBtn.addEventListener('click', (event) => {
    const action = event.target.classList[1];
    switch (action) {
        case 'APOD_btn':
            if (checkAgainClick(1)) {
            mainText.innerHTML = 'Получите изображение астрономического обьекта на указанную дату:<input type="date" class="input__date" onkeydown="return false">';
            description.innerHTML = `
            <div class="description__BlockImg"><img class="description__img" alt="Фото"></div>
            <div class="description__block"></div>
            `;
            let date = document.querySelector('.input__date');
            date.valueAsDate = new Date();
            apiApod(date);
            deleteLastHandler();
            date.addEventListener('change', () => {
                apiApod(date);
                numLastHandler = 1;
            });
            typeOfBtn = 1;
        }
            break;
        case 'NeoWs_btn':
            break;
        case 'EONET_btn':
            break;
        case 'Satellite':
            break;
        case 'InSight_btn':
            break;
    }
});


