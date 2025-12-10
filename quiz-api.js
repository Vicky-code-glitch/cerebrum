// QuizAPI Module for handling Open Trivia DB API calls
export const QuizAPI = {
    // API base URL
    baseURL: 'https://opentdb.com/api.php',
    
    // Category mapping
    categories: [
        { id: 9, name: 'General Knowledge', icon: 'fas fa-globe' },
        { id: 10, name: 'Books', icon: 'fas fa-book' },
        { id: 11, name: 'Film', icon: 'fas fa-film' },
        { id: 12, name: 'Music', icon: 'fas fa-music' },
        { id: 13, name: 'Musicals & Theatres', icon: 'fas fa-theater-masks' },
        { id: 14, name: 'Television', icon: 'fas fa-tv' },
        { id: 15, name: 'Video Games', icon: 'fas fa-gamepad' },
        { id: 16, name: 'Board Games', icon: 'fas fa-chess-board' },
        { id: 17, name: 'Science & Nature', icon: 'fas fa-flask' },
        { id: 18, name: 'Computers', icon: 'fas fa-laptop' },
        { id: 19, name: 'Mathematics', icon: 'fas fa-calculator' },
        { id: 20, name: 'Mythology', icon: 'fas fa-dragon' },
        { id: 21, name: 'Sports', icon: 'fas fa-running' },
        { id: 22, name: 'Geography', icon: 'fas fa-globe-americas' },
        { id: 23, name: 'History', icon: 'fas fa-landmark' },
        { id: 24, name: 'Politics', icon: 'fas fa-balance-scale' },
        { id: 25, name: 'Art', icon: 'fas fa-palette' },
        { id: 26, name: 'Celebrities', icon: 'fas fa-star' },
        { id: 27, name: 'Animals', icon: 'fas fa-paw' },
        { id: 28, name: 'Vehicles', icon: 'fas fa-car' },
        { id: 29, name: 'Comics', icon: 'fas fa-mask' },
        { id: 30, name: 'Gadgets', icon: 'fas fa-mobile-alt' },
        { id: 31, name: 'Japanese Anime & Manga', icon: 'fas fa-ghost' },
        { id: 32, name: 'Cartoon & Animations', icon: 'fas fa-tv' }
    ],
    
    // Get all categories
    getAllCategories() {
        return this.categories;
    },
    
    // Get category by ID
    getCategoryById(id) {
        return this.categories.find(cat => cat.id == id) || this.categories[0];
    },
    
    // Get questions from API
    async getQuestions(categoryId, difficulty, amount) {
        try {
            const url = `${this.baseURL}?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
            console.log(`Fetching questions from: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.response_code !== 0) {
                throw new Error(`API error: Response code ${data.response_code}`);
            }
            
            return data.results;
        } catch (error) {
            console.error('Error fetching questions:', error);
            
            // Return sample questions as fallback
            return this.getFallbackQuestions(categoryId, difficulty, amount);
        }
    },
    
    // Fallback questions if API fails
    getFallbackQuestions(categoryId, difficulty, amount) {
        const category = this.getCategoryById(categoryId);
        
        const fallbackQuestions = [
            {
                category: category.name,
                type: "multiple",
                difficulty: difficulty,
                question: `Sample question 1 about ${category.name}`,
                correct_answer: "Correct Answer 1",
                incorrect_answers: ["Wrong Answer 1", "Wrong Answer 2", "Wrong Answer 3"]
            },
            {
                category: category.name,
                type: "multiple",
                difficulty: difficulty,
                question: `Sample question 2 about ${category.name}`,
                correct_answer: "Correct Answer 2",
                incorrect_answers: ["Wrong Answer 1", "Wrong Answer 2", "Wrong Answer 3"]
            }
        ];
        
        return fallbackQuestions.slice(0, Math.min(amount, fallbackQuestions.length));
    },
    
    // Decode HTML entities
    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    },
    
    // Shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Get total question count for a category
    async getCategoryCount(categoryId) {
        try {
            const url = `https://opentdb.com/api_count.php?category=${categoryId}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.category_question_count;
        } catch (error) {
            console.error('Error fetching category count:', error);
            return { total: 100 };
        }
    }
};