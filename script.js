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
    const formTitle = document.getElementById('form-title');
    const formButton = document.getElementById('form-button');
    const toggleToRegister = document.getElementById('toggle-to-register');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');

    const nav = document.querySelector('nav');
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.classList.add('nav-link');
    logoutBtn.style.display = 'none';
    nav.appendChild(logoutBtn);

    let isRegisterMode = false;

    registerLink.addEventListener('click', () => {
        isRegisterMode = true;
        formTitle.textContent = 'Register';
        formButton.textContent = 'Register';
        toggleToRegister.classList.add('hidden');
        toggleToLogin.classList.remove('hidden');
        loginError.textContent = '';
    });

    loginLink.addEventListener('click', () => {
        isRegisterMode = false;
        formTitle.textContent = 'Login';
        formButton.textContent = 'Login';
        toggleToRegister.classList.remove('hidden');
        toggleToLogin.classList.add('hidden');
        loginError.textContent = '';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        if (isRegisterMode) {
            auth.createUserWithEmailAndPassword(email, password)
                .catch(error => {
                    loginError.textContent = error.message;
                });
        } else {
            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    loginError.textContent = error.message;
                });
        }
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            loginModal.classList.remove('visible');
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

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });

    // --- ASSESSMENT ELEMENTS & LOGIC ---
    const questions = {
        'Q1': {"text": "A big project you lead fails. What do you do first?", "options": {"1": "Find out exactly what went wrong using facts and data.", "2": "Change the plan quickly and save what you can.", "3": "Talk to the team and check how they are feeling."}},
        'Q2': {"text": "Which documentary would you like to watch more?", "options": {"1": "One that explains the truth about a science topic using experts and facts.", "2": "One about the life of a famous person, showing their story and feelings.", "3": "One about how businesses or innovations grew, showing their journey and strategies."}},
        'Q3': {"text": "You suddenly get ₹10,000 for your project. How do you use it?", "options": {"1": "Use it to attract more money to make the project bigger.", "2": "Buy the best tools or software to make your work better.", "3": "Travel or meet people who inspire your ideas."}},
        'Q4': {"text": "You must convince someone who doubts you. What do you do?", "options": {"1": "Show proof, data, and logic.", "2": "Show how it will benefit them personally.", "3": "Tell a story that makes them imagine it working."}},
        'Q5': {"text": "Which statement feels most true to you?", "options": {"1": "The world is like a puzzle—you can solve it by study and analysis.", "2": "The world is full of emotions and stories.", "3": "The world works like a market of ideas and teamwork."}},
        'Q6': {"text": "After reading a non-fiction book, what do you do?", "options": {"1": "Check if the facts are correct and logical.", "2": "Note the main points and think how to use them.", "3": "Link it to bigger ideas about life or society."}},
        'Q7': {"text": "Which mistake is worse?", "options": {"1": "Missing a good chance because you were unsure.", "2": "Taking a chance and failing.", "3": "Spending too much time planning and never starting."}},
        'Q8': {"text": "When do you feel most focused?", "options": {"1": "When competing in a high-pressure situation.", "2": "When creating something with a small team.", "3": "When solving a tough problem alone."}},
        'Q9': {"text": "Which quality is not valued enough today?", "options": {"1": "Patience", "2": "Confidence", "3": "Kindness"}},
        'Q10': {"text": "How do you like feedback?", "options": {"1": "Direct and honest—just tell me what’s wrong.", "2": "A balanced talk about strengths and weaknesses.", "3": "Start with what’s good, then suggest improvements."}},
        'Q11': {"text": "Two jobs, same pay. Which do you choose?", "options": {"1": "The safer job with clear steps and role.", "2": "The riskier job with bigger rewards if you succeed.", "3": "The job that lets you be more creative and flexible."}},
        'Q12': {"text": "In group work, you are usually the one who…", "options": {"1": "Keeps the group focused on the goal.", "2": "Tests if the plan will really work.", "3": "Makes sure everyone’s ideas are heard."}},
        'Q13': {"text": "Where do your best ideas come from?", "options": {"1": "Testing and improving step-by-step.", "2": "Sudden inspiration.", "3": "Talking and Group brainstorming with others"}},
        'Q14': {"text": "You design a city park. What matters most?", "options": {"1": "Eco-friendly and sustainable systems", "2": "Earning money from events to maintain it.", "3": "Beautiful design and feeling for visitors."}},
        'Q15': {"text": "Which is a more valuable skill?", "options": {"1": "Deep knowledge of one subject.", "2": "Knowledge of many subjects and how they connect.", "3": "Practical skills that can be directly applied to real-life work."}},
        'Q16': {"text": "Putting furniture together with instructions, you…", "options": {"1": "Follow each step exactly.", "2": "Use instructions as a guide but rely on your own way.", "3": "Try without instructions first."}},
        'Q17': {"text": "Which leader do you admire more?", "options": {"1": "A visionary with a powerful future plan.", "2": "A strategist who outsmarts challenges.", "3": "A designer who makes perfect systems."}},
        'Q18': {"text": "A group project goes well. What’s the first thing you do?", "options": {"1": "Study what steps worked best.", "2": "Think of how to make it even better.", "3": "Thank and appreciate the team."}},
        'Q19': {"text": "You can attend one free workshop. Which do you choose?", "options": {"1": "Science experiments.", "2": "Filmmaking and storytelling.", "3": "Starting a business."}},
        'Q20': {"text": "After reading something interesting, you…", "options": {"1": "Check if it’s true and accurate.", "2": "Think how to use it.", "3": "Link it to big ideas about life."}},
        'Q21': {"text": "You feel most excited when…", "options": {"1": "Solving a problem alone.", "2": "Working creatively with others.", "3": "Competing and making quick decisions."}}
    };
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
        if (!assessmentCard) return;
        assessmentCard.classList.add('fade-out');
        setTimeout(() => {
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
        homePage.classList.remove('hidden');
        assessmentPage.classList.add('hidden');
    }

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