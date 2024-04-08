const allMenuBtn = document.querySelector('.menu');
let mainText = document.querySelector('.main__text');
let description = document.querySelector('.description');
const url = 'https://api.nasa.gov/';
const apiKey = '8MwhBFzZBekhCEakGeorXN0pRZH2K57zgoMGcL5C';
let typeOfBtn = 0, numLastHandler = 0;
let allElementsForDelete = {};


function checkAgainClick(numberThisTab) {
    switch (typeOfBtn) {
        case numberThisTab: return false;
        default: return true;
    }
}

function checkServerResponse(response) {
    if (response.status > 400 && response.status < 500) {
        alert('Ошибка ответа сервера. Error' + response.status);
    }
    else if (response.status === 200) return true;
}

function drawingDescriptionBlock(amountElementNearEarthObjects) {
    for (let i = 1; i <= amountElementNearEarthObjects; i++) {
        description.innerHTML += '<div class="description__blockMini" id ="' + i + '"></div>';
    }
    const description__blockMini = document.querySelectorAll('.description__blockMini');
    switch (amountElementNearEarthObjects) {
        case 1:
            description__blockMini.forEach(element => {
                element.classList.add('soloMiniBlocks');
            });
            break;
        case 2:
            description__blockMini.forEach(element => {
                element.classList.add('pairedMiniBlocks');
            });
            break;
    }
}

function deleteLastHandler(dateApod, checkboxInputNeows, dateNeows) {
    //Потом, когда буду дорабатывать все остальные табы более точно опишу параметры в цункциях, потому что они вероятно будут другие, пока что так накидал просто
    switch (numLastHandler) {
        case 1:
            allElementsForDelete['date'].removeEventListener('change', () => {
                apiApod(date);
                numLastHandler = 1;
            });
            break;
        case 2:
            allElementsForDelete['checkboxInput'].removeEventListener('change', () => {
                checkboxValue = checkboxInput.checked;
                checkboxInputChange(checkboxValue, textMinMaxInformation);
            });
            allElementsForDelete['dateOneOrSegment'].removeEventListener('change', () => {
                if (dateHandlerAndCheckingOneDateOrSegment(date, checkboxValue, textMinMaxInformation)) apiNeows(dateStart, dateEnd);
            });
            break;
        case 3:
            allElementsForDelete['selectOfType'].removeEventListener('change', () => {
                changeSelect(selectOfType.value);
            });
            break;
        case 5:
            allElementsForDelete['selectOfType'].removeEventListener('change', () => {
                changeSelect(selectOfType.value);
            });
            break;
    }
}

function removeAllElement(elements) {
    elements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

let dateStart = '', dateEnd = '', checkboxValue;
let checkNumberClick = 0;

function dateHandlerAndCheckingOneDateOrSegment(date, checkboxValue, textMinMaxInformation) {
    if (!checkboxValue) {
        checkNumberClick++;
        switch (checkNumberClick) {
            case 1:
                dateStart = date.value;
                textMinMaxInformation.innerHTML = '(от<br>' + dateStart + '<br>до ...)';
                return false;
            case 2:
                dateEnd = date.value;
                textMinMaxInformation.innerHTML = '(от<br>' + dateStart + '<br>до<br>' + dateEnd + ')';
                checkNumberClick = 0;
                return true;

        }
    }
    else {
        dateStart = date.value;
        dateEnd = date.value;
        textMinMaxInformation.innerHTML = 'Значение : <br>' + dateStart;
        return true;
    }
}

function checkboxInputChange(checkboxValue, textMinMaxInformation) {
    if (!checkboxValue) {
        textMinMaxInformation.innerHTML = `(от<br>${dateStart}<br>до<br>${dateEnd})`;
    }
    else {
        textMinMaxInformation.innerHTML = `Дата:<br>${dateStart}`;
    }
}

function changeSelect(selectValue) {
    switch (typeOfBtn) {
        case 3:
            apiEonet(selectValue);
        case 5:
            apiInSight(selectValue);
    }
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
function apiNeows(dateStart, dateEnd) {
    let amountElementNearEarthObjects = 0;
    let description__blockMini = document.querySelectorAll('.description__blockMini');
    removeAllElement(description__blockMini);
    fetch(url + 'neo/rest/v1/feed?start_date=' + dateStart + '&end_date=' + dateEnd + '&api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                Object.keys(response.near_earth_objects).forEach((dateKey) => { amountElementNearEarthObjects++ });
                drawingDescriptionBlock(amountElementNearEarthObjects);
                let n = 1;
                Object.keys(response.near_earth_objects).forEach((dateKey) => {
                    const descriptionMiniBlock = document.getElementById(n);
                    let objectNumber = 1;
                    response.near_earth_objects[dateKey].forEach(object => {
                        descriptionMiniBlock.textContent += 'Название объекта номер ' + objectNumber + ', пролетавшего рядом с землей ' + dateKey + ' числа: ' + object.name + '. его ID:' + object.id + '. ';
                        if (object.is_potentially_hazardous_asteroid) {
                            descriptionMiniBlock.textContent += 'Обьект является потенциально опасным. ';
                        }
                        else {
                            descriptionMiniBlock.textContent += 'Обьект является потенциально безопасным. ';
                        }
                        descriptionMiniBlock.textContent += 'Предположительный диаметр обьекта от: ' + object.estimated_diameter.kilometers.estimated_diameter_min + 'км до ' + object.estimated_diameter.kilometers.estimated_diameter_max + 'км. Нео-справочны ID : ' + object.neo_reference_id
                            + '. Точная дата самого близкого приближения обьекта: ' + object.close_approach_data[0].close_approach_date_full + '. || ';
                        objectNumber++;
                    });
                    n++;
                });
            })
        }
    });
}

