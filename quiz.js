import { navigateTo } from "./navigate.js";
import { Elements } from "./elements.js";
import { showToast } from "./toast.js";
import { updateLeaderboard } from "./updatePage.js";
import { QuizAPI } from "./quiz-api.js";
import { auth, db } from "./firebase-config.js";
import { AppState } from "./appState.js";

// Reset timer
const resetTimer = () => {
    AppState.currentQuiz.timeLeft = 30;
    Elements.quizTimer.textContent = AppState.currentQuiz.timeLeft;
    Elements.quizTimer.style.color = 'var(--danger)';
};

// Start timer
const startTimer = () => {
    if (AppState.currentQuiz.timer) {
        clearInterval(AppState.currentQuiz.timer);
    }
    
    resetTimer();
    
    AppState.currentQuiz.timer = setInterval(() => {
        AppState.currentQuiz.timeLeft--;
        Elements.quizTimer.textContent = AppState.currentQuiz.timeLeft;
        
        // Change color when time is running low
        if (AppState.currentQuiz.timeLeft <= 10) {
            Elements.quizTimer.style.color = 'var(--danger)';
        }
        
        if (AppState.currentQuiz.timeLeft <= 0) {
            clearInterval(AppState.currentQuiz.timer);
            if (AppState.currentQuiz.currentQuestionIndex < AppState.currentQuiz.questions.length - 1) {
                // Auto-advance to next question
                showNextQuestion();
            } else {
                // Auto-submit quiz
                submitQuiz();
            }
        }
    }, 1000);
};

