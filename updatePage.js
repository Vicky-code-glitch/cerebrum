import { Elements } from "./elements.js";
import { AppState } from "./appState.js";
import { db } from "./firebase-config.js";
import { updatePerformanceChart, updateCategoryCount } from "./updateCharts.js";

// Get time ago string
const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
};

// Update home page
export const updateHomePage = async () => {
    console.log("Updating home page...");
    
    // Update player count from Firestore
    try {
        const usersSnapshot = await db.collection('users').get();
        Elements.totalPlayers.textContent = usersSnapshot.size;
    } catch (error) {
        console.error("Error fetching user count:", error);
        Elements.totalPlayers.textContent = '100+';
    }
    
    // Update user's best score if logged in
    if (AppState.currentUser) {
        try {
            const userDoc = await db.collection('users').doc(AppState.currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                Elements.userBestScore.textContent = `${userData.bestScore || 0}%`;
                AppState.userStats = userData;
            }
        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    }
    
    // Update category count
    updateCategoryCount(AppState.quizSettings.category);
};

// Update dashboard
export const updateDashboard = async () => {
    if (!AppState.currentUser) {
        Elements.dashboardStats.innerHTML = '<p class="no-data">Please login to view your dashboard.</p>';
        return;
    }
    
    try {
        // Get user's quiz results
        const snapshot = await db.collection('quizResults')
            .where('userId', '==', AppState.currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        // Update stats cards
        let totalScore = 0;
        let bestScore = 0;
        let totalTime = 0;
        
        // Clear history
        Elements.quizHistory.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            totalScore += data.score;
            bestScore = Math.max(bestScore, data.score);
            totalTime += data.timeTaken;
            
            // Add to history
            const historyItem = document.createElement('div');
            historyItem.className = 'quiz-history-item';
            
            const date = data.timestamp ? data.timestamp.toDate() : new Date();
            const timeAgo = getTimeAgo(date);
            
            historyItem.innerHTML = `
                <div>
                    <h4>${data.category}</h4>
                    <p>${data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)} • ${data.totalQuestions} questions</p>
                </div>
                <div>
                    <span class="score">${data.score}%</span>
                    <p>${timeAgo}</p>
                </div>
            `;
            
            Elements.quizHistory.appendChild(historyItem);
        });
        
        // Update stats display
        const totalQuizzes = snapshot.size;
        const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
        
        // Create stats cards HTML
        Elements.dashboardStats.innerHTML = `
            <div class="user-stat-card">
                <i class="fas fa-trophy"></i>
                <div>
                    <h4>Total Quizzes</h4>
                    <p>${totalQuizzes}</p>
                </div>
            </div>
            <div class="user-stat-card">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Average Score</h4>
                    <p>${averageScore}%</p>
                </div>
            </div>
            <div class="user-stat-card">
                <i class="fas fa-chart-line"></i>
                <div>
                    <h4>Best Score</h4>
                    <p>${bestScore}%</p>
                </div>
            </div>
            <div class="user-stat-card">
                <i class="fas fa-clock"></i>
                <div>
                    <h4>Total Time</h4>
                    <p>${Math.floor(totalTime / 60)}m</p>
                </div>
            </div>
        `;
        
        // Update chart
        if (totalQuizzes > 0) {
            updatePerformanceChart(snapshot);
        }
        
    } catch (error) {
        console.error("Error updating dashboard:", error);
        Elements.dashboardStats.innerHTML = '<p class="no-data">Error loading dashboard data.</p>';
    }
};

// Load leaderboard
export const loadLeaderboard = async (filter) => {
    console.log(`🏆 Loading leaderboard: ${filter}`);
    
    try {
        let query = db.collection('leaderboard').orderBy('bestScore', 'desc').limit(20);
        
        // For demo purposes, we'll show all entries regardless of filter
        // In a real app, you'd filter by date here
        
        const snapshot = await query.get();
        
        // Update top three
        const topPlayers = snapshot.docs.slice(0, 3);
        const topCards = document.querySelectorAll('.top-card');
        
        topCards.forEach((card, index) => {
            if (topPlayers[index]) {
                const data = topPlayers[index].data();
                card.querySelector('h4').textContent = data.userName || 'Player';
                card.querySelector('p').textContent = `Score: ${data.bestScore}%`;
            } else {
                card.querySelector('h4').textContent = 'Player ' + (index + 1);
                card.querySelector('p').textContent = 'Score: 0';
            }
        });
        
        // Update leaderboard list
        Elements.leaderboardEntries.innerHTML = '';
        
        if (snapshot.docs.length === 0) {
            Elements.leaderboardEntries.innerHTML = '<p class="no-data">No leaderboard data yet. Be the first to play!</p>';
            return;
        }
        
        snapshot.docs.slice(3).forEach((doc, index) => {
            const data = doc.data();
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            entry.innerHTML = `
                <div>
                    <span class="rank">${index + 4}</span>
                    <h4>${data.userName || 'Player'}</h4>
                </div>
                <div>
                    <span class="score">${data.bestScore}%</span>
                    <p>Best Score</p>
                </div>
            `;
            Elements.leaderboardEntries.appendChild(entry);
        });
        
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        Elements.leaderboardEntries.innerHTML = '<p class="no-data">Error loading leaderboard.</p>';
    }
};

// Update leaderboard
export const updateLeaderboard = async (score) => {
    try {
        const leaderboardRef = db.collection('leaderboard').doc(AppState.currentUser.uid);
        const leaderboardDoc = await leaderboardRef.get();
        
        if (leaderboardDoc.exists) {
            const data = leaderboardDoc.data();
            const newBestScore = Math.max(data.bestScore, score);
            await leaderboardRef.update({
                bestScore: newBestScore,
                totalQuizzes: firebase.firestore.FieldValue.increment(1),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            await leaderboardRef.set({
                userId: AppState.currentUser.uid,
                userName: AppState.currentUser.displayName || AppState.currentUser.email,
                bestScore: score,
                totalQuizzes: 1,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        console.log("✅ Leaderboard updated");
    } catch (error) {
        console.error("❌ Error updating leaderboard:", error);
    }
};