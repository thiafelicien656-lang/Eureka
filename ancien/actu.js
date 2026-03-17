const actu = document.getElementById('actu');
const ImageSrc = "/assets/imgTmp/test.jpg"

const img0 = 'assets/img/Logo/logo_alomayjob.png';
const img2 = 'assets/img/Logo/logo-aloal__o.png';
const img1 = 'assets/img/Logo/logo_lvd.png';
const img3 = 'assets/img/Logo/logo_eureka.png';
const img4 = 'assets/img/Logo/logo_competences.png';
const img6 = 'assets/img/Logo/logo_alomalavouni.png';
const img5 = 'assets/img/Logo/logo-alomaytri.png'

const path = "/"






//LVD
function redirigerVersDetails() {
    const urlCible = "https://lively-coast-088a84303-1.westeurope.6.azurestaticapps.net/?show=details";
    window.open(urlCible, '_blank');
}

//Aloalo
function aloalo() {
    const urlCible = "https://polite-pebble-0726f9c03-1.westeurope.6.azurestaticapps.net/#formations";
    window.open(urlCible, '_blank');
}

//Aloma competences
function aloma() {
    const urlCible = "https://polite-sky-00c4ddd03-1.westeurope.6.azurestaticapps.net/#offres";
    window.open(urlCible, '_blank');
}

//Eureka
function Eureka() {
    const urlCible = "https://thankful-smoke-064996a10-1.centralus.3.azurestaticapps.net/#offres";
    window.open(urlCible, '_blank');
}
//allomavony    showdetails here
function allomavony() {
    const urlCible = "https://www.alomalavounicompetences.fr/?show=details";
    window.open(urlCible, '_blank');
}
//alomaytri
function alomaytri() {
    const urlCible = "https://alomaycode.github.io/alomaytri-front/?show=details";
    window.open(urlCible, '_blank');
}















const actualite = document.getElementById('actu');

var Contenu = "";
var describe = "";
var titre = "";
var imageSrc = document.getElementById("imageActu");
var grandImage = document.getElementById("grandImage");






function actuHtml(titre, Contenu, describe, id, titre, descriptionSite) {
    const baseUrl = `https://eureka-api-ehbed6ggg2d4c7gv.spaincentral-01.azurewebsites.net/api/actualites/image/${id}`;

    return `
            <div class="news-section">
      <div class="hero-container" id="heroContainer">
            <img src="${baseUrl}" alt="Actualités Mayotte" class="hero-image">
            <div class="hero-overlay">
                  <div class="click-indicator">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                              <circle cx="30" cy="30" r="28" stroke="white" stroke-width="2" opacity="0.8" />
                              <path d="M30 20v20M30 40l-8-8M30 40l8-8" stroke="white" stroke-width="2.5"
                                    stroke-linecap="round" />
                        </svg>
                        <p>Cliquez pour lire l'actualité</p>
                  </div>

                  <div class="BoxActu">
                  
                              <div class="ActuDiv  ">
                                    <img src="${img0}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['ALOMAYJOB']}</h2>
                                          <p class="actu-text-short">
                                            ${descriptionSite['ALOMAYJOB']}
                                          </p>
                                    </div>
                              </div>
      


                              <div class="ActuDiv special" onclick="redirigerVersDetails()">
                                    <img src="${img1}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['LVD']}</h2>
                                          <p class="actu-text-short">
                                                ${descriptionSite['LVD']}
                                          </p>
                                    </div>
                              </div>

                              <div class="ActuDiv special" onclick="aloalo()">
                                    <img src="${img2}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['ALOALO']}</h2>
                                          <p class="actu-text-short">
                                                ${descriptionSite['ALOALO']}
                                          </p>
                                    </div>
                              </div>

                              <div class="ActuDiv special" onclick="Eureka()">
                                    <img src="${img3}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['EUREKA']}</h2>
                                          <p class="actu-text-short">
                                                ${descriptionSite['EUREKA']}
                                          </p>
                                    </div>
                              </div>

                              <div class="ActuDiv special" onclick="aloma()">
                                    <img src="${img4}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['ALOMAYJOB COMPETENCES']}</h2>
                                          <p class="actu-text-short">
                                                ${descriptionSite['ALOMAYJOB COMPETENCES']}
                                          </p>
                                    </div>
                              </div>

                              <div class="ActuDiv special" onclick="alomaytri()">
                                    <img src="${img5}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['ALOMAYTRI']}</h2>
                                          <p class="actu-text-short">
                                                ${descriptionSite['ALOMAYTRI']}
                                          </p>
                                    </div>
                              </div>

                              <div class="ActuDiv special" onclick="allomavony()">
                                    <img src="${img6}" alt="actu" class="actu-flag-img">
                                    <div class="actu-body">
                                          <h2 class="actu-title-link">${titre['ALOMALAVOUNI']}</h2>
                                          <p class="actu-text-short">
                                            ${descriptionSite['ALOMALAVOUNI']}
                                          </p>
                                    </div>
                              </div>

                  </div>
            </div>
      </div>

      <section class="car">
            <div class="container" id="containerDetails">
                  <div class="content-details" id="contentDetails">
                        <div class="content-grid">
                              <div class="left-column">
                                    <img src="${baseUrl}" alt="Actualités Madagascar" class="featured-image">
                                    <h2 class="main-title">${titre}</h2>
                                    <div class="content-block bloc1">
                                          <span class="source-link">${titre}</span>
                                          <p class="content-description" style="margin-top: 15px;">
                                                ${describe}
                                          </p>
                                    </div>
                              </div>

                              <div class="right-column">
                                    <div class="content-block">
                                          <h2 class="section-title" style="font-size:1.2rem">Actualite</h2>
                                          <p class="content-description bloc2" style="margin-top: 15px;">
                                                ${Contenu}
                                          </p>
                                          <span class="reference-link">source Facebook</span>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div class="popup_overlay_car" id="popup_car">
                        <div class="popup_content_car"> 
                              <h3 id="popup_title_car"></h3>
                              <p id="popup_date_car"></p>
                              <p id="popup_description_car"></p>
                        </div>
                  </div>
            </div>
      </section>

      <div class="close-indicator" id="closeBtn">
            <span>Réduire</span>
      </div>
</div>
</div>

      
      `
}




