import { auth, db, googleProvider } from './firebase-config.js';
import { submitQuiz, startQuiz, showPreviousQuestion, showNextQuestion, showReview, shareResults, showQuestion } from './quiz.js';
import { updateUserStats, updatePerformanceChart, updateCategoryCount } from './updateCharts.js';
import { Elements } from './elements.js';
import { AppState } from './appState.js';
import { setupEventListeners } from './eventListeners.js';
import { navigateTo } from './navigate.js';
import { showToast } from './toast.js';
import { QuizAPI } from './quiz-api.js';
import { loginUser, registerUser, loginWithGoogle, logoutUser, showLoginForm, showRegisterForm } from './auth.js';

// Export for use in other modules
export { auth, db, googleProvider, AppState };

document.addEventListener('DOMContentLoaded', () => {
    console.log("Quiz Application starting...");
    initApp();
});

// Initialize the application
const initApp = () => {
    console.log("Initializing app...");
    
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        Elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            Elements.loadingScreen.style.display = 'none';
            Elements.mainContainer.style.display = 'block';
            console.log("App initialized!");
            
            // Check auth state
            checkAuthState();
            
            // Set up event listeners
            setupEventListeners();
            
            // Load categories
            loadCategories();
        }, 500);
    }, 1500);
};

// Check authentication state
const checkAuthState = () => {
    console.log("Checking authentication state...");
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log(`User signed in: ${user.email}`);
            AppState.currentUser = user;
            
            // Update UI for logged in user
            Elements.userNameDisplay.textContent = user.displayName || user.email.split('@')[0];
            Elements.userGreeting.textContent = user.displayName || user.email.split('@')[0];
            Elements.userMenu.style.display = 'block';
            
            // Update user stats
            updateUserStats();
            
            // Navigate to home page
            navigateTo('home');
            
            // Show welcome toast
            showToast(`Welcome back, ${user.displayName || 'QuizMaster'}!`, 'success');
        } else {
            // User is signed out
            console.log("No user signed in");
            AppState.currentUser = null;
            
            // Update UI for guest
            Elements.userNameDisplay.textContent = 'Guest';
            Elements.userGreeting.textContent = 'Guest';
            Elements.userMenu.style.display = 'none';
            
            // Navigate to auth page
            navigateTo('auth');
        }
    });
};

// Load categories into the grid
const loadCategories = () => {
    console.log("Loading categories...");
    
    const categories = QuizAPI.getAllCategories();
    Elements.categoryGrid.innerHTML = '';
    
    categories.forEach((category) => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        if (category.id === AppState.quizSettings.category) {
            button.classList.add('active');
        }
        
        button.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        button.dataset.categoryId = category.id;
        
        button.addEventListener('click', () => {
            // Remove active class from all category buttons
            document.querySelectorAll('.category-btn').forEach((btn) => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update app state
            AppState.quizSettings.category = category.id;
            AppState.currentQuiz.categoryName = category.name;
            
            console.log(`Category selected: ${category.name} (ID: ${category.id})`);
            
            // Update question count for this category
            updateCategoryCount(category.id);
        });
        
        Elements.categoryGrid.appendChild(button);
    });
    
    console.log(`Loaded ${categories.length} categories`);
};

console.log("Quiz APplication is ready!");