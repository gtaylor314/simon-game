var btnColors = ["red", "blue", "green", "yellow"]
var simonPattern = [];
var userPattern = [];
var started = false;
var level = 0;

function playSound(soundName) {
    var sound = new Audio("sounds/" + soundName + ".mp3");
    sound.play();
}

function animateBtnClick(btnClicked) {
    // add class .clicked
    $("#" + btnClicked).addClass("clicked");
    // remove class .clicked after 100 ms
    setTimeout(function() { 
        $("#" + btnClicked).removeClass("clicked"); 
    }, 100);
}

// add an event listener for the event type click to all buttons
$("button").click(function(event) {
    // when clicked, grab the id of the button clicked and add it to the pattern of 
    // buttons the user has clicked thus far
    var userSelectedBtn = event.target.id;
    userPattern.push(userSelectedBtn);
    
    // play the sound cooresponding to the button clicked on by the user
    playSound(userSelectedBtn);
    // play the animation to visually indicate that the button was pressed
    animateBtnClick(userSelectedBtn);

    // pass in the userPattern's latest index
    checkSequence(userPattern.length - 1);
});

// add an event listener for the event type keydown to the document
$(document).keydown(function() {
    // if the simon game hasn't started, start the game
    if (!started) {
        started = true;
        $("p").slideUp();
        $("h1").text("Starting the game...").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        // delay the call of nextSequence() by 2 seconds to allow for the h1 to be updated and animated
        setTimeout(nextSequence, 2000);
    }
    // otherwise, ignore the keydown event
})

function nextSequence() {
    // increment the level by 1 with each call of nextSequence
    level++;
    $("h1").text("Level " + level);

    var randomIndex = Math.floor(Math.random() * 4);
    var randomBtnColor = btnColors[randomIndex];
    simonPattern.push(randomBtnColor);
    
    // animate the button whose background color matches that randomly selected above
    $("#" + randomBtnColor).fadeOut("fast").fadeIn("fast");

    // play the sound cooresponding to the button whose background color matches that 
    // randomly selected above
    playSound(randomBtnColor);
}

function checkSequence(latestIndex) {
    // as the game, simon, requires players to 1) remember the color sequence thus far, 
    // 2) enter that sequence, and 3) enter the latest color shown, the check has to be 
    // performed with each click 
    //
    // two end game scenarios: 
    // 1) a mistake in recreating the sequence thus far shown
    // 2) clicking the incorrect color for the last color shown

    // as we check with each button click, the user pattern is checked as it is entered
    // 
    // click, check userPattern[0], click, check userPattern[1], click, ... until the 
    // length of userPattern equals that of simonPattern, meaning that the level is complete
    
    // check if the latest click matches the cooresponding color in simonPattern
    if (userPattern[latestIndex] === simonPattern[latestIndex]) {
        // if they match, check if the level is complete
        if (userPattern.length === simonPattern.length) {
            // if so, reset the user pattern as it must be recreated from the beginning 
            // with the new color shown
            userPattern = [];
            // call nextSequence() to select, show, and store the new color in simonPattern
            // .5s delay to make the transition from one level to the next easier to see
            setTimeout(nextSequence, 500);
        }
        // if the level is not complete, await the next click
        
    } else {
        // update the h1 element
        $("h1").text("Game Over! Press Any Key to Restart.");
        // play error sound
        playSound("wrong");
        // apply .game-over to the body of the website
        $("body").addClass("game-over");
        // remove .game-over from the body of the website after 200ms
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200)

        // reset level, simonPattern, userPattern, and started
        level = 0;
        simonPattern = [];
        userPattern = [];
        started = false;
    }
}