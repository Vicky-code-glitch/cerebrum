import { Elements } from "./elements.js";
import { AppState } from "./appState.js";
import { auth, db, googleProvider } from "./firebase-config.js";
import { showToast } from "./toast.js";
import { updateUserStats } from "./updateCharts.js";
import { navigateTo } from "./navigate.js";

// Show error message
const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
};

// Auth form toggling
export const showRegisterForm = () => {
    Elements.loginCard.style.display = 'none';
    Elements.registerCard.style.display = 'block';
};

export const showLoginForm = () => {
    Elements.registerCard.style.display = 'none';
    Elements.loginCard.style.display = 'block';
};

// Login user with email and password
export const loginUser = () => {
    console.log("Attempting login...");
    
    const email = Elements.loginEmail.value.trim();
    const password = Elements.loginPassword.value;
    
    // Basic validation
    if (!email || !password) {
        showError(Elements.loginError, 'Please fill in all fields');
        return;
    }
    
    // Clear previous errors
    Elements.loginError.style.display = 'none';
    
    // Show loading state
    Elements.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    Elements.loginBtn.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Login successful!");
            
            // Reset button
            Elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            Elements.loginBtn.disabled = false;
            
            // Clear form
            Elements.loginEmail.value = '';
            Elements.loginPassword.value = '';
            
            // Show success toast
            showToast('Login successful!', 'success');
        })
        .catch((error) => {
            console.error("Login error:", error);
            
            // Reset button
            Elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            Elements.loginBtn.disabled = false;
            
            // Show error message
            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }
            
            showError(Elements.loginError, errorMessage);
        });
};

// Register new user
export const registerUser = () => {
    console.log("Attempting registration...");
    
    const name = Elements.registerName.value.trim();
    const email = Elements.registerEmail.value.trim();
    const password = Elements.registerPassword.value;
    const confirmPassword = Elements.registerConfirmPassword.value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showError(Elements.registerError, 'Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showError(Elements.registerError, 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(Elements.registerError, 'Passwords do not match');
        return;
    }
    
    // Clear previous errors
    Elements.registerError.style.display = 'none';
    
    // Show loading state
    Elements.registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    Elements.registerBtn.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Registration successful!");
            
            // Update user profile with name
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            // Create user document in Firestore
            return db.collection('users').doc(auth.currentUser.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                totalQuizzes: 0,
                bestScore: 0,
                averageScore: 0,
                totalTime: 0
            });
        })
        .then(() => {
            console.log("User document created in Firestore");
            
            // Reset button
            Elements.registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            Elements.registerBtn.disabled = false;
            
            // Clear form
            Elements.registerName.value = '';
            Elements.registerEmail.value = '';
            Elements.registerPassword.value = '';
            Elements.registerConfirmPassword.value = '';
            
            // Show success message
            showToast('Account created successfully! Welcome to QuizMaster Pro!', 'success');
            
            // Switch to login form
            showLoginForm();
        })
        .catch((error) => {
            console.error("Registration error:", error);
            
            // Reset button
            Elements.registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            Elements.registerBtn.disabled = false;
            
            // Show error message
            let errorMessage = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }
            
            showError(Elements.registerError, errorMessage);
        });
};

// Login with Google
export const loginWithGoogle = () => {
    console.log("Attempting Google login...");
    
    // Show loading state
    Elements.googleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    Elements.googleLoginBtn.disabled = true;
    
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Google login successful!");
            
            // Check if user document exists, create if not
            const userDocRef = db.collection('users').doc(result.user.uid);
            
            userDocRef.get()
                .then((doc) => {
                    if (!doc.exists) {
                        // Create user document
                        return userDocRef.set({
                            name: result.user.displayName,
                            email: result.user.email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            totalQuizzes: 0,
                            bestScore: 0,
                            averageScore: 0,
                            totalTime: 0
                        });
                    }
                })
                .then(() => {
                    console.log("User document updated");
                    
                    // Reset button
                    Elements.googleLoginBtn.innerHTML = '<i class="fab fa-google"></i> Sign in with Google';
                    Elements.googleLoginBtn.disabled = false;
                    
                    // Show welcome toast
                    showToast(`Welcome, ${result.user.displayName}!`, 'success');
                });
        })
        .catch((error) => {
            console.error("Google login error:", error);
            
            // Reset button
            Elements.googleLoginBtn.innerHTML = '<i class="fab fa-google"></i> Sign in with Google';
            Elements.googleLoginBtn.disabled = false;
            
            // Show error
            showToast('Google login failed. Please try again.', 'error');
        });
};

// Logout user
export const logoutUser = () => {
    console.log("Logging out...");
    
    auth.signOut()
        .then(() => {
            console.log("Logout successful!");
            showToast('You have been logged out.', 'info');
            navigateTo('auth');
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showToast('Logout failed. Please try again.', 'error');
        });
};