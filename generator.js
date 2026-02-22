const subjects=[
"Der erfahrene Lehrer",
"Die ehrgeizige Schülerin",
"Ein überforderter Kandidat",
"Der überraschte Beobachter"
];

const verbs=[
{v:"erklärte",type:"AO_DO"},
{v:"überreichte",type:"AO_DO"},
{v:"gedachte",type:"GO"},
{v:"entzog",type:"DO_AO"}
];

const ao=[
"die komplexe Aufgabe",
"einen ausführlichen Bericht",
"das schwierige Problem"
];

const dat=[
"den nervösen Schülern",
"seiner Kollegin",
"dem skeptischen Publikum"
];

const gen=[
"seines verstorbenen Mentors",
"ihrer früheren Lehrerin"
];

const adverbials=[
"nach der langen Diskussion",
"mit grosser Geduld",
"im überfüllten Klassenzimmer"
];

function random(a){return a[Math.floor(Math.random()*a.length)];}

function generateSentence(level){

let parts=[];

let s=random(subjects);
let v=random(verbs);

parts.push([s,"S","Nominalgruppe im Nominativ → Subjekt (Wer handelt?)."]);
parts.push([v.v,"P","Verbaler Teil → Prädikat."]);

if(v.type==="AO_DO"||v.type==="DO_AO"){
parts.push([random(dat),"DO","Nominalgruppe im Dativ → Wem wird etwas gegeben?" ]);
parts.push([random(ao),"AO","Nominalgruppe im Akkusativ → Was wird gegeben?" ]);
}

if(v.type==="GO"){
parts.push([random(gen),"GO","Verb verlangt Genitiv → Genitivobjekt." ]);
}

if(level>=2){
parts.push([random(adverbials),"k","Adverbiale Bestimmung → keines von diesen." ]);
}

if(level>=3){
parts.push(["sehr sorgfältig","k","Adverbiale der Art und Weise." ]);
}

return parts;
}
