// Set up all event listeners
import { 
    loginUser, 
    registerUser, 
    loginWithGoogle, 
    logoutUser,
    showLoginForm,
    showRegisterForm
} from './auth.js';
import { Elements } from './elements.js';
import { navigateTo } from './navigate.js';
import { 
    startQuiz,
    showPreviousQuestion,
    showReview,
    shareResults,
    showNextQuestion,
    submitQuiz
} from './quiz.js';
import { AppState } from './appState.js';
import { loadLeaderboard } from './updatePage.js';

export const setupEventListeners = () => {
    console.log("Setting up event listeners...");
    
    // Navigation buttons
    Elements.homeBtn.addEventListener('click', () => navigateTo('home'));
    Elements.dashboardBtn.addEventListener('click', () => navigateTo('dashboard'));
    Elements.leaderboardBtn.addEventListener('click', () => navigateTo('leaderboard'));
    Elements.logoutBtn.addEventListener('click', logoutUser);
    
    // Auth buttons
    Elements.loginBtn.addEventListener('click', loginUser);
    Elements.registerBtn.addEventListener('click', registerUser);
    Elements.googleLoginBtn.addEventListener('click', loginWithGoogle);
    Elements.showRegisterBtn.addEventListener('click', showRegisterForm);
    Elements.showLoginBtn.addEventListener('click', showLoginForm);
    
    // Password visibility toggles
    document.querySelectorAll('.toggle-password').forEach((btn) => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Quiz settings
    Elements.startQuizBtn.addEventListener('click', startQuiz);
    
    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            AppState.quizSettings.difficulty = this.dataset.difficulty;
            console.log(`Difficulty set to: ${AppState.quizSettings.difficulty}`);
        });
    });
    
    // Question count buttons
    document.querySelectorAll('.count-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.count-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            AppState.quizSettings.questionCount = parseInt(this.dataset.count);
            console.log(`Question count set to: ${AppState.quizSettings.questionCount}`);
        });
    });
    
    // Quiz navigation
    Elements.prevQuestionBtn.addEventListener('click', showPreviousQuestion);
    Elements.nextQuestionBtn.addEventListener('click', showNextQuestion);
    Elements.submitQuizBtn.addEventListener('click', submitQuiz);
    
    // Results buttons
    Elements.reviewQuizBtn.addEventListener('click', showReview);
    Elements.newQuizBtn.addEventListener('click', () => navigateTo('home'));
    Elements.shareResultsBtn.addEventListener('click', shareResults);
    Elements.backToResultsBtn.addEventListener('click', () => {
        Elements.reviewContainer.style.display = 'none';
    });
    
    // Leaderboard filters
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            loadLeaderboard(this.dataset.filter);
        });
    });
    
    // Footer links
    document.getElementById('github-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://github.com/Vicky-code-glitch/cerebrum', '_blank');
    });
    
    console.log("Event listeners set up!");
};