// Save quiz results to Firestore
const saveQuizResults = async (score, correctCount, timeTaken) => {
    try {
        console.log("💾 Saving quiz results...");
        
        const quizData = {
            userId: AppState.currentUser.uid,
            userName: AppState.currentUser.displayName || AppState.currentUser.email,
            category: AppState.currentQuiz.categoryName,
            difficulty: AppState.quizSettings.difficulty,
            score: score,
            correctAnswers: correctCount,
            totalQuestions: AppState.currentQuiz.questions.length,
            timeTaken: timeTaken,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        

        console.log(quizData.totalQuestions)
        // Save quiz result
        await db.collection('quizResults').add(quizData);
        
        // Update user stats
        const userRef = db.collection('users').doc(AppState.currentUser.uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const totalQuizzes = (userData.totalQuizzes || 0) + 1;
            const bestScore = Math.max(userData.bestScore || 0, score);
            const totalTime = (userData.totalTime || 0) + timeTaken;
            
            // Calculate average score
            const averageScore = Math.round(
                ((userData.averageScore || 0) * (totalQuizzes - 1) + score) / totalQuizzes
            );
            
            await userRef.update({
                totalQuizzes: totalQuizzes,
                bestScore: bestScore,
                averageScore: averageScore,
                totalTime: totalTime,
                lastQuiz: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log("User stats updated");
            
            // Update leaderboard
            updateLeaderboard(score);
        }
        
    } catch (error) {
        console.error("Error saving quiz results:", error);
    }
};

export const submitQuiz = () => {
    console.log("📤 Submitting quiz...");
    
    if (AppState.currentQuiz.timer) {
        clearInterval(AppState.currentQuiz.timer);
    }
    
    // Calculate score
    let correctCount = 0;
    AppState.currentQuiz.questions.forEach((question, index) => {
        if (AppState.currentQuiz.userAnswers[index] === question.correct_answer) {
            correctCount++;
        }
    });
    
    const score = Math.round((correctCount / AppState.currentQuiz.questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - AppState.currentQuiz.startTime) / 1000);
    
    console.log(`📊 Quiz Results: ${correctCount}/${AppState.currentQuiz.questions.length} (${score}%) in ${timeTaken}s`);
    
    // Update results UI
    Elements.finalScoreText.textContent = score;
    Elements.correctAnswers.textContent = correctCount;
    Elements.totalQuestionsResult.textContent = AppState.currentQuiz.questions.length;
    Elements.timeTaken.textContent = `${timeTaken}s`;
    Elements.resultDifficulty.textContent = AppState.quizSettings.difficulty.charAt(0).toUpperCase() + AppState.quizSettings.difficulty.slice(1);
    Elements.resultCategory.textContent = AppState.currentQuiz.categoryName;
    
    // Update progress circle
    const circle = document.querySelector('.circle-progress');
    if (circle) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    // Set results message
    let message = '';
    let emoji = '';
    
    if (score >= 90) {
        message = 'Outstanding! You\'re a quiz master!';
        emoji = '🏆';
    } else if (score >= 70) {
        message = 'Excellent! Great job!';
        emoji = '👍';
    } else if (score >= 50) {
        message = 'Good effort! Keep practicing!';
        emoji = '💪';
    } else {
        message = 'Keep learning! You\'ll do better next time!';
        emoji = '📚';
    }
    
    Elements.resultsMessage.textContent = `${message} ${emoji}`;
    
    // Save results to Firestore if user is logged in
    if (AppState.currentUser) {
        saveQuizResults(score, correctCount, timeTaken);
    }
    
    // Navigate to results
    navigateTo('results');
    
    // Show results toast
    showToast(`Quiz completed! Your score: ${score}%`, 'success');
};

// Start quiz
export const startQuiz = async () => {
    console.log("Starting quiz...");
    
    // Check if user is logged in (optional, you can remove this if you want guests to play)
    if (!AppState.currentUser) {
        showToast('Please login to save your quiz results!', 'warning');
        // You can either require login or allow guest play
        // return navigateTo('auth');
    }
    
    // Navigate to quiz page
    navigateTo('quiz');
    
    // Reset quiz state
    AppState.currentQuiz = {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: Date.now(),
        timer: null,
        timeLeft: 30,
        categoryName: QuizAPI.getCategoryById(AppState.quizSettings.category).name
    };
    
    // Update UI
    Elements.quizCategory.textContent = AppState.currentQuiz.categoryName;
    Elements.quizDifficulty.textContent = AppState.quizSettings.difficulty.charAt(0).toUpperCase() + AppState.quizSettings.difficulty.slice(1);
    Elements.totalQuestionsNum.textContent = AppState.quizSettings.questionCount;
    
    // Show loading state
    Elements.questionText.textContent = 'Loading questions...';
    Elements.optionsContainer.innerHTML = '<div class="loading-questions"><i class="fas fa-spinner fa-spin"></i> Loading questions...</div>';
    
    try {
        // Fetch questions from API
        const questions = await QuizAPI.getQuestions(
            AppState.quizSettings.category,
            AppState.quizSettings.difficulty,
            AppState.quizSettings.questionCount
        );
        
        AppState.currentQuiz.questions = questions;
        console.log(`Loaded ${questions.length} questions`);
        
        // Show first question
        showQuestion(0);
        
        // Start timer
        startTimer();
        
    } catch (error) {
        console.error("Error starting quiz:", error);
        showToast('Failed to load questions. Please try again.', 'error');
        navigateTo('home');
    }
};

// Show question
export const showQuestion = (index) => {
    if (index < 0 || index >= AppState.currentQuiz.questions.length) return;
    
    AppState.currentQuiz.currentQuestionIndex = index;
    const question = AppState.currentQuiz.questions[index];
    
    // Update UI
    Elements.currentQuestionNum.textContent = index + 1;
    Elements.questionText.textContent = QuizAPI.decodeHTML(question.question);
    
    // Update progress bar
    const progress = ((index + 1) / AppState.currentQuiz.questions.length) * 100;
    Elements.progressFill.style.width = `${progress}%`;
    
    // Clear previous options
    Elements.optionsContainer.innerHTML = '';
    
    // Combine and shuffle answers
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    const shuffledAnswers = QuizAPI.shuffleArray(allAnswers);
    
    // Create option elements
    shuffledAnswers.forEach((answer) => {
        const decodedAnswer = QuizAPI.decodeHTML(answer);
        const option = document.createElement('div');
        option.className = 'option';
        
        // Check if this answer was previously selected
        if (AppState.currentQuiz.userAnswers[index] === answer) {
            option.classList.add('selected');
        }
        
        option.textContent = decodedAnswer;
        
        option.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach((opt) => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Save user's answer
            AppState.currentQuiz.userAnswers[index] = answer;
        });
        
        Elements.optionsContainer.appendChild(option);
    });
    
    // Update navigation buttons
    Elements.prevQuestionBtn.disabled = index === 0;
    
    if (index === AppState.currentQuiz.questions.length - 1) {
        Elements.nextQuestionBtn.style.display = 'none';
        Elements.submitQuizBtn.style.display = 'flex';
    } else {
        Elements.nextQuestionBtn.style.display = 'flex';
        Elements.submitQuizBtn.style.display = 'none';
    }
    
    // Reset timer for new question
    resetTimer();
    startTimer();
};

// Show previous question
export const showPreviousQuestion = () => {
    showQuestion(AppState.currentQuiz.currentQuestionIndex - 1);
};

// Show next question
export const showNextQuestion = () => {
    showQuestion(AppState.currentQuiz.currentQuestionIndex + 1);
};

// Show answer review
export const showReview = () => {
    console.log("📋 Showing answer review...");
    
    Elements.reviewContainer.style.display = 'block';
    Elements.answersReview.innerHTML = '';
    
    AppState.currentQuiz.questions.forEach((question, index) => {
        const userAnswer = AppState.currentQuiz.userAnswers[index];
        const isCorrect = userAnswer === question.correct_answer;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <h4>Question ${index + 1}</h4>
            <p class="question">${QuizAPI.decodeHTML(question.question)}</p>
            <div class="answer-details">
                <p><strong>Your answer:</strong> <span class="user-answer">${userAnswer ? QuizAPI.decodeHTML(userAnswer) : 'Not answered'}</span></p>
                <p><strong>Correct answer:</strong> <span class="correct-answer">${QuizAPI.decodeHTML(question.correct_answer)}</span></p>
            </div>
            <div class="result-icon">
                ${isCorrect ? '<i class="fas fa-check-circle correct-icon"></i>' : '<i class="fas fa-times-circle incorrect-icon"></i>'}
            </div>
        `;
        
        Elements.answersReview.appendChild(reviewItem);
    });
};

// Share results
export const shareResults = () => {
    const score = Elements.finalScoreText.textContent;
    const category = Elements.resultCategory.textContent;
    const message = `I scored ${score}% on ${category} quiz in Cerebrum - Interactive Quiz Application! Can you beat my score? 🧠`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Results',
            text: message,
            url: window.location.href
        });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(message)
            .then(() => {
                showToast('Results copied to clipboard!', 'success');
            })
            .catch(() => {
                showToast('Failed to copy results.', 'error');
            });
    }
};