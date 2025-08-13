// Wait for the entire HTML page to load before running any script
document.addEventListener('DOMContentLoaded', () => {

    // --- FIREBASE CONFIGURATION ---
    // IMPORTANT: Use your newly regenerated API key here.
    const firebaseConfig = {
    apiKey: "AIzaSyA5mnWmZzg-oBwm3MwfT1viC3va4IMeasc",
    authDomain: "anvesha-70ab9.firebaseapp.com",
    projectId: "anvesha-70ab9",
    storageBucket: "anvesha-70ab9.firebasestorage.app",
    messagingSenderId: "613805584401",
    appId: "1:613805584401:web:44b81d8e6a2389ddc6c1b0",
    measurementId: "G-ZQG34Q4C35"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Get a reference to the Firebase authentication service
    const auth = firebase.auth();


    // --- LOGIN/REGISTER ELEMENTS & LOGIC ---
    const homePage = document.getElementById('home-page');
    const assessmentPage = document.getElementById('assessment-page');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Get the new elements from the updated HTML
    const formTitle = document.getElementById('form-title');
    const formButton = document.getElementById('form-button');
    const toggleToRegister = document.getElementById('toggle-to-register');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    
    // Create and add a logout button
    const nav = document.querySelector('nav');
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.classList.add('nav-link');
    logoutBtn.style.display = 'none';
    nav.appendChild(logoutBtn);

    // This variable will track if we are in Login or Register mode
    let isRegisterMode = false;

    // Listen for clicks on the "Register" link
    registerLink.addEventListener('click', () => {
        isRegisterMode = true;
        formTitle.textContent = 'Register';
        formButton.textContent = 'Register';
        toggleToRegister.classList.add('hidden');
        toggleToLogin.classList.remove('hidden');
        loginError.textContent = ''; // Clear errors
    });

    // Listen for clicks on the "Login" link
    loginLink.addEventListener('click', () => {
        isRegisterMode = false;
        formTitle.textContent = 'Login';
        formButton.textContent = 'Login';
        toggleToRegister.classList.remove('hidden');
        toggleToLogin.classList.add('hidden');
        loginError.textContent = ''; // Clear errors
    });

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        if (isRegisterMode) {
            // --- REGISTER LOGIC ---
            auth.createUserWithEmailAndPassword(email, password)
                .catch(error => {
                    loginError.textContent = error.message;
                });
        } else {
            // --- LOGIN LOGIC ---
            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    loginError.textContent = error.message;
                });
        }
    });
    
    // Checks if a user is logged in (this part stays the same)
    auth.onAuthStateChanged(user => {
        if (user) {
            loginModal.classList.remove('visible');

            // Reset the form to login mode for the next time it opens
            isRegisterMode = false;
            formTitle.textContent = 'Login';
            formButton.textContent = 'Login';
            toggleToRegister.classList.remove('hidden');
            toggleToLogin.classList.add('hidden');

            homePage.classList.remove('hidden');
            logoutBtn.style.display = 'inline-block';
        } else {
            homePage.classList.add('hidden');
            assessmentPage.classList.add('hidden');
            loginModal.classList.add('visible');
            logoutBtn.style.display = 'none';
        }
    });

    // Handle logout (this part stays the same)
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });


    // --- ASSESSMENT ELEMENTS & LOGIC ---
    const questions = { /* Your 21 questions here... */ };
    const questionKeys = Object.keys(questions);
    const totalQuestions = questionKeys.length;
    let currentQuestionIndex = 0;
    let userAnswers = new Array(totalQuestions).fill(null);

    const startJourneyBtn = document.getElementById('start-journey-btn');
    const navTakeSurvey = document.getElementById('nav-take-survey');
    const assessmentCard = document.querySelector('.assessment-card');
    const progressText = document.getElementById('progress-text');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    function showPage(pageToShow) {
        // This function is simple now: just hide/show the assessment page
        homePage.classList.add('hidden');
        assessmentPage.classList.remove('hidden');
    }
    
    function startAssessment() {
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        showPage(assessmentPage);
        loadQuestion();
    }

    function loadQuestion() {
        if (!assessmentCard) return; // Safety check
        assessmentCard.classList.add('fade-out');
        setTimeout(() => {
            // ... (rest of your loadQuestion function is fine)
            const questionKey = questionKeys[currentQuestionIndex];
            const questionData = questions[questionKey];
            progressText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
            questionText.textContent = questionData.text;
            optionsContainer.innerHTML = '';
            for (const optionKey in questionData.options) {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('option');
                optionDiv.textContent = questionData.options[optionKey];
                optionDiv.dataset.key = optionKey;
                if (userAnswers[currentQuestionIndex] === optionKey) {
                    optionDiv.classList.add('selected');
                }
                optionDiv.addEventListener('click', () => selectOption(optionDiv));
                optionsContainer.appendChild(optionDiv);
            }
            prevBtn.disabled = currentQuestionIndex === 0;
            nextBtn.textContent = currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next →';
            assessmentCard.classList.remove('fade-out');
        }, 300);
    }

    function selectOption(selectedDiv) {
        const allOptions = optionsContainer.querySelectorAll('.option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        selectedDiv.classList.add('selected');
        userAnswers[currentQuestionIndex] = selectedDiv.dataset.key;
    }

    function goToNextQuestion() {
        if (userAnswers[currentQuestionIndex] === null) {
            alert("Please select an option before proceeding.");
            return;
        }
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            finishAssessment();
        }
    }

    function goToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    }
    
    function finishAssessment() {
        console.log("Assessment Finished. User Responses:", userAnswers);
        alert("Thank you for completing the assessment!");
        // After finishing, show the home page again
        homePage.classList.remove('hidden');
        assessmentPage.classList.add('hidden');
    }

    // Event Listeners for the assessment part
    if (startJourneyBtn) startJourneyBtn.addEventListener('click', startAssessment);
    if (navTakeSurvey) navTakeSurvey.addEventListener('click', (e) => {
        e.preventDefault();
        startAssessment();
    });
    if (nextBtn) nextBtn.addEventListener('click', goToNextQuestion);
    if (prevBtn) prevBtn.addEventListener('click', goToPrevQuestion);
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', () => {
        homePage.classList.remove('hidden');
        assessmentPage.classList.add('hidden');
    });
});