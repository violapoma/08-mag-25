//per decidere quante card mettere in base alla section e alla dim dello schermo
const larghezze = [
    { //section settimana
        "sm": "6",
        "md": "4",
        "lg": "3"
    },
    { //section welcome summer
        "sm": "6",
        "md": "4",
        "lg": "2"
    },
    { //section last minute
        "sm": "6",
        "md": "3",
        "lg": "4"
    }   
]
window.addEventListener('load', offertaDelGiorno);
document.addEventListener('DOMContentLoaded', function () {
    const accordionItems = document.querySelectorAll('.accordion-collapse');

    accordionItems.forEach(item => {
        item.addEventListener('shown.bs.collapse', function () {
            const parametro = item.getAttribute('data-id-custom');

            riempiCard(parametro);
        });
    });
});

function checkCampi() {
    const email = document.getElementById("email").value;
    console.log(email);
    const proposta = document.getElementById("proposta").value;

    if (email === "") {
        document.getElementById("email").style.border = "1px solid red";
    }
    if (proposta === "") {
        document.getElementById("proposta").style.border = "1px solid red";
    }
    if (proposta !== "" && email !== "") {
        document.getElementById("compila").setAttribute("hidden", true);
        document.getElementById("send").setAttribute("hidden", true);
        document.getElementById("compilato").removeAttribute("hidden");
    }
}


document.getElementById("contactUsModal").addEventListener('hidden.bs.modal', resetContattaci);
function resetContattaci() {
    document.getElementById("compila").removeAttribute("hidden");
    document.getElementById("send").removeAttribute("hidden");
    document.getElementById("email").value = "";
    document.getElementById("proposta").value = "";
    document.getElementById("compilato").setAttribute("hidden", true);
}

function scopri() {
    document.getElementById("toChange").setAttribute("hidden", true);
    document.getElementById("outcome").removeAttribute("hidden");
    document.getElementById("outcome").classList.add("d-flex");
    const luckyNumber = Math.floor((Math.random() * 50) + 1);
    console.log(luckyNumber);
    document.getElementById("numeroRandom").textContent = luckyNumber;
    const secondoNum = document.getElementById("yourLucky").value;
    document.getElementById("numeroScelto").textContent = secondoNum;
    console.log("*" + secondoNum);
    let lucky = luckyNumber === secondoNum ? true : false;
    console.log(lucky);
    let vincita = document.getElementById("vincita");
    console.log(vincita);
    let risultato = document.getElementById("risultato");
    if (lucky) {
        console.log("Lucky!");
        vincita.style.backgroundColor = "#D5EDB9";
        risultato.textContent = 'Codice sconto: "IAmLucky_5" '
    }
    else {
        console.log("Nope");
        vincita.style.backgroundColor = '#FFB1B1'
        risultato.textContent = "Mi dispiace, non hai vinto";
    }
        
    let divToChange = document.getElementById("toChange");
    while (divToChange.hasChildNodes())
        divToChange.removeChild(divToChange.firstChild);
    divToChange.remove();
}

function riempiCard(idx) {
    console.log(`riemiCard(${idx}`);
    let qualeRow;
    switch (idx) {
        case "0":
            qualeRow = "settimana";
            break;
        case "1":
            qualeRow = "summer";
            break;
        case "2": 
            qualeRow = "lm";
            break;
        default:
            return ;
    }
    console.log("§" + qualeRow);
    let riga = document.getElementById(`${qualeRow}`);
    if (riga.childNodes.length > 1){
        console.log("°°riga non vuota");
        return; //per non duplicare le card
    }
    fetch('./destinazioni.json')
        .then(data => {
            return data.json();
        })
        .then(post => {
            const destinazioni = post.filter(obj => obj.offerta == qualeRow); //recupero le destinazioni in base al tipo di offerta
            console.log("destinazioni giuste: " + destinazioni.length);
            console.log(destinazioni);
            
            console.log("§§"+riga);
            let html = '';
            destinazioni.forEach(card => {
                console.log("§§§"+card.destinazione);
                html += `<div class="col-sm-${larghezze[idx].sm} col-md-${larghezze[idx].md} col-lg-${larghezze[idx].lg} mb-3 ${qualeRow}"><div class="card `;
                if (qualeRow === "summer") {
                    html+=" shadow p-3 mb-5 bg-body rounded";
                }
                html+=`"><div class="card-body ">
                    <h5 class="card-title">${card.destinazione}</h5>
                    <img class="d-block w-100 rounded-2" src="${card.urlImg}" alt="${card.destinazione.replace(/\s/g, "")}" `;
                if (qualeRow ==="lm") {
                    html+='data-bs-toggle="modal" data-bs-target="#offerModal" onclick = fillOfferModal(this)'
                }
                html += `><p class="card-text clamp-text">${card.descrizione}</p>
                    <p id="id_offerta_${card.id}">${card.id}</p>
                    <a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#offerModal" onclick="fillOfferModal(this)">vedi</a>
                    </div>
                    </div>
                    </div>`;
            });
            riga.innerHTML += html;
            document.querySelectorAll('p[id^="id_offerta_"]').forEach(p => {
               p.style.display = "none";
            });
        })
}

function offertaDelGiorno() {
    console.log("--offertaDelGiorno--");
    let offertaGiorno = document.getElementById("offertaGiorno");
    fetch('./destinazioni.json')
        .then(data => {
            return data.json();
        })
        .then(post => {
            let dove = post.find(obj => obj.offerta == "giorno"); //recupero l'offerta del giorno
            console.log(dove);
            offertaGiorno.querySelector("h3").textContent = dove.destinazione;
            offertaGiorno.querySelector("h4").textContent = dove.periodo + ", a partire da " + dove.prezzo + "/giorno";
            offertaGiorno.querySelector("p").textContent = dove.descrizione;
            offertaGiorno.querySelector("#giornoImg").setAttribute("src", `${dove.urlImg}`);
        });
}

//apre l'offerta 
function fillOfferModal(cardClicked) {
    console.log(cardClicked.parentNode);
    const idOff = cardClicked.parentNode.querySelector('p[id^="id_offerta_"]').innerText;
    console.log(idOff);
    let ofMod = document.getElementById("offerModal");
    fetch('./destinazioni.json')
        .then(data => {
            return data.json();
        })
        .then(post => {
            const card = post.find(obj => obj.id == idOff); //recupero l'offerta
            console.log(card);
            ofMod.querySelector('h2').textContent = card.destinazione;
            ofMod.querySelector('h3').textContent = card.periodo + ", a partire da " + card.prezzo;
            ofMod.querySelector('.modal-body>img').setAttribute("src", card.urlImg);
            ofMod.querySelector('.modal-body>img').setAttribute("alt", card.destinazione.replace(/\s/g, "")); //rimuove gli spazi bianchi dentro alla stringa
            ofMod.querySelector('#descrizioneOff').innerText = card.descrizione;
            ofMod.querySelector("#prenota").setAttribute("onclick", `changeContactModal("${card.destinazione}")`);
        });
}

function changeContactModal(where) {
    const contactMod = document.getElementById("contactUsModal");
    let dest = where.split(",");
    where = dest[0];
    contactMod.querySelector('h2').innerText = "Prenota la tua vacanza a " + where;
}

