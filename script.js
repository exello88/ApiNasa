const allMenuBtn = document.querySelector('.menu');
let mainText = document.querySelector('.main__text');
let description = document.querySelector('.description');
let menuText = document.querySelectorAll('.menu__text');
const url = 'https://api.nasa.gov/';
const apiKey = '8MwhBFzZBekhCEakGeorXN0pRZH2K57zgoMGcL5C';
let typeOfBtn = 0, numLastHandler = 0;
let allElementsForDelete = {};
const ApodBtn = document.querySelector('.APOD_btn');
const NeowsBtn = document.querySelector('.NeoWs_btn');
const EonetBtn = document.querySelector('.EONET_btn');
const TechTransferBtn = document.querySelector('.TechTransfer_btn');
const InSightBtn = document.querySelector('.InSight_btn');
let loaderBlock = document.querySelector('.loaderBlock');
let pagination = document.querySelector('.pagination');
let checkActiveTab = 0;
let activeLoader = false;
let allElementsForPagination = {};
let startIndex = 1, endIndex = 3;



function checkAgainClick(numberThisTab) {
    if (activeLoader) return false;
    else switch (typeOfBtn) {
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
    description.innerHTML = '';
    pagination.innerHTML = '';
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

function deleteLastHandler() {
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
            startIndex = 1;
            endIndex = 3;
            apiEonet(selectValue);
            break;
        case 5:
            startIndex = 1;
            endIndex = 1;
            apiInSight(selectValue);
            break;
    }
}

function paginationDispay(indexStart, indexEnd, type) {
    if (type === 2) {
        description.innerHTML = '';
        for (let i = indexStart; i <= indexEnd; i++) {
            description.innerHTML += '<div class="description__BlockImg TechTransfer"><img class="description__img" id ="' + i + 'img" alt="Фото"></div>';
            description.innerHTML += '<div class="description__block TechTransfer" id ="' + i + '"></div>';
            let description__BlockImg = document.getElementById(i + 'img');
            let description__block = document.getElementById(i);
            description__BlockImg.setAttribute('src', allElementsForPagination[i + 'img']);
            description__block.innerHTML = allElementsForPagination[i];
        }
    }
    if (type === 1) {
        description.innerHTML = '';
        for (let i = indexStart; i <= indexEnd; i++) {
            description.innerHTML += '<div class="description__blockMini" id ="' + i + '"></div>';
            let description__blockMini = document.getElementById(i);
            description__blockMini.innerHTML = allElementsForPagination[i];
        }
    }

}

function apiApod(date) {
    showHideLoader(1);
    fetch(url + 'planetary/apod?api_key=' + apiKey + '&date=' + date.value).then((response) => {
        if (checkServerResponse(response)) {

            response.json().then((response) => {
                description.innerHTML = `
            <div class="description__BlockImg"><img class="description__img" alt="Фото"></div>
            <div class="description__block"></div>
            `;
                const descriptionBlockImg = document.querySelector('.description__img')
                const descriptionBlock = document.querySelector('.description__block');
                descriptionBlockImg.setAttribute('src', response.url);
                descriptionBlock.textContent = response.explanation;
            })
        }
    });
    setTimeout(function () {
        showHideLoader(2);
    }, 600);
}
function apiNeows(dateStart, dateEnd) {
    showHideLoader(1);
    description.innerHTML = '';
    pagination.innerHTML = '';
    let amountElementNearEarthObjects = 0;
    fetch(url + 'neo/rest/v1/feed?start_date=' + dateStart + '&end_date=' + dateEnd + '&api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                Object.keys(response.near_earth_objects).forEach((dateKey) => {
                    Object.keys(response.near_earth_objects[dateKey]).forEach((element) => {
                        amountElementNearEarthObjects++;
                    });
                });
                let n = 1;
                Object.keys(response.near_earth_objects).forEach((dateKey) => {
                    let objectNumber = 1;
                    response.near_earth_objects[dateKey].forEach(object => {
                        allElementsForPagination[n] = 'Название объекта номер ' + objectNumber + ', пролетавшего рядом с землей ' + dateKey + ' числа: ' + object.name + '. его ID:' + object.id + '. ';
                        if (object.is_potentially_hazardous_asteroid) {
                            allElementsForPagination[n] += 'Обьект является потенциально опасным. ';
                        }
                        else {
                            allElementsForPagination[n] += 'Обьект является потенциально безопасным. ';
                        }
                        allElementsForPagination[n] += 'Предположительный диаметр обьекта от: ' + object.estimated_diameter.kilometers.estimated_diameter_min + 'км до ' + object.estimated_diameter.kilometers.estimated_diameter_max + 'км. Нео-справочны ID : ' + object.neo_reference_id
                            + '. Точная дата самого близкого приближения обьекта: ' + object.close_approach_data[0].close_approach_date_full + '.';
                        objectNumber++;
                        n++;
                    });
                });
                startIndex = 1;
                endIndex = 3;
                if (amountElementNearEarthObjects > 3) {
                    paginationDispay(startIndex, endIndex, 1);
                    pagination.innerHTML = `
                    <div class="pagination__lastBtn">Назад</div>
                    <div class="pagination__nextBtn">Вперед</div>
                    `;
                    let pagination__lastBtn = document.querySelector('.pagination__lastBtn');
                    let pagination__nextBtn = document.querySelector('.pagination__nextBtn');
                    pagination__nextBtn.addEventListener('click', () => {
                        startIndex += 3;
                        endIndex += 3;
                        if (endIndex > amountElementNearEarthObjects) {
                            startIndex = 1;
                            endIndex = 3;
                        }
                        paginationDispay(startIndex, endIndex, 1);
                    });
                    pagination__lastBtn.addEventListener('click', () => {
                        startIndex -= 3;
                        endIndex -= 3;
                        if (startIndex < 1) {
                            startIndex = amountElementNearEarthObjects - 2;
                            endIndex = amountElementNearEarthObjects;
                        }
                        paginationDispay(startIndex, endIndex, 1);
                    });
                }
                else {
                    drawingDescriptionBlock(amountElementNearEarthObjects);
                    for (let i = indexStart; i <= amountElementNearEarthObjects; i++) {
                        let description__blockMini = document.getElementById(i);
                        description__blockMini.innerHTML = allElementsForPagination[i];
                    }
                }
            })
        }
    });
    setTimeout(function () {
        showHideLoader(2);
    }, 1000);
}

