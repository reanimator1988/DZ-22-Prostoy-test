let currentQuestionIndex = 0;
const answers = [];
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('/questions');
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        questions = await response.json();
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('Invalid questions data');
        }
        displayQuestions(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function displayQuestions(questions) {
    const container = document.getElementById('questions');
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>${question.caption}</p>
            <button onclick="answerQuestion(${index}, true)" id="yes-${index}">ДА</button>
            <button onclick="answerQuestion(${index}, false)" id="no-${index}">НЕТ</button>
        `;
        container.appendChild(questionElement);
    });
}

async function answerQuestion(questionIndex, userAnswer) {
    try {
        answers[questionIndex] = userAnswer;

        const yesButton = document.getElementById(`yes-${questionIndex}`);
        const noButton = document.getElementById(`no-${questionIndex}`);
        if (userAnswer) {
            yesButton.classList.add('selected');
            noButton.classList.remove('selected');
        } else {
            noButton.classList.add('selected');
            yesButton.classList.remove('selected');
        }

        const areAllAnswered = answers.every(answer => answer !== undefined);
        document.getElementById('check-button').disabled = !areAllAnswered;
    } catch (error) {
        console.error('Error answering question:', error);
    }
}

async function checkAnswers() {
    try {
        const response = await fetch('/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch answers');
        }

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error('Error checking answers:', error);
    }
}

function displayResult(result) {
    const container = document.getElementById('results');
    container.innerHTML = `
        <p>Правильных ответов: ${result.correctCount}</p>
        <p>Неправильных ответов: ${result.incorrectCount}</p>
    `;
}

fetchQuestions();