function apiEonet(selectValue) {
    let requestId;
    let amountElementNearEarthObjects = 0;
    let description__blockMini = document.querySelectorAll('.description__blockMini');
    removeAllElement(description__blockMini);
    switch (selectValue) {
        case 'Лесные пожары':
            requestId = '8';
            break;
        case 'Вулканы':
            requestId = '12';
            break;
        case 'Обильный лед на марях и озерах':
            requestId = '15';
            break;
    }
    fetch('https://eonet.gsfc.nasa.gov/api/v2.1/categories/' + requestId).then((response) => {
        if (checkServerResponse(response)) {
            let amount = 0;
            response.json().then((response) => {
                Object.keys(response.events).forEach((disaster) => { amount++ });
                drawingDescriptionBlock(amount);
                let n = 1;
                response.events.forEach((disaster) => {
                    const descriptionMiniBlock = document.getElementById(n);
                    descriptionMiniBlock.innerHTML = 'Событие номер ' + n + '<br>ID происшествия: ' + disaster.id + '.<br>Проиpошло событие в : ' + disaster.title + '.<br>По координатам : ' + disaster.geometries[0].coordinates + '.<br>Дата проишествия : ' + disaster.geometries[0].date;
                    n++;
                });
            })
        }
    });
}

function apiTechTransfer() {
    description.innerHTML = '';
    fetch(url + 'techtransfer/patent/?engine&api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                let amount = 0;
                Object.keys(response.results).forEach((photos) => { amount++ });
                let n = 1;
                for (let i = 1; i <= amount; i++) {
                    description.innerHTML += '<div class="description__BlockImg"><img class="description__img" id ="' + i + 'img" alt="Фото"></div>';
                    description.innerHTML += '<div class="description__block" id ="' + i + '"></div>';
                }
                response.results.forEach((information) => {
                    let descriptionImg = document.getElementById(n + 'img');
                    let descriptionBlock = document.getElementById(n);
                    descriptionImg.setAttribute('src', information[10]);
                    descriptionBlock.textContent = information[3];
                    n++;
                });

            });
        }
    });
}

