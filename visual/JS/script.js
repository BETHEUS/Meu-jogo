// Objeto do aplicativo de quiz
const quizApp = {
    questions: [],
    currentQuestionIndex: 0,
    currentCategory: 'portugues',
    score: 0,
    timerDuration: 30,
    timerInterval: null,

    // Método de inicialização do aplicativo
    init() {
        document.getElementById('startButton').addEventListener('click', this.startGame.bind(this));
        document.getElementById('changeCategory').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.startGame();
        });
        document.getElementById('restartButton').addEventListener('click', this.restartGame.bind(this));
    },

    // Método para iniciar o jogo
    startGame() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        this.loadQuestions(this.currentCategory);
    },

    // Método para carregar perguntas
    loadQuestions(category) {
        fetch(`data/${category}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar as perguntas.');
                }
                return response.json();
            })
            .then(data => {
                this.questions = data.questions || data;
                this.currentQuestionIndex = 0;
                this.displayQuestion();
                this.updateQuestionCounter();
                this.startTimer(this.timerDuration); // Inicia o temporizador após carregar as perguntas
            })
            .catch(error => {
                console.error('Erro:', error);
                this.finalizarJogo();
            });
    },

    // Método para exibir a pergunta atual
    displayQuestion() {
        const questionEl = document.getElementById('question');
        const choicesEl = document.getElementById('choices');
        const submitButton = document.getElementById('submit');

        questionEl.innerHTML = '';
        choicesEl.innerHTML = '';
        document.getElementById('result').textContent = '';

        if (this.currentQuestionIndex < this.questions.length) {
            const currentQuestion = this.questions[this.currentQuestionIndex];

            if (currentQuestion.text) {
                const textEl = document.createElement('p');
                textEl.textContent = currentQuestion.text;
                questionEl.appendChild(textEl);
            }

            const questionTextEl = document.createElement('p');
            questionTextEl.textContent = currentQuestion.question;
            questionEl.appendChild(questionTextEl);

            currentQuestion.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice;
                button.className = 'choice';
                button.addEventListener('click', () => this.selectChoice(choice, currentQuestion.answer));
                choicesEl.appendChild(button);
            });

            submitButton.style.display = 'block';
        } else {
            this.finalizarJogo();
        }
    },

    // Método para selecionar uma escolha
    selectChoice(choice, correctAnswer) {
        const resultEl = document.getElementById('result');
        const submitButton = document.getElementById('submit');

        if (choice === correctAnswer) {
            resultEl.textContent = 'Correto!';
            resultEl.className = 'correct';
            this.score++;
        } else {
            resultEl.textContent = 'Errado!';
            resultEl.className = 'incorrect';
        }

        submitButton.onclick = () => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
                clearInterval(this.timerInterval); // Limpa o temporizador anterior
                this.startTimer(this.timerDuration); // Inicia um novo temporizador para a próxima pergunta
                this.updateQuestionCounter(); // Atualiza o contador de perguntas
            } else {
                this.finalizarJogo();
            }
        };
    },

    // Método para iniciar o temporizador
    startTimer(duration) {
        let time = duration;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Tempo: ${time}`;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            time--;
            timerElement.textContent = `Tempo: ${time}`;
            if (time <= 0) {
                clearInterval(this.timerInterval);
                this.finalizarJogo();
            }
        }, 1000);
    },

    // Método para atualizar o contador de perguntas
    updateQuestionCounter() {
        const counterElement = document.getElementById('questionCounter');
        counterElement.textContent = `Pergunta ${this.currentQuestionIndex + 1} de ${this.questions.length}`;
    },

    // Método para finalizar o jogo
    finalizarJogo() {
        clearInterval(this.timerInterval);
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('endScreen').style.display = 'block';
        document.getElementById('finalScore').textContent = `Seu Score: ${this.score}`;
    },

    // Método para reiniciar o jogo
    restartGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        document.getElementById('endScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('timer').textContent = '';
    }
};

// Inicializa o aplicativo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    quizApp.init();
});
