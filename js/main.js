/* Fetch i18n */
async function loadTranslations(lang){
    const response = await fetch(`../i18n/${lang}.json`);
    return response.json();
}
/* taking URL & comparing languages, default - en */
function resolveLanguage(){
    const params = new URLSearchParams(window.location.search);
    const langFromQuery = params.get('lang');

    const supported = ['en', 'de', 'es', 'fr', 'ja', 'pt'];
    const systemLang = navigator.language.slice(0, 2);

    if (supported.includes(langFromQuery)) return langFromQuery;
    if (supported.includes(systemLang)) return systemLang;

    return 'en';
}
/* substitution of translation */
function applyTranslation(dict){
    const elements = document.querySelectorAll('[data-i18n]')

    elements.forEach(el => {
        const key = el.dataset.i18n;
        let translation = dict[key];

        if (!translation) {
            console.warn(`Missing translation for key: ${key}`)
            el.innerHTML = key;
        };
        if (el.dataset.i18nParams){
            const params = JSON.parse(el.dataset.i18nParams);
            Object.keys(params).forEach(param => {
                translation = translation.replace(
                    `{{${param}}}`,
                    params[param]
                )
            })
        }
        el.innerHTML = translation;
    });
}
/*  adding a translation to a pseudo-element */
function applyPreudoTranslation(dict){
    document.querySelectorAll('[data-i18n').forEach(el => {
        const key = el.dataset.i18n;
        const value = dict[key];

        if(!value) return;
        el.style.setProperty(
            "--best-text",
            `"${value}"`
        )
    })
}
document.addEventListener("DOMContentLoaded", async ()=>{
    const lang = resolveLanguage();
    
    const dict = await loadTranslations(lang)
    applyTranslation(dict);
    applyPreudoTranslation(dict);
    
    const offers = document.querySelectorAll('.offer');
    let selectedPlan = document.querySelector('.offer.active')?.dataset.plan;
    /* selecting the link to go to & the active button */
    offers.forEach(offer => {
    offer.addEventListener('click', () => {
    
    offers.forEach(o => o.classList.remove('active'));

    offer.classList.add('active');

    selectedPlan = offer.dataset.plan;
    });
    });
    const continueBtn = document.querySelector('.continue');

    continueBtn.addEventListener('click', () => {
  if (selectedPlan === 'apple') {
    window.location.href = 'https://www.apple.com/';
  } else if (selectedPlan === 'google') {
    window.location.href = 'https://google.com/ ';
  }
});

})