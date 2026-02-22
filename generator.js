const subjects=[
"Der Schüler","Die Lehrerin","Ein Kind","Der Hund","Meine Schwester"
];

const verbs=[
{v:"liest", type:"AO"},
{v:"hilft", type:"DO"},
{v:"gedenkt", type:"GO"},
{v:"erklärt", type:"AO_DO"}
];

const ao=["ein Buch","die Aufgabe","einen Brief","den Text"];
const dat=["dem Freund","den Kindern","der Lehrerin"];
const gen=["seines Vaters","ihrer Freundin","des Lehrers"];

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

function generateSentence(level){
let s=random(subjects);
let v=random(verbs);
let parts=[];

parts.push([s,"S","Nominalgruppe im Nominativ → Subjekt."]);
parts.push([v.v,"P","Verbaler Teil → Prädikat."]);

if(v.type==="AO"){
parts.push([random(ao),"AO","Nominalgruppe im Akkusativ → Akkusativobjekt."]);
}
if(v.type==="DO"){
parts.push([random(dat),"DO","Nominalgruppe im Dativ → Dativobjekt."]);
}
if(v.type==="GO"){
parts.push([random(gen),"GO","Verb verlangt Genitiv → Genitivobjekt."]);
}
if(v.type==="AO_DO"){
parts.push([random(dat),"DO","Nominalgruppe im Dativ."]);
parts.push([random(ao),"AO","Nominalgruppe im Akkusativ."]);
}
if(level>2){
parts.push(["im Garten","k","Ortsangabe → keines von diesen."]);
}
return parts;
}