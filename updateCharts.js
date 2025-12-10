import { Elements } from "./elements.js";
import { QuizAPI } from "./quiz-api.js";
import { AppState } from "./appState.js";
import { db } from "./firebase-config.js";

// Update performance chart
export const updatePerformanceChart = (snapshot) => {
    const scores = [];
    const labels = [];
    
    snapshot.forEach((doc, index) => {
        const data = doc.data();
        scores.unshift(data.score);
        labels.unshift(`Quiz ${snapshot.size - index}`);
    });
    
    const ctx = Elements.performanceChart.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    window.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quiz Scores',
                data: scores,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#4361ee',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            }
        }
    });
};

// Update category question count
export const updateCategoryCount = async (categoryId) => {
    try {
        const count = await QuizAPI.getCategoryCount(categoryId);
        Elements.totalQuestions.textContent = `${count.total_question_count}+`;
    } catch (error) {
        console.error("Error updating category count:", error);
        Elements.totalQuestions.textContent = '100+';
    }
};

// Update user stats
export const updateUserStats = async () => {
    if (!AppState.currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(AppState.currentUser.uid).get();
        if (userDoc.exists) {
            AppState.userStats = userDoc.data();
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
    }
};