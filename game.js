const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressbarfull = document.getElementById("progressbarfull");
console.log(choices);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [

];
fetch(
  "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple"
)
  .then(res => {
    console.log(res);
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);


    questions = loadedQuestions.results.map((loadedQuestions) => {
      const formattedQuestion = {
        question: loadedQuestions.question
      };
      const answerChoices = [...loadedQuestions.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 10) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestions.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;

      // questions = loadedQuestions;

    })
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS

const CORRECT_BONUS = 10;
const NEGATIVE_BONUS = 5;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  // console.log(availableQuesions);
  getNewQuestion();
};
getNewQuestion = () => {
  if (availableQuesions.length == 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = ` Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progressBar
  console.log((questionCounter / MAX_QUESTIONS) * 100);
  progressbarfull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    let classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply == "correct") {
      incrementScore(CORRECT_BONUS);
    } else if (classToApply == "incorrect") {
      decrementScore(NEGATIVE_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
decrementScore = num => {
  score -= num;
  scoreText.innerText = score;
}