function apiEonet(selectValue) {
    showHideLoader(1);
    let requestId;
    let amountElementNearEarthObjects = 0;
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
                let n = 1;
                response.events.forEach((disaster) => {
                    allElementsForPagination[n] = 'Событие номер ' + n + '<br>ID происшествия: ' + disaster.id + '.<br>Проиpошло событие в : ' + disaster.title + '.<br>По координатам : ' + disaster.geometries[0].coordinates + '.<br>Дата проишествия : ' + disaster.geometries[0].date;
                    n++;
                });
                startIndex = 1;
                endIndex = 3;
                if (amount > 3) {
                    paginationDispay(startIndex, endIndex, 1);
                    pagination.innerHTML = `
                    <div class="pagination__lastBtn">Назад</div>
                    <div class="pagination__nextBtn">Вперед</div>
                    `;
                    let pagination__lastBtn = document.querySelector('.pagination__lastBtn');
                    let pagination__nextBtn = document.querySelector('.pagination__nextBtn');
                    pagination__nextBtn.addEventListener('click', () => {
                        startIndex += 3;
                        endIndex += 3;
                        if (endIndex > amount) {
                            startIndex = 1;
                            endIndex = 3;
                        }
                        paginationDispay(startIndex, endIndex, 1);
                    });
                    pagination__lastBtn.addEventListener('click', () => {
                        startIndex -= 3;
                        endIndex -= 3;
                        if (startIndex < 1) {
                            startIndex = amount - 2;
                            endIndex = amount;
                        }
                        paginationDispay(startIndex, endIndex, 1);
                    });
                }
                else {
                    drawingDescriptionBlock(amount);
                    for (let i = indexStart; i <= amount; i++) {
                        let description__blockMini = document.getElementById(i);
                        description__blockMini.innerHTML = allElementsForPagination[i];
                    }
                }
            })
        }
    });
    setTimeout(function () {
        showHideLoader(2);
    }, 3500);
}

function deleteAllActiveTab() {
    let ArrayOfTab = document.querySelectorAll('.menu__block');
    for (let i = 0; i < ArrayOfTab.length; i++) {
        ArrayOfTab[i].classList.remove('activeTab');
    }
    document.querySelector('.menu__block5').classList.remove('activeTab');
}

function apiTechTransfer() {
    showHideLoader(1);
    fetch(url + 'techtransfer/patent/?engine&api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                let amount = 0;
                Object.keys(response.results).forEach((photos) => { amount++ });
                let n = 1;
                response.results.forEach((information) => {
                    allElementsForPagination[n] = information[3];
                    allElementsForPagination[n + 'img'] = information[10];
                    n++;
                });
                startIndex = 1;
                endIndex = 1;
                if (amount > 3) {
                    paginationDispay(startIndex, endIndex, 2);
                    pagination.innerHTML = `
                    <div class="pagination__lastBtn">Назад</div>
                    <div class="pagination__nextBtn">Вперед</div>
                    `;
                    let pagination__lastBtn = document.querySelector('.pagination__lastBtn');
                    let pagination__nextBtn = document.querySelector('.pagination__nextBtn');
                    pagination__nextBtn.addEventListener('click', () => {
                        startIndex += 1;
                        endIndex += 1;
                        if (endIndex > amount) {
                            startIndex = 1;
                            endIndex = 1;
                        }
                        paginationDispay(startIndex, endIndex, 2);
                    });
                    pagination__lastBtn.addEventListener('click', () => {
                        startIndex -= 1;
                        endIndex -= 1;
                        if (startIndex < 1) {
                            startIndex = amount;
                            endIndex = amount;
                        }
                        paginationDispay(startIndex, endIndex, 2);
                    });
                }
                else {
                    drawingDescriptionBlock(amount);
                    for (let i = indexStart; i <= amount; i++) {
                        let description__blockMini = document.getElementById(i);
                        description__blockMini.innerHTML = allElementsForPagination[i];
                    }
                }
            });
        }
    });
    setTimeout(function () {
        showHideLoader(2);
    }, 3000);
}

function apiInSight(selectValue) {
    showHideLoader(1);
    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + selectValue + '/latest_photos/?api_key=' + apiKey).then((response) => {
        if (checkServerResponse(response)) {
            response.json().then((response) => {
                let amount = 0;
                Object.keys(response.latest_photos).forEach((photos) => { amount++ });
                let n = 1;
                allElementsForPagination.length = 0;
                response.latest_photos.forEach((photos) => {
                    allElementsForPagination[n] = `Фотография номер :${n}<br>Полное имя камеры, с которой получено фото :${photos.camera.full_name}<br>ID комеры :${photos.camera.id}<br>ID марсахода:${photos.camera.rover_id}
                    <br>Дата, когда было сделано фото:${photos.earth_date}<br>ID фотографии:${photos.id}<br>Дата запуска марсахода:${photos.rover.launch_date}<br>Дата приземления марсахода на Марс:${photos.rover.launchlanding_date_date}
                    <br>Дата, когда марсаход в последний раз отправлял информацию :${photos.rover.max_date}<br>Статус:${photos.rover.status}`;
                    allElementsForPagination[n + 'img'] = photos.img_src;
                    n++;
                });
                startIndex = 1;
                endIndex = 1;
                if (amount > 3) {
                    paginationDispay(startIndex, endIndex, 2);
                    pagination.innerHTML = `
                    <div class="pagination__lastBtn">Назад</div>
                    <div class="pagination__nextBtn">Вперед</div>
                    `;
                    let pagination__lastBtn = document.querySelector('.pagination__lastBtn');
                    let pagination__nextBtn = document.querySelector('.pagination__nextBtn');
                    pagination__nextBtn.addEventListener('click', () => {
                        startIndex += 1;
                        endIndex += 1;
                        if (endIndex > amount) {
                            startIndex = 1;
                            endIndex = 1;
                        }
                        paginationDispay(startIndex, endIndex, 2);
                    });
                    pagination__lastBtn.addEventListener('click', () => {
                        startIndex -= 1;
                        endIndex -= 1;
                        if (startIndex < 1) {
                            startIndex = amount;
                            endIndex = amount;
                        }
                        paginationDispay(startIndex, endIndex, 2);
                    });
                }
                else {
                    drawingDescriptionBlock(amount);
                    for (let i = 1; i < amount; i++) {
                        description.innerHTML = '';
                        description.innerHTML += '<div class="description__BlockImg TechTransfer"><img class="description__img" id ="' + i + 'img" alt="Фото"></div>';
                        description.innerHTML += '<div class="description__block TechTransfer" id ="' + i + '"></div>';
                        let description__BlockImg = document.getElementById(i + 'img');
                        let description__block = document.getElementById(i);
                        description__BlockImg.setAttribute('src', allElementsForPagination[i + 'img']);
                        description__block.textContent = allElementsForPagination[i];
                        let description__blockMini = document.getElementById(i);
                        description__blockMini.innerHTML = allElementsForPagination[i];
                    }
                }

            });
        }
    });
    setTimeout(function () {
        showHideLoader(2);
    }, 3000);
}

function showHideLoader(numFunction) {
    switch (numFunction) {
        case 1:
            loaderBlock.classList.add('loader');
            loaderBlock.innerHTML = '<img src="./loader.png" alt="Загрузка.." class="loader__img">';
            allMenuBtn.style.opacity = 0;
            description.style.opacity = 0;
            menuText.forEach(element => {
                element.style.cursor = 'default';
            });
            mainText.style.opacity = 0;
            pagination.style.opacity = 0;
            activeLoader = true;
            break;
        case 2:
            loaderBlock.classList.remove('loader');
            loaderBlock.innerHTML = '';
            allMenuBtn.style.opacity = 1;
            description.style.opacity = 1;
            mainText.style.opacity = 1;
            menuText.forEach(element => {
                element.style.cursor = 'pointer';
            });
            pagination.style.opacity = 1;
            activeLoader = false;
            break;
    }
}

allMenuBtn.addEventListener('click', (event) => {
    const action = event.target.classList[1];
    switch (action) {
        case 'APOD_btn':
            if (checkAgainClick(1)) {
                deleteAllActiveTab();
                ApodBtn.classList.add('activeTab');
                mainText.innerHTML = 'Получите изображение астрономического обьекта на указанную дату:<input type="date" class="input__date" onkeydown="return false">';
                description.innerHTML = '';
                pagination.innerHTML = '';
                let date = document.querySelector('.input__date');
                date.valueAsDate = new Date();
                deleteLastHandler();
                allElementsForDelete['date'] = date;
                apiApod(date);
                date.addEventListener('change', () => {
                    apiApod(date);
                    numLastHandler = 1;
                });
                typeOfBtn = 1;
            }
            break;
        case 'NeoWs_btn':
            if (checkAgainClick(2)) {
                deleteAllActiveTab();
                NeowsBtn.classList.add('activeTab');
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
                deleteAllActiveTab();
                EonetBtn.classList.add('activeTab');
                mainText.innerHTML = ` Получить информацию о природных бедствия по миру, выберите тип:
                <select class="selectOfType">
                      <option>Лесные пожары</option>
                      <option>Вулканы</option>
                      <option>Обильный лед на марях и озерах</option>
                </select>
                `;
                description.innerHTML = '';
                pagination.innerHTML = '';
                deleteLastHandler();
                const selectOfType = document.querySelector('.selectOfType');
                allElementsForDelete['selectOfType'] = selectOfType;
                selectOfType.addEventListener('change', () => {
                    changeSelect(selectOfType.value);
                });
                numLastHandler = 3;
                typeOfBtn = 3;
                apiEonet(selectOfType.value);
            }
            break;
        case 'TechTransfer':
            if (checkAgainClick(4)) {
                numLastHandler = 4;
                typeOfBtn = 4;
                deleteAllActiveTab();
                TechTransferBtn.classList.add('activeTab');
                mainText.innerHTML = `Технологиии разработанные NASA, для коммерческого использования:`;
                description.innerHTML = '';
                pagination.innerHTML = '';
                deleteLastHandler();
                apiTechTransfer();
            }
            break;
        case 'InSight_btn':
            if (checkAgainClick(5)) {
                deleteAllActiveTab();
                InSightBtn.classList.add('activeTab');
                mainText.innerHTML = ` Получить снимки с марсахода. Выберите марсаход:
                <select class="selectOfType">
                      <option>curiosity</option>
                      <option>opportunity</option>
                      <option>spirit</option>
                      <option>perseverance</option>
                </select>
                `;
                description.innerHTML = '';
                pagination.innerHTML = '';
                deleteLastHandler();
                const selectOfType = document.querySelector('.selectOfType');
                allElementsForDelete['selectOfType'] = selectOfType;
                selectOfType.addEventListener('change', () => {
                    changeSelect(selectOfType.value);
                });
                numLastHandler = 5;
                typeOfBtn = 5;
                apiInSight(selectOfType.value);
            }
            break;
    }
});
