import { loadLeaderboard, updateDashboard, updateHomePage } from "./updatePage.js";
import { Elements } from "./elements.js";
import { AppState } from "./appState.js";


// Navigation function
export const navigateTo = (page) => {
    console.log(`📍 Navigating to: ${page}`);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach((pageElement) => {
        pageElement.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    switch(page) {
        case 'auth':
            Elements.authSection.classList.add('active');
            break;
            
        case 'home':
            Elements.homeSection.classList.add('active');
            Elements.homeBtn.classList.add('active');
            updateHomePage();
            break;
            
        case 'quiz':
            Elements.quizSection.classList.add('active');
            break;
            
        case 'results':
            Elements.resultsSection.classList.add('active');
            break;
            
        case 'dashboard':
            Elements.dashboardSection.classList.add('active');
            Elements.dashboardBtn.classList.add('active');
            updateDashboard();
            break;
            
        case 'leaderboard':
            Elements.leaderboardSection.classList.add('active');
            Elements.leaderboardBtn.classList.add('active');
            loadLeaderboard('all');
            break;
    }
    
    AppState.currentPage = page;
};