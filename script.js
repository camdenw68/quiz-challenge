var timer = 60; // Initial time in seconds

function startQuiz() {
    // Hide the start button
    var startBtn = document.getElementById("startBtn");
    startBtn.style.display = "none";

    // Show the questions and center the answer buttons
    var questionElement = document.getElementById("question");
    questionElement.style.display = "block";

    var answerButtons = document.querySelectorAll('.btn[id^="choice"]');
    answerButtons.forEach(function (button) {
        button.style.display = "block";
        button.style.margin = "auto"; 
        button.onclick = function () {
            var choiceIndex = parseInt(button.id.slice(-1));
            var selectedChoice = quiz.getCurrentQuestion().choices[choiceIndex];
            quiz.guess(selectedChoice);
            QuizAns.displayNext();
        };
    });

    // Show score, progress, and timer
    var scoreElement = document.getElementById("score");
    scoreElement.style.display = "block";

    var progressElement = document.getElementById("progress");
    progressElement.style.display = "block";

    var timerElement = document.getElementById("timer");
    timerElement.style.display = "block";

    // Set up timer
    var timerInterval = setInterval(function () {
        timerElement.innerHTML = "Time: " + timer + "s";
        timer--;
        if (timer < 0) {
            clearInterval(timerInterval);
            // Handle when time runs out (e.g., end quiz)
            QuizAns.displayScore();
        }
    }, 1000);

    // Display the first question
    QuizAns.displayNext();
}

function Quiz(questions) {
    this.score = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.guess = function (answer) {
    if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.currentQuestionIndex++;
};

Quiz.prototype.getCurrentQuestion = function () {
    return this.questions[this.currentQuestionIndex];
};

Quiz.prototype.hasEnded = function () {
    return this.currentQuestionIndex >= this.questions.length;
};

function Question(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
}

Question.prototype.isCorrectAnswer = function (choice) {
    return this.answer === choice;
}

var QuizAns = {
    displayNext: function () {
        if (quiz.hasEnded()) {
            this.displayScore();
        } else {
            this.displayQuestion();
            this.displayChoices();
            this.displayProgress();
        }
    },
    displayQuestion: function () {
        this.populateIdWithHTML("question", quiz.getCurrentQuestion().text);
    },
    displayChoices: function () {
        var choices = quiz.getCurrentQuestion().choices;

        for (var i = 0; i < choices.length; i++) {
            this.populateButtonWithHTML("choice" + i, choices[i]);
            this.guessHandler("choice" + i, choices[i]);
        }
    },
    displayScore: function () {
        var gameOverHTML = "<h2>Your score is: " + quiz.score + " / " + quiz.questions.length + "</h2>";
        this.populateIdWithHTML("score", gameOverHTML);

        // Display the Save Score button
        var saveScoreBtn = document.createElement("button");
        saveScoreBtn.id = "saveScoreBtn";
        saveScoreBtn.textContent = "Save Score";
        saveScoreBtn.onclick = saveScore;
        document.body.appendChild(saveScoreBtn);
    },
    populateIdWithHTML: function (id, text) {
        var element = document.getElementById(id);
        element.innerHTML = text;
    },
    populateButtonWithHTML: function (id, text) {
        var button = document.getElementById(id);
        button.innerHTML = text;
    },
   
    guessHandler: function (id, guess) {
        var button = document.getElementById(id);
        button.onclick = function () {
            // Subtract 10 seconds for wrong answers
            if (!quiz.getCurrentQuestion().isCorrectAnswer(guess)) {
                timer -= 10;
                if (timer < 0) {
                    timer = 0; // Ensure timer doesn't go below 0
                }
            }
            quiz.guess(guess);
            QuizAns.displayNext();
        };
    },
    displayProgress: function () {
        var currentQuestionNumber = quiz.currentQuestionIndex + 1;
        this.populateIdWithHTML("progress", "Question " + currentQuestionNumber + " of " + quiz.questions.length);
    },
};

// questions
var questions = [
    new Question("What does HTML stand for?", ["Hypertext Markup Language", "Hyper Making Long", "Huge text maker license", "Hypertext Marking language"], "Hypertext Markup Language"),
    new Question("What does CSS stand for?", ["Cascading Style Sheets", "creative style sheets", "conserve style sheets", "console style sheets"], "Cascading Style Sheets"),
    new Question("How do you say or in JavaScript?", ["or", "||", "OR", "//"], "||"),
    new Question("How do you say and in JavaScript?", ["and", "also", "&&", "**"], "&&"),
    new Question("In JavaScript, what can make something repeat itself?", ["nothing", "and statements", "loops", "repeating it"], "loops")
];

// create quiz
var quiz = new Quiz(questions);
let check = true;
// save score and initals
function saveScore() {
    var initials = prompt("Enter your initials:");

    if (initials) {
        var savedScores = JSON.parse(localStorage.getItem("quizScores")) || [];
        savedScores.push({ initials: initials, score: quiz.score });
        localStorage.setItem("quizScores", JSON.stringify(savedScores));
        alert("Score saved successfully!");
    }
}
document.getElementById("startBtn").addEventListener("click", startQuiz);
