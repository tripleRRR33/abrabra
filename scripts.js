let questions = [];
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.sort(() => Math.random() - 0.5); // Mélange des questions
        startQuiz();
    });

let currentQuestionIndex = 0;
let score = 0;
let timer;

function startQuiz() {
    showQuestion();
    updateProgressBar();
}

function showQuestion() {
    const questionContainer = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const timerElement = document.getElementById('time');
    const explanationElement = document.getElementById('explanation');

    clearInterval(timer);
    timerElement.textContent = 15;

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';
    explanationElement.classList.add('hidden');

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.addEventListener('click', () => selectAnswer(answer.correct, currentQuestion.explanation));
        answersContainer.appendChild(button);
    });

    timer = setInterval(() => {
        timerElement.textContent--;
        if (timerElement.textContent == 0) {
            clearInterval(timer);
            showExplanation(false, "Temps écoulé !");
        }
    }, 1000);
}

function selectAnswer(isCorrect, explanation) {
    const explanationElement = document.getElementById('explanation');
    const answersButtons = document.querySelectorAll('#answers button');

    clearInterval(timer);

    answersButtons.forEach((button) => {
        button.disabled = true;
        if (button.textContent === explanation) {
            button.classList.add('correct');
        } else if (!isCorrect) {
            button.classList.add('wrong');
        }
    });

    explanationElement.textContent = explanation;
    explanationElement.classList.remove('hidden');

    if (isCorrect) score++;
    document.getElementById('score').textContent = score;

    setTimeout(nextQuestion, 3000);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateProgressBar();
        showQuestion();
    } else {
        alert(`Quiz terminé ! Score final : ${score}`);
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
}
