// As system, it will generate a math problem and present to both users
// Javascript and jQuery goes here
$("#signOut").on('click',function(event){
        firebase.auth().signOut();
        window.location.assign("https://afternoon-fortress-64926.herokuapp.com/index.html");
    });

$('#start').on('click', function(){
    $('#start').remove();
    $('#subwrapper').html("<h2>Fill the value for X and submit your answer</h2>");
    game.loadQuestion();
});

var userAnswer;
var numberAnswer;
$(document).on('click', '#submitAnswer', function(e){
    
    userAnswer = $('#button-3').val().trim();
    numberAnswer = parseInt(userAnswer);
    game.clicked(e);
})

$(document).on('click', '#reset', function(){
    game.reset();
})

var questions = [{
        question: "13 + 7 = x",
        answers: ["1", "7", "14", "20"],
        correctAnswer: "20"
    }, {
        question: "11 -7 - 1 - 2 = x",
        answers: ["4", "24", "14", "1"],
        correctAnswer: "1"
    }, {
        question: "9 - 2 * 11 = x",
        answers: ["-13", "5", "14", "1"],
        correctAnswer: "-13"
    }, {
        question: "4(8 + 10) = x",
        answers: ["84", "48", "64", "72"],
        correctAnswer: "72"
    }, {
        question: "10 /(3 - 2) = x",
        answers: ["-1", "2", "10", "1"],
        correctAnswer: "10"
    }, {
        question: "9 * 3 + 5 = x",
        answers: ["7", "2", "6", "5"],
        correctAnswer: "32"
    }, {
        question: "x(4 + 5) = 3 * 4 + 3 * 5",
        answers: ["8", "3", "6", "12"],
        correctAnswer: "3"
    }, {
        question: "33/11 = x",
        answers: ["9", "13", "3", "5"],
        correctAnswer: "3",
    }, {
        question: "9 * 1/9 = x",
        answers: ["11", "1", "3", "9"],
        correctAnswer: "1"
    }, {
        question: "10 * 5 * 5 = X",
        answers: ["5", "250", "14", "10"],
        correctAnswer: "250"
    }];


var game = {
    questions: questions,
    currentQuestion:0,
    counter:30,
    correct:0,
    incorrect:0,
    unanswered:0,
    countdown: function(){
        game.counter--;
        $('#counter').html(game.counter);
        if(game.counter <= 0){
            console.log("TIME UP!");
            game.timeUp();
        }

    },
    loadQuestion: function(){
        timer = setInterval(game.countdown, 1000);

        $('#subwrapper').html("<h2 id='counter'>30</h2>")
        $('#subwrapper').append('<h2>' + questions[game.currentQuestion].question + '</h2>');
                                    // or
        // $('#subwrapper').html('<h2>' + questions[game.currentQuestion].question + '</h2>');

            for(var i =3; i<questions[game.currentQuestion].answers.length;i++){
                $('#subwrapper').append('<input type="number" id="button-'+i+'"">'+'<button id="submitAnswer">'+"Submit Answer"+'</button>');
            }

    },
    nextQuestion: function(){
        game.counter = 30;
        $('#counter').html(game.counter);
        game.currentQuestion++;
        game.loadQuestion();


    },
    timeUp: function(){
        clearInterval(timer);
        game.unanswered++;
        $('#subwrapper').html('<h2>OUT OF TIME!</h2>');
        $('#subwrapper').append('<h3>The Correct Answer Was: '+questions[game.currentQuestion].correctAnswer+ '</h3>');
            if(game.currentQuestion==questions.length-1){
                    setTimeout(game.results,3*1000);
                } else {
                    setTimeout(game.nextQuestion,3*1000);
                }
    },
    results: function(){
        clearInterval(timer);
        $('#subwrapper').html("<h2>ALL DONE!</h2>");
        $('#subwrapper').append("Correct: "+game.correct);
        $('#subwrapper').append("<br>Incorrect: "+game.incorrect);
        $('#subwrapper').append("<br>Unanswered: "+game.unanswered);
        // $('#subwrapper').append("<br><button id='reset'>RESET</button>")
//this data variable we are saving in window
        var saveObject = {
            email: window.currentUser.email,
            points: game.correct
        }
// Then saveObject is set() to the data to be added
//I'm using the currentUser.uid to grab the current. 
//I had error when use window.currentUser.email can't read as sting when grabbing '@', 'period(.)'
//We reference from database to grab other uid from other user 
      firebase.database().ref('score/' + window.currentUser.uid).set(saveObject).then(()=>{
    
        firebase.database().ref('score/').once('value').then(function(snapshot) {
            
            var stuff = snapshot.val();
            var newArray = [];

            var keys = Object.keys(stuff);
            keys.forEach((item)=>{
                newArray.push(stuff[item]);
            });

            newArray.sort(function (a, b) {
                return b.points - a.points;
            });
//This adding a table to for leader score board.
            console.log(newArray)
            var newTable = '<table style="width:100%"><tr><th>Rank</th><th>Email</th><th>Points</th></tr>'
                newArray.forEach((item, index)=>{
                    
                    
                    if (item.email == window.currentUser.email){
                        newTable += '<tr class="selectuser">';    
                    } else {
                        newTable += '<tr>' ;   
                    }
                    newTable += '<td>' + (index + 1) + '</td>';
                    newTable += '<td>' + item.email + '</td>';
                    newTable += '<td>' + item.points + '</td>';
                    newTable += '</tr>';
                })
                newTable += '</table>';
                $('#leaderboard').append(newTable) ;          
  
    });
});

    },
    clicked: function(e){
        clearInterval(timer);
        if(numberAnswer==questions[game.currentQuestion].correctAnswer){
            game.answeredCorrectly();
        } else {
            game.answeredIncorrectly();
        }

    },
    answeredCorrectly: function(){
            console.log("YOU GOT IT!");
            clearInterval(timer);
            game.correct++;
            $('#subwrapper').html('<h2>YOU GOT IT RIGHT!</h2');
            if(game.currentQuestion==questions.length-1){
                setTimeout(game.results,3*1000);
            } else {
                setTimeout(game.nextQuestion,3*1000);
            }
    },
    answeredIncorrectly: function(){
            console.log("WRONG");
            clearInterval(timer);
            game.incorrect++;
            $('#subwrapper').html('<h2>YOU GOT IT WRONG!</h2');
            $('#subwrapper').append('<h3>The Correct Answer Was: '+questions[game.currentQuestion].correctAnswer+ '</h3>');
            if(game.currentQuestion==questions.length-1){
                setTimeout(game.results,3*1000);
            } else {
                setTimeout(game.nextQuestion,3*1000);
            }
    },
    reset: function(){
        game.currentQuestion =0;
        game.counter = 30;
        game.correct = 0;
        game.incorrect = 0;
        game.unanswered = 0;
        game.loadQuestion();
    }
}

setTimeout(function(){
    var temp = currentUser.email;
    var temp2 = currentUser['email'];
    console.log(temp);
    console.log(temp2);
    $("#currentplayer").append(temp2);
},2000)
