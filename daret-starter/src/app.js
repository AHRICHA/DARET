// Daret — simulateur. Ton code commence ici.
// Le HTML (index.html) est déjà intégré : lis-le, repère les id et les data-*, puis fais-le vivre.


const circlename = document.getElementById("nom-cercle")
const nameerror = document.getElementById("nom-cercle-erreur")
const nameregex = /^[\p{L}0-9 -]{3,40}$/u;
const montant =  document.getElementById("cotisation")
const montanterror = document.getElementById("cotisation-erreur")
const date = document.getElementById("date-debut")
const dateerror = document.getElementById("date-debut-erreur")
let today = new Date().toISOString().split('T')[0];
    today = today.split("-")
const currentyear = today[0]
const currentmonth = today[1]
const currentday = today[2]
let userdate = date.value.split("-")
let useryear = userdate[0]
let usermonth = userdate[1]
let userday = userdate[2]