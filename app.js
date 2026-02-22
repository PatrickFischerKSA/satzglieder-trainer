const labels=["S","P","AO","DO","GO","k"];

let progress=JSON.parse(localStorage.getItem("satz_progress_v2"))||{
score:0,
level:1,
attempts:0
};

function save(){
localStorage.setItem("satz_progress_v2",JSON.stringify(progress));
}

function autoLevel(){
if(progress.score>15) progress.level=2;
if(progress.score>40) progress.level=3;
if(progress.score>80) progress.level=4;
}

function render(){

autoLevel();

document.getElementById("status").innerHTML=
`Level: ${progress.level} | Punkte: ${progress.score}`;

window.current=generateSentence(progress.level);

let html='<div class="box">';

current.forEach((p,i)=>{
html+=`
<div>
<b>${p[0]}</b>
<br>
<select id="sel${i}">
<option value="">-- wählen --</option>
${labels.map(l=>`<option>${l}</option>`).join("")}
</select>
<div id="fb${i}" class="explain"></div>
</div><br>`;
});

html+='</div>';

document.getElementById("exercise").innerHTML=html;
document.getElementById("result").innerHTML="";
}

function check(){

let correct=0;

current.forEach((p,i)=>{

let val=document.getElementById("sel"+i).value;
let fb=document.getElementById("fb"+i);

if(val===p[1]){
correct++;
fb.innerHTML="✔ Richtig — "+p[2];
fb.className="correct";
}else{
fb.innerHTML="✘ Falsch — "+p[2];
fb.className="wrong";
}

});

progress.score+=correct;
progress.attempts++;
save();

document.getElementById("result").innerHTML=
`Ergebnis: ${correct} / ${current.length} richtig`;
}

function nextExercise(){
render();
}

render();
