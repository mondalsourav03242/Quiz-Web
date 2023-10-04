const highScoreslist = document.getElementById("highScoreslist");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

console.log(highScores);
highScoreslist.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} score is ${score.score}</li>`;
  })
  .join("");
