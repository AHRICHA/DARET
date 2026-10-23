
const form = document.getElementById("daret-form");
const nom = document.getElementById("nom-cercle");
const cotisation = document.getElementById("cotisation");
const periodicite = document.getElementById("periodicite");
const dateDebut = document.getElementById("date-debut");
const liste = document.getElementById("participants-liste");
const erreurParticipants = document.getElementById("participants-erreur");
const compteur = document.getElementById("participants-compteur");
const boutonAjouter = document.getElementById("ajouter-participant");

const calendrier = document.getElementById("calendrier-corps");
const vide = document.getElementById("etat-vide");
const resultat = document.getElementById("contenu-resultat");

let tours = [];
let participants = [];

// US-01 : validation des paramètres

function afficherErreur(champ, message) {
    const erreur = document.getElementById(champ.id + "-erreur");
    erreur.textContent = message;
    erreur.classList.remove("hidden");
    champ.setAttribute("aria-invalid", "true");
    champ.setAttribute("aria-describedby", erreur.id);
}

function effacerErreur(champ) {
    const erreur = document.getElementById(champ.id + "-erreur");
    erreur.textContent = "";
    erreur.classList.add("hidden");
    champ.removeAttribute("aria-invalid");
    champ.removeAttribute("aria-describedby");
}

function validerNom() {
    const valeur = nom.value.trim();

    if (!/^[\p{L}0-9 -]{3,40}$/u.test(valeur)) {
        afficherErreur(nom, "Entre 3 et 40 caractères : lettres, chiffres ou tirets.");
        return false;
    }

    effacerErreur(nom);
    return true;
}

function validerCotisation() {
    const valeur = Number(cotisation.value);

    if (cotisation.value === "" || !Number.isInteger(valeur) ||
        valeur < 100 || valeur > 50000) {
        afficherErreur(cotisation, "Entre 100 et 50 000 MAD, en nombre entier.");
        return false;
    }

    effacerErreur(cotisation);
    return true;
}

function validerPeriodicite() {
    if (!["hebdomadaire", "quinzaine", "mensuelle"].includes(periodicite.value)) {
        afficherErreur(periodicite, "Choisis une périodicité.");
        return false;
    }

    effacerErreur(periodicite);
    return true;
}

function aujourdhui() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
}

dateDebut.min = aujourdhui();

function validerDate() {
    if (!dateDebut.value || dateDebut.value < aujourdhui()) {
        afficherErreur(dateDebut, "Choisis aujourd'hui ou une date future.");
        return false;
    }

    effacerErreur(dateDebut);
    return true;
}

// US-02 : ajouter et supprimer les participants

function champsParticipants() {
    return liste.querySelectorAll('input[name="participant"]');
}

function mettreAJourParticipants() {
    const champs = champsParticipants();
    compteur.textContent = champs.length + " participant(s)";
    boutonAjouter.disabled = champs.length >= 20;

    liste.querySelectorAll(".supprimer-participant").forEach((bouton) => {
        bouton.disabled = champs.length <= 2;
    });

    liste.querySelectorAll("label").forEach((label, index) => {
        label.textContent = "Participant " + (index + 1);
    });
}

function ajouterParticipant() {
    if (champsParticipants().length >= 20) return;

    const ligne = document.createElement("li");
    const label = document.createElement("label");
    const champ = document.createElement("input");
    const erreur = document.createElement("p");
    const supprimer = document.createElement("button");
    const id = "participant-" + (champsParticipants().length + 1);

    label.htmlFor = id;
    label.textContent = "Participant " + (champsParticipants().length + 1);
    label.className = "block text-sm font-medium";

    champ.id = id;
    champ.name = "participant";
    champ.type = "text";
    champ.className = "rounded border px-3 py-2 w-full";

    erreur.id = id + "-erreur";
    erreur.className = "hidden text-sm text-daret-erreur";

    supprimer.type = "button";
    supprimer.textContent = "Supprimer";
    supprimer.className = "supprimer-participant rounded border px-3 py-2";

    supprimer.addEventListener("click", () => {
        if (champsParticipants().length > 2) {
            ligne.remove();
            mettreAJourParticipants();
            validerParticipants();
        }
    });

    champ.addEventListener("input", validerParticipants);

    ligne.className = "space-y-1";
    ligne.append(label, champ, erreur, supprimer);
    liste.appendChild(ligne);

    mettreAJourParticipants();
}

function validerParticipants() {
    const champs = champsParticipants();
    let valide = champs.length >= 2 && champs.length <= 20;
    const noms = [];

    erreurParticipants.textContent = "";
    erreurParticipants.classList.add("hidden");

    if (!valide) {
        erreurParticipants.textContent = "Il faut entre 2 et 20 participants.";
        erreurParticipants.classList.remove("hidden");
    }

    champs.forEach((champ) => {
        const valeur = champ.value.trim();
        const erreur = document.getElementById(champ.id + "-erreur");
        const nomNormalise = valeur.toLocaleLowerCase();

        erreur.textContent = "";
        erreur.classList.add("hidden");
        champ.removeAttribute("aria-invalid");

        if (!/^[\p{L}'’ -]{2,30}$/u.test(valeur)) {
            erreur.textContent = "Entre 2 et 30 caractères : lettres, espaces ou apostrophes.";
            erreur.classList.remove("hidden");
            champ.setAttribute("aria-invalid", "true");
            valide = false;
        } else if (noms.includes(nomNormalise)) {
            erreur.textContent = "Ce prénom existe déjà.";
            erreur.classList.remove("hidden");
            champ.setAttribute("aria-invalid", "true");
            valide = false;
        }

        noms.push(nomNormalise);
    });

    return valide;
}

boutonAjouter.addEventListener("click", ajouterParticipant);

ajouterParticipant();
ajouterParticipant();

