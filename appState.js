// Main App State
export const AppState = {
    currentUser: null,
    currentPage: 'auth',
    quizSettings: {
        category: 9,
        difficulty: 'medium',
        questionCount: 10
    },
    currentQuiz: {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: null,
        timer: null,
        timeLeft: 30,
        categoryName: 'General Knowledge'
    },
    userStats: {
        totalQuizzes: 0,
        bestScore: 0,
        averageScore: 0,
        totalTime: 0
    }
};