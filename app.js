const labels=["S","P","AO","DO","GO","k"];

let progress=JSON.parse(localStorage.getItem("satz_progress"))||{score:0,level:1};

function save(){
localStorage.setItem("satz_progress",JSON.stringify(progress));
}

function newExercise(){
if(progress.score>10) progress.level=2;
if(progress.score>25) progress.level=3;
if(progress.score>45) progress.level=4;

document.getElementById("levelBox").innerHTML="Level: "+progress.level;

window.current=generateSentence(progress.level);

let html='<div class="box">';
current.forEach((p,i)=>{
html+=`
<div>
${p[0]}
<select id="s${i}">
<option></option>
${labels.map(l=>`<option>${l}</option>`).join("")}
</select>
<div id="fb${i}"></div>
</div>`;
});
html+='</div>';

document.getElementById("exercise").innerHTML=html;
}

function check(){
let correct=0;
current.forEach((p,i)=>{
let val=document.getElementById("s"+i).value;
let fb=document.getElementById("fb"+i);
if(val===p[1]){
correct++;
fb.innerHTML="✔ richtig";
fb.className="correct";
}else{
fb.innerHTML="✘ "+p[2];
fb.className="wrong";
}
});
progress.score+=correct;
save();
sendToTeacher();
newExercise();
}

function sendToTeacher(){
let data={time:Date.now(),score:progress.score,level:progress.level};
localStorage.setItem("live_"+Date.now(),JSON.stringify(data));
}

newExercise();