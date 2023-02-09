var targetPos;
var planchettePos;
var step = 1;
var speed = 10;
var planchetteXOffset;
var planchetteYOffset;
var onTarget;
var answerString = "";
var lastChar;

var dict = {
    a: [13.83, 48.32],
    b: [20.07, 42.15],
    c: [25.02, 37.74],
    d: [30.39, 34.57],
    e: [35.69, 32.27],
    f: [41.29, 31.04],
    g: [46.35, 29.45],
    h: [51.54, 29.45],
    i: [57.30, 30.335],
    j: [61.65, 31.21],
    k: [67.13, 33.50],
    l: [73.45, 37.037],
    m: [78.93, 41.093],
    n: [86.376, 48.14],
    o: [16.09, 60.67],
    p: [20.98, 55.91],
    q: [26.49, 52.2],
    r: [32.55, 48.5],
    s: [38.41, 45.5],
    t: [44.48, 44.8],
    u: [49.57, 43.74],
    v: [55.98, 44.09],
    w: [64.21, 46.03],
    x: [71.32, 50.26],
    y: [77.25, 55.73],
    z: [82.2, 59.61],
    "1": [24.18, 72.84],
    "2": [28.51, 71.78],
    "3": [34.16, 72.31],
    "4": [39.94, 72.66],
    "5": [45.73, 72.66],
    "6": [51.45, 72.49],
    "7": [57.03, 71.78],
    "8": [62.4, 72.31],
    "9": [67.91, 73.02],
    "0": [74.04, 71.43],
    yes: [22.86, 12.87],
    no: [77.95, 12.52],
    goodbye: [49.15, 88.18],
    sun: [7.03, 12.7],
    moon: [94.2, 13.23]
};

window.onload = (event) => {
    document.getElementById("background").addEventListener('mousemove', onMouseMove);
    addEventListener('mouseout', onMouseOut);
    document.getElementById("background").addEventListener('click', onClick);
    targetPos = [0, 0];
    planchettePos = [0, 0];
    planchetteXOffset = -158;
    planchetteYOffset = -150;
    animatePlanchette();
};


function onMouseMove(e){
    targetPos = [e.pageX + planchetteXOffset, e.pageY + planchetteYOffset];
    var rect = e.currentTarget.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    if (onTarget){
        checkLetter(getRelativeCoords(offsetX, offsetY));
    }
}

function onMouseOut(e){
   //targetPos = 0;
}

function onClick(e){
    var rect = e.currentTarget.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    //console.log([e.clientX, e.clientY])
    //console.log([$("#background")[0].clientWidth, $("#background")[0].clientHeight])
    [x, y] = getRelativeCoords(offsetX, offsetY);
    console.log("[" + Math.round(x * 100) / 100 + ", " + Math.round(y * 100) / 100 + "]");
}

function getRelativeCoords(offsetX, offsetY){
    return [offsetX / $("#background")[0].clientWidth * 100, offsetY / $("#background")[0].clientHeight * 100];
}

function animatePlanchette(){
    if (Math.abs(planchettePos[0] - targetPos[0]) < 1 && Math.abs(planchettePos[1] - targetPos[1]) < 1){
        onTarget = true;
        setTimeout(animatePlanchette, speed);
        return;
    }
    else if (targetPos != 0){
        planchettePos[0] = targetPos[0] > planchettePos[0] ? planchettePos[0] + step : targetPos[0] < planchettePos[0] ? planchettePos[0] - step : planchettePos[0];
        planchettePos[1] = targetPos[1] > planchettePos[1] ? planchettePos[1] + step : targetPos[1] < planchettePos[1] ? planchettePos[1] - step : planchettePos[1];
        $("#planchette").css({top: planchettePos[1] + 'px', left: planchettePos[0] + 'px', position: "absolute"});
        shakePlanchette();
        setTimeout(animatePlanchette, speed);
    }
    onTarget = false;
}

function shakePlanchette(){
    var newtop = planchettePos[1] + GetRandomNumber(10);
    var newleft =  planchettePos[0] + GetRandomNumber(10);
    $('#planchette').css('top', newtop + 'px');
    $('#planchette').css('left', newleft + 'px');
}

function checkLetter([x, y]){
    for (const [key, value] of Object.entries(dict)) {
        if (Math.abs(x - value[0]) < 1 && Math.abs(y - value[1] < 1)){
            if (lastChar != key){
                if (key == "goodbye"){
                    answerString = "";
                }
                else if (key == "sun"){
                    answerString += "☀️";
                }
                else if (key == "moon"){
                    answerString += "🌙";
                }
                else{
                    answerString += key;
                }
                $('#answer-text')[0].innerHTML = answerString;
                lastChar = key;
            }
            return;
        }
    }
    
}

function GetRandomNumber (max){
    return Math.floor(Math.random() * max);
}

