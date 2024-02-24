document.addEventListener('DOMContentLoaded', () => {
    const knowledgeAreas = document.querySelectorAll('.area-btn');
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const answerOptionsElement = document.getElementById('answer-options');
    const feedbackElement = document.getElementById('feedback');
    const nextQuestionButton = document.getElementById('next-question');
    const nameModal = document.getElementById('name-modal');
    const playerNameInput = document.getElementById('player-name');
    const submitNameButton = document.getElementById('submit-name');
    const startOverButton = document.getElementById('start-over');

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let playerName = '';

    knowledgeAreas.forEach(button => {
        button.addEventListener('click', function() {
            const area = this.getAttribute('data-area');
            fetch(area + '.json')
                .then(response => response.json())
                .then(data => {
                    currentQuestions = data[area];
                    currentQuestionIndex = 0;
                    score = 0;
                    displayQuestion();
                });
            quizContainer.style.display = 'block';
            nameModal.style.display = 'block';
        });
    });

    submitNameButton.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        if (playerName !== '') {
            nameModal.style.display = 'none';
            startOverButton.style.display = 'inline';
            displayQuestion();
        }
    });

    function displayQuestion() {
        if (currentQuestionIndex < currentQuestions.length) {
            const question = currentQuestions[currentQuestionIndex];
            questionElement.textContent = question.pergunta;
            answerOptionsElement.innerHTML = '';
            question.opcoes.forEach((answer, index) => {
                const li = document.createElement('li');
                li.textContent = answer;
                li.classList.add('answer-option');
                li.addEventListener('click', () => selectAnswer(answer, question.respostaCorreta));
                answerOptionsElement.appendChild(li);
            });
            nextQuestionButton.style.display = 'none';
            feedbackElement.textContent = '';
        } else {
            feedbackElement.textContent = 'Fim do quiz! Sua pontuação: ' + score;
            nextQuestionButton.style.display = 'none';
            updateRanking();
        }
    }

    function selectAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            feedbackElement.textContent = 'Correto!';
            feedbackElement.classList.remove('wrong-answer');
            feedbackElement.classList.add('correct-answer');
            score++;
        } else {
            feedbackElement.textContent = `Errado! A correta é: ${correctAnswer}.`;
            feedbackElement.classList.remove('correct-answer');
            feedbackElement.classList.add('wrong-answer');
        }
        nextQuestionButton.style.display = 'inline';
        nextQuestionButton.textContent = currentQuestionIndex < currentQuestions.length - 1 ? 'Próxima Pergunta' : 'Ver Ranking';
        nextQuestionButton.onclick = () => {
            currentQuestionIndex++;
            displayQuestion();
        };
    }

    startOverButton.addEventListener('click', () => {
        quizContainer.style.display = 'none';
        nameModal.style.display = 'none';
        startOverButton.style.display = 'none';
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        playerNameInput.value = '';
    });

    function updateRanking() {
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        rankings.push({ name: playerName, score });
        rankings.sort((a, b) => b.score - a.score);
        rankings = rankings.slice(0, 5);
        localStorage.setItem('rankings', JSON.stringify(rankings));

        feedbackElement.innerHTML = 'Ranking:<br>' + rankings.map((r, index) => `${index + 1}. ${r.name} - ${r.score}`).join('<br>');
        startOverButton.style.display = 'inline';
        nextQuestionButton.style.display = 'none';
    }
});