async function chargerDerniereActualite(categorie) {
    try {

        const response = await fetch(`https://eureka-api-ehbed6ggg2d4c7gv.spaincentral-01.azurewebsites.net/api/actualites/last?cat=${categorie}`);


        if (!response.ok) {
            console.log("Aucune actualité trouvée");
            return;
        }

        const responsTitre = await fetch("https://eureka-api-ehbed6ggg2d4c7gv.spaincentral-01.azurewebsites.net/api/actualites/last-titles-by-category");
        const actuTitle = await responsTitre.json();


        let titreSite = {
            'LVD': 'Aucun titre',
            'ALOALO': 'Aucun titre',
            'ALOMAYJOB COMPETENCES': 'Aucun titre',
            'EUREKA': 'Aucun titre',
            'ALOMALAVOUNI': 'Aucun titre',
            'ALOMAYTRI': 'Aucun titre',
            'ALOMAYJOB': 'Aucun titre'
        };

        let descSite = {
            'LVD': 'Aucune description',
            'ALOALO': 'Aucune description',
            'ALOMAYJOB COMPETENCES': 'Aucune description',
            'ALOMAYJOB': 'Aucune description',
            'EUREKA': 'Aucune description',
            'ALOMALAVOUNI': 'Aucune description',
            'ALOMAYTRI': 'Aucune description'
        };

        actuData.forEach(item => {
            if (titreSite.hasOwnProperty(item.categorie) && item.derniereActu) {
                titreSite[item.categorie] = item.derniereActu.titre;
                descSite[item.categorie] = item.derniereActu.descriptionCourte;
            }
        })

        console.log("Titres mis à jour :", titreSite);



        const actu = await response.json();
        console.log("Actualité récupérée :", actu.id);


        const htmlFinal = actuHtml(actu.titre, actu.contenu, actu.description, actu.id, titreSite, descSite);


        actualite.insertAdjacentHTML('beforeend', htmlFinal);
        new NewsShowcase();


    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
}



async function init() {
    console.log("Chargement ddata");
    await chargerDerniereActualite("ALOMAYJOB");

}

init();
