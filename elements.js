export const Elements = {
    // Loading screen
    loadingScreen: document.getElementById('loading-screen'),
    mainContainer: document.getElementById('main-container'),
    
    // Navigation
    homeBtn: document.getElementById('home-btn'),
    dashboardBtn: document.getElementById('dashboard-btn'),
    leaderboardBtn: document.getElementById('leaderboard-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userMenu: document.getElementById('user-menu'),
    userNameDisplay: document.getElementById('user-name-display'),
    
    // Pages
    authSection: document.getElementById('auth-section'),
    homeSection: document.getElementById('home-section'),
    quizSection: document.getElementById('quiz-section'),
    resultsSection: document.getElementById('results-section'),
    dashboardSection: document.getElementById('dashboard-section'),
    leaderboardSection: document.getElementById('leaderboard-section'),
    
    // Auth elements
    loginCard: document.getElementById('login-card'),
    registerCard: document.getElementById('register-card'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    registerName: document.getElementById('register-name'),
    registerEmail: document.getElementById('register-email'),
    registerPassword: document.getElementById('register-password'),
    registerConfirmPassword: document.getElementById('register-confirm-password'),
    registerBtn: document.getElementById('register-btn'),
    googleLoginBtn: document.getElementById('google-login-btn'),
    showRegisterBtn: document.getElementById('show-register-btn'),
    showLoginBtn: document.getElementById('show-login-btn'),
    loginError: document.getElementById('login-error'),
    registerError: document.getElementById('register-error'),
    
    // Home elements
    userGreeting: document.getElementById('user-greeting'),
    totalQuestions: document.getElementById('total-questions'),
    totalPlayers: document.getElementById('total-players'),
    userBestScore: document.getElementById('user-best-score'),
    categoryGrid: document.getElementById('category-grid'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    countBtns: document.querySelectorAll('.count-btn'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    
    // Quiz elements
    quizCategory: document.getElementById('quiz-category'),
    quizDifficulty: document.getElementById('quiz-difficulty'),
    progressFill: document.getElementById('progress-fill'),
    currentQuestionNum: document.getElementById('current-question-num'),
    totalQuestionsNum: document.getElementById('total-questions-num'),
    quizTimer: document.getElementById('quiz-timer'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    prevQuestionBtn: document.getElementById('prev-question-btn'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    submitQuizBtn: document.getElementById('submit-quiz-btn'),
    
    // Results elements
    finalScoreText: document.getElementById('final-score-text'),
    resultsMessage: document.getElementById('results-message'),
    correctAnswers: document.getElementById('correct-answers'),
    totalQuestionsResult: document.getElementById('total-questions-result'),
    timeTaken: document.getElementById('time-taken'),
    resultDifficulty: document.getElementById('result-difficulty'),
    resultCategory: document.getElementById('result-category'),
    reviewQuizBtn: document.getElementById('review-quiz-btn'),
    newQuizBtn: document.getElementById('new-quiz-btn'),
    shareResultsBtn: document.getElementById('share-results-btn'),
    backToResultsBtn: document.getElementById('back-to-results-btn'),
    reviewContainer: document.getElementById('review-container'),
    answersReview: document.getElementById('answers-review'),
    
    // Dashboard elements
    dashboardStats: document.getElementById('dashboard-stats'),
    quizHistory: document.getElementById('quiz-history'),
    performanceChart: document.getElementById('performance-chart'),
    
    // Leaderboard elements
    leaderboardFilters: document.querySelectorAll('.filter-btn'),
    leaderboardEntries: document.getElementById('leaderboard-entries')
};