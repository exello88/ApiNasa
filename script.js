let MainText = document.querySelector('.main__text');
let Description = document.querySelector('.description');
const APODbtn = document.querySelector('.APOD_btn');
const NeoWsbtn = document.querySelector('.NeoWs_btn');
const EONETbtn = document.querySelector('.EONET_btn');
const Satellitebtn = document.querySelector('.Satellite_btn');
const InSightbtn = document.querySelector('.InSight_btn');
let TypeOfBtn = 0;

function ApiApod(data) {
    const descriptionBlockImg = document.querySelector('.description__img')
    const descriptionBlock = document.querySelector('.description__block');
    fetch('https://api.nasa.gov/planetary/apod?api_key=8MwhBFzZBekhCEakGeorXN0pRZH2K57zgoMGcL5C&date=' + data.value).then((response) => response.json()).then((response) => {
        if (response.explanation === undefined) {
            alert('Нет информации по заданной дате');
        }
        else {
            descriptionBlockImg.setAttribute('src', response.url);
            descriptionBlock.textContent = response.explanation;
        }
    });
}

APODbtn.addEventListener('click', () => {
    if (TypeOfBtn !== 1) {
        MainText.textContent = 'Получите изображение астрономического обьекта на указанную дату:';
        MainText.innerHTML += '<input type="date" class="input__date" onkeydown="return false">';
        Description.innerHTML += `
        <div class="description__BlockImg"><img class="description__img" alt="Фото"></div>
        <div class="description__block"></div>
        `;
        let data = document.querySelector('.input__date');
        data.valueAsDate = new Date();
        ApiApod(data);
        data.addEventListener('change', () => {
            ApiApod(data);
        });
        TypeOfBtn = 1;
    }
});
NeoWsbtn.addEventListener('click', () => {
    MainText.textContent = 'Получите информацию о близких к земле в указанную дату:';
});

EONETbtn.addEventListener('click', () => {
    MainText.textContent = 'Информация о природных бедствиях в указанную дату:';
});

Satellitebtn.addEventListener('click', () => {
    MainText.textContent = 'Информация о местоположении и статусе спутников, отслеживаемых NASA, по ID^';
});

InSightbtn.addEventListener('click', () => {
    MainText.textContent = 'Информация о погоде на марсе в заданную дату:';
});