function apiInSight(selectValue) {
    let description__blockMini = document.querySelectorAll('.description__blockMini');
    removeAllElement(description__blockMini);
    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + selectValue + '/latest_photos/?api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                let amount = 0;
                Object.keys(response.latest_photos).forEach((photos) => { amount++ });
                let n = 1;
                for (let i = 1; i <= amount; i++) {
                    description.innerHTML += '<div class="description__BlockImg"><img class="description__img" id ="' + i + 'img" alt="Фото"></div>';
                    description.innerHTML += '<div class="description__block" id ="' + i + '"></div>';
                }
                response.latest_photos.forEach((photos) => {
                    let descriptionImg = document.getElementById(n + 'img');
                    let descriptionBlock = document.getElementById(n);
                    descriptionBlock.innerHTML = `Фотография номер :${n}<br>Полное имя камеры, с которой получено фото :${photos.camera.full_name}<br>ID комеры :${photos.camera.id}<br>ID марсахода:${photos.camera.rover_id}
                    <br>Дата, когда было сделано фото:${photos.earth_date}<br>ID фотографии:${photos.id}<br>Дата запуска марсахода:${photos.rover.launch_date}<br>Дата приземления марсахода на Марс:${photos.rover.launchlanding_date_date}
                    <br>Дата, когда марсаход в последний раз отправлял информацию :${photos.rover.max_date}<br>Статус:${photos.rover.status}`;
                    descriptionImg.setAttribute('src', photos.img_src);
                    n++;
                });

            });
        }
    });
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
                allElementsForDelete['date'] = date;
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
            if (checkAgainClick(2)) {
                dateStart = '2024-04-02';
                dateEnd = '2024-04-04';
                mainText.innerHTML = `<div class="Lines">
                <div class="descriptionFirstdLine">Получить информацию о близких обьектах к земле в указанную даты:
                <input type="date" class="input__date" onkeydown="return false" value="${dateEnd}">
                </div>
                <div class="descriptionSecondLine">
                <p class="textMinMaxInformation">(от<br>${dateStart}<br>до<br>${dateEnd})</p>
                <p class = "textForCheckbox">Указать одну дату:</p>
                <input type="checkbox" class="checkboxInput">
                </div>
                </div>
                `;
                description.innerHTML = '';
                deleteLastHandler();
                const textMinMaxInformation = document.querySelector('.textMinMaxInformation');
                const checkboxInput = document.querySelector('.checkboxInput');
                const date = document.querySelector('.input__date');
                allElementsForDelete['checkboxInput'] = checkboxInput;
                allElementsForDelete['dateOneOrSegment'] = date;
                checkboxInput.addEventListener('change', () => {
                    checkboxValue = checkboxInput.checked;
                    checkboxInputChange(checkboxValue, textMinMaxInformation);
                });
                date.addEventListener('change', () => {
                    if (dateHandlerAndCheckingOneDateOrSegment(date, checkboxValue, textMinMaxInformation)) apiNeows(dateStart, dateEnd);
                });
                apiNeows(dateStart, dateEnd);
                numLastHandler = 2;
                typeOfBtn = 2;
            }
            break;
        case 'EONET_btn':
            if (checkAgainClick(3)) {
                mainText.innerHTML = ` Получить информацию о природных бедствия по миру, выберите тип:
                <select class="selectOfType">
                      <option>Лесные пожары</option>
                      <option>Вулканы</option>
                      <option>Обильный лед на марях и озерах</option>
                </select>
                `;
                description.innerHTML = '';
                deleteLastHandler();
                const selectOfType = document.querySelector('.selectOfType');
                allElementsForDelete['selectOfType'] = selectOfType;
                selectOfType.addEventListener('change', () => {
                    changeSelect(selectOfType.value);
                });
                apiEonet(selectOfType.value);
                numLastHandler = 3;
                typeOfBtn = 3;
            }
            break;
        case 'TechTransfer':
            if (checkAgainClick(4)) {
                mainText.innerHTML = `Технологиии разработанные NASA, для коммерческого использования:`;
                description.innerHTML = '';
                deleteLastHandler();
                apiTechTransfer();
                numLastHandler = 4;
                typeOfBtn = 4;
            }

            break;
        case 'InSight_btn':
            if (checkAgainClick(5)) {
                mainText.innerHTML = ` Получить снимки с марсахода. Выберите марсаход:
                <select class="selectOfType">
                      <option>curiosity</option>
                      <option>opportunity</option>
                      <option>spirit</option>
                      <option>perseverance</option>
                </select>
                `;
                description.innerHTML = '';
                deleteLastHandler();
                const selectOfType = document.querySelector('.selectOfType');
                allElementsForDelete['selectOfType'] = selectOfType;
                selectOfType.addEventListener('change', () => {
                    changeSelect(selectOfType.value);
                });
                apiInSight(selectOfType.value);
                numLastHandler = 5;
                typeOfBtn = 5;
            }
            break;
    }
});
