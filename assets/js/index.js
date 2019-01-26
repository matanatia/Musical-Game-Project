//the string that contain the user key presses
let musicSheet = "";
//this array will contain the time of each sound we need to play according the user clicks on keybord
let tempo = [];
//var to save the last time the user click on keybord
var lastTimeClicked = 0;
//the  sound for each key
const keySound = {
    q: 'assets/sounds/bubbles.mp3', w: 'assets/sounds/clay.mp3',
    e: 'assets/sounds/confetti.mp3', r: 'assets/sounds/corona.mp3', 
    t: 'assets/sounds/dotted-spiral.mp3', y: 'assets/sounds/flash-1.mp3',
    u: 'assets/sounds/flash-2.mp3', i: 'assets/sounds/flash-3.mp3', 
    o: 'assets/sounds/glimmer.mp3', p: 'assets/sounds/moon.mp3', 
    a: 'assets/sounds/pinwheel.mp3', s: 'assets/sounds/piston-1.mp3',
    d: 'assets/sounds/piston-2.mp3', f: 'assets/sounds/piston-3.mp3', 
    g: 'assets/sounds/prism-1.mp3', h: 'assets/sounds/prism-2.mp3', 
    j: 'assets/sounds/prism-3.mp3', k: 'assets/sounds/splits.mp3',
    l: 'assets/sounds/squiggle.mp3', z: 'assets/sounds/strike.mp3', 
    x: 'assets/sounds/suspension.mp3', c: 'assets/sounds/timer.mp3', 
    v: 'assets/sounds/ufo.mp3', b: 'assets/sounds/veil.mp3',
    n: 'assets/sounds/wipe.mp3', m: 'assets/sounds/zig-zag.mp3' 
}

//the color for each key
const keyColor = {
    q: "red", w: "green", e: "blue", r: "rebeccapurple", t: "lightcoral", y: "royalblue",
    u: "purple", i: "peru", o: "yellow", p: "brown", a: "blueviolet", s: "goldenrod",
    d: "hotpink", f: "forestgreen", g: "firebrick", h: "darkorange", j: "gray", k: "teal",
    l: "red", z: "green", x: "blue", c: "rebeccapurple", v: "lightcoral", b: "royalblue",
    n: "purple", m: "peru", 1: "yellow", 2: "brown", 3: "blueviolet", 4: "goldenrod",
    5: "hotpink", 6: "forestgreen", 7: "firebrick", 8: "darkorange", 9: "gray", 0: "teal",
}

//vars we use to control overflow
let width = document.querySelector("#output").offsetWidth;
let fontsize = parseInt(window.getComputedStyle(document.querySelector("#output")).fontSize);

//add keypress function to the html body - show the user key press in output element and play sound
document.querySelector("body").addEventListener("keypress", function (event) {
    //remove the second line in the headline if this is the first time the user press a btn
    if (musicSheet == "") {
        document.querySelector("#second").style.opacity = "0"; 
    }
    //add keypress to the music sheet
    musicSheet += (event.key.toUpperCase() + " ");
    setOutput();
    playSound(event.key);
    animateCircle(event.key);

    //save the time between the user clicks
    if (tempo.length === 0){
        //first click
        tempo.push(0);
        lastTimeClicked = event.timeStamp;
    }
    else {
        tempo.push(event.timeStamp - lastTimeClicked);
        lastTimeClicked = event.timeStamp;
    }
});


//check if the element with the output for the user was resize and chenge his width if neccery
window.addEventListener("resize", function (event) {

    currentWidth = document.querySelector("#output").offsetWidth;

    if (currentWidth != width) {
        width = currentWidth;
        //set the output to show properly with the new width
        setOutput();
    }
});

//clear the user input
document.querySelector("#clear").addEventListener("click", function (event) {
    musicSheet = "";
    document.querySelector("#output").textContent = musicSheet;
    //return the second line in the headline
    document.querySelector("#second").style.opacity = "1";
    //clear the tempo array
    tempo = [];
});

//play the user input
document.querySelector("#play").addEventListener("click", function (event) {
    if(musicSheet != ""){
        var playList = [];
        var music = musicSheet.replace(' ', '');
        var key = "";

        //create the play list
        for (let i = 0; i < music.length; i++) {
            key = music[i].toLowerCase();
            if (keySound[key]) {
                playList.push(keySound[key]);
            } else if (key != " ") {
                playList.push(keySound['q']);
            }
        }

        //play what the user pressed till now
        var newTempo = tempo.filter((element) => { return typeof element === "number" });
        play_audio_list(playList, newTempo);
        
    }

});

function setOutput() {
    //calculate text length with the current font size used in the element
    textLength = fontsize * musicSheet.length / 2;
    //output element
    output = document.querySelector("#output");

    //show the user his pressed keys
    if (textLength > width) {
        //handeling text over flow
        //*2 beacuse we also use space " " when we bulit the string we show to the user
        start = musicSheet.length - 1 - Math.round(width / fontsize) * 2;
        end = musicSheet.length - 1;
        //show output
        output.textContent = musicSheet.substring(start, end);
    }
    else { output.textContent = musicSheet; }
}

function playSound(key) {
    //play the sound fitting the key that was preesed
    if (keySound[key]) {
        new Howl({ src: [keySound[key]] }).play();
    } else if (key != " "){
        new Howl({ src: [keySound['q']] }).play();
    }
}

function play_audio_list(playList, tempo) {
    var sound = new Howl({src: [playList[0]]});
    var animateCircleKey = "q";

    //set the tempo for the audio list
    setTimeout(() => {

        //search the right Circle to animate with the key we going to play
        for (key in keySound) {
            if (keySound[key] === playList[0]){
                animateCircleKey = key;
                break;
            }
        }

        animateCircle(animateCircleKey);
        sound.play();

        //remove the audio and the time tamp we just use
        playList.shift();
        tempo.shift();
        //if we still have a audios on our list, keep playing
        if (playList.length > 0) {
            play_audio_list(playList, tempo);
        }
    }, tempo[0]);
}

function animateCircle(key) {
    //get random position
    var x = Math.random() * ((window.innerWidth - 200) - 0) + 0;
    var y = Math.random() * ((window.innerHeight - 200) - 0) + 0;
    //creat the circle
    var node = document.createElement("div");
    node.classList.add("circle");
    node.style.position = "absolute";
    node.style.top = y + "px";
    node.style.left = x + "px";
    //fill with color
    if (keyColor[key]) {
        node.style.background = keyColor[key];
    } else {
        node.style.background = "green";
    }

    node.addEventListener("animationend", function (event) {
        //remove the div "circle" element from the html in the end of the animation
        this.remove();
    });

    document.querySelector("#circles").appendChild(node); 
}
