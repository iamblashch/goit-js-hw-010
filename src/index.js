import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js'

const ref = {
    inputSearchEl: document.querySelector('#search-box'),
    listCountryEl: document.querySelector('.country-list'),
    infoCountryEl: document.querySelector('.country-info'),
};

const cleanMarkup = refs => (refs.innerHTML = '');

const inputHandler = e => {
    const inputText = e.target.value.trim();

    if(!inputText){
        cleanMarkup(ref.listCountryEl);
        cleanMarkup(ref.infoCountryEl);
        return;
    }

    fetchCountries(inputText)
        .then(data => {
            console.log(data);
            if(data.length > 10){
                Notify.info('Too many matches found. Please enter a more specific name.')
                return;
            }
            renderMarkup(data);
        })
        .catch(err => {
            cleanMarkup(ref.listCountryEl);
            cleanMarkup(ref.infoCountryEl);
            Notify.failure('Oops, there is no country with that name');         
        });   
};

const renderMarkup = data => {
    if(data.length === 1){
        cleanMarkup(ref.listCountryEl);
        const markupInfo = createInfoMarkup(data);
        ref.infoCountryEl.innerHTML = markupInfo;
    }else{
        cleanMarkup(ref.infoCountryEl);
        const markupList = createListMarkup(data);
        ref.listCountryEl.innerHTML = markupList
    }
}

const createListMarkup = data => {
    return data
    .map(({name, flags}) => 
    `<li><img src="${flags.png}" alt="${name.official}" width="60" heigth="40">${name.official}</li>`)
    .join('');
}


const createInfoMarkup = data => {
    return data.map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.png}" alt="${name.official}" width="60" height="40">${
          name.official
        }</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`,
    );
  };
  
  ref.inputSearchEl.addEventListener('input', debounce(inputHandler, 300));

