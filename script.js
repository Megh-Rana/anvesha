// Wait for the entire HTML page to load before running any script
document.addEventListener('DOMContentLoaded', () => {

    // --- FIREBASE CONFIGURATION ---
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
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- PAGE & MODAL ELEMENTS ---
    const homePage = document.getElementById('home-page');
    const assessmentPage = document.getElementById('assessment-page');
    const profilePage = document.getElementById('profile-page');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const formTitle = document.getElementById('form-title');
    const formButton = document.getElementById('form-button');
    const toggleToRegister = document.getElementById('toggle-to-register');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const welcomeMessage = document.getElementById('welcome-message');

    const nav = document.querySelector('nav');
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.textContent = 'Logout';
    logoutBtn.classList.add('nav-link');
    logoutBtn.style.display = 'none';
    nav.appendChild(logoutBtn);

    const dynamicBg = document.getElementById('dynamic-bg');
    if (dynamicBg) {
        document.body.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            dynamicBg.style.setProperty('--mouse-x', `${clientX}px`);
            dynamicBg.style.setProperty('--mouse-y', `${clientY}px`);
        });
    }

    let isRegisterMode = false;

    // --- LOGIN/REGISTER LOGIC ---
    if(registerLink) registerLink.addEventListener('click', () => {
        isRegisterMode = true;
        formTitle.textContent = 'Register';
        formButton.textContent = 'Register';
        toggleToRegister.classList.add('hidden');
        toggleToLogin.classList.remove('hidden');
        loginError.textContent = '';
    });

    if(loginLink) loginLink.addEventListener('click', () => {
        isRegisterMode = false;
        formTitle.textContent = 'Login';
        formButton.textContent = 'Login';
        toggleToRegister.classList.remove('hidden');
        toggleToLogin.classList.add('hidden');
        loginError.textContent = '';
    });

    if(loginForm) loginForm.addEventListener('submit', (e) => {
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
        const loginNavLinks = document.querySelectorAll('.nav-link:not(#nav-profile)');

        if (user) {
            // User is signed in
            if (loginModal) loginModal.classList.remove('visible');
            if (homePage) homePage.classList.remove('hidden');
            if (logoutBtn) logoutBtn.style.display = 'inline-block';

            // Show welcome message and profile icon
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${user.email}`;
                welcomeMessage.classList.remove('hidden');
            }
            if (navProfile) {
                navProfile.classList.remove('hidden');
            }
             // Hide generic login link
            loginNavLinks.forEach(link => {
                if(link.textContent === 'Login') link.classList.add('hidden');
            });

        } else {
            // User is signed out
            if (homePage) homePage.classList.add('hidden');
            if (assessmentPage) assessmentPage.classList.add('hidden');
            if (profilePage) profilePage.classList.add('hidden');
            if (loginModal) loginModal.classList.add('visible');
            if (logoutBtn) logoutBtn.style.display = 'none';

            // Hide welcome message and profile icon
            if (welcomeMessage) {
                welcomeMessage.classList.add('hidden');
            }
            if (navProfile) {
                navProfile.classList.add('hidden');
            }
            // Show generic login link
            loginNavLinks.forEach(link => {
                if(link.textContent === 'Login') link.classList.remove('hidden');
            });
        }
    });

    if(logoutBtn) logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });

    // --- ASSESSMENT & MODEL LOGIC ---
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
    const resultModal = document.getElementById('result-modal');
    const resultStream = document.getElementById('result-stream');
    const resultProbs = document.getElementById('result-probabilities');
    const closeResultBtn = document.getElementById('close-result-modal');
    const profileBackToHomeBtn = document.getElementById('profile-back-to-home-btn');

    let modelData = null;
    fetch('model.json')
        .then(response => {
            if (!response.ok) throw new Error("model.json not found.");
            return response.json();
        })
        .then(data => {
            modelData = data;
            console.log("Model loaded successfully into the browser!");
        })
        .catch(error => {
            console.error("Error loading model.json:", error);
            alert("Could not load the prediction model.");
        });

    function showPage(pageId) {
        homePage.classList.add('hidden');
        assessmentPage.classList.add('hidden');
        profilePage.classList.add('hidden');
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.remove('hidden');
        }
    }
    
    function startAssessment() {
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        showPage('assessment-page');
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
        if (!modelData) {
            alert("Model is still loading, please wait a moment and try again.");
            return;
        }
        const inputVector = modelData.columns.map(col => {
            const [q_id, option] = col.split('_');
            const userAnswer = userAnswers[questionKeys.indexOf(q_id)];
            return userAnswer === option ? 1 : 0;
        });
        const predictionResult = predictWithLocalModel(inputVector);
        saveResultToFirestore(predictionResult);
        showResults(predictionResult);
    }

    function saveResultToFirestore(result) {
        const user = auth.currentUser;
        if (!user) {
            console.log("No user logged in, skipping save.");
            return;
        }
        db.collection("users").doc(user.uid).collection("assessments").add({
            prediction: result.prediction,
            probabilities: result.probabilities,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log("Result saved to Firestore successfully!"))
        .catch(error => console.error("Error saving result to Firestore: ", error));
    }

    async function showProfilePage() {
        showPage('profile-page');
        const user = auth.currentUser;
        if (!user) return;

        const historyContainer = document.getElementById('history-container');
        historyContainer.innerHTML = "<p>Loading your history...</p>";

        try {
            const querySnapshot = await db.collection("users").doc(user.uid).collection("assessments")
                .orderBy("timestamp", "desc")
                .get();
            
            if (querySnapshot.empty) {
                historyContainer.innerHTML = "<p>You haven't completed any assessments yet.</p>";
                return;
            }

            historyContainer.innerHTML = "";
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const resultCard = document.createElement('div');
                resultCard.className = 'history-card';
                const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                }) : 'Date not available';
                
                let probsHTML = '';
                const sortedProbs = Object.entries(data.probabilities).sort((a,b) => b[1] - a[1]);
                sortedProbs.forEach(([stream, prob]) => {
                    probsHTML += `<p>${stream}: <span>${(prob * 100).toFixed(1)}%</span></p>`;
                });
                resultCard.innerHTML = `
                    <div class="history-header">
                        <h3>${data.prediction}</h3>
                        <p class="history-date">Taken on ${date}</p>
                    </div>
                    <div class="history-body">
                        ${probsHTML}
                    </div>
                `;
                historyContainer.appendChild(resultCard);
            });
        } catch (error) {
            console.error("Error fetching history: ", error);
            historyContainer.innerHTML = "<p>Could not load your history. Please try again later.</p>";
        }
    }    

    function predictWithLocalModel(inputVector) {
        const treePredictions = [];
        for (const tree of modelData.trees) {
            let currentNodeIndex = 0;
            while (tree.children_left[currentNodeIndex] !== -1) {
                const featureIndex = tree.feature[currentNodeIndex];
                const threshold = tree.threshold[currentNodeIndex];
                if (inputVector[featureIndex] <= threshold) {
                    currentNodeIndex = tree.children_left[currentNodeIndex];
                } else {
                    currentNodeIndex = tree.children_right[currentNodeIndex];
                }
            }
            treePredictions.push(tree.value[currentNodeIndex]);
        }

        const aggregateVotes = new Array(modelData.classes.length).fill(0);
        for (const pred of treePredictions) {
            for (let i = 0; i < pred.length; i++) {
                aggregateVotes[i] += pred[i];
            }
        }

        const totalVotes = aggregateVotes.reduce((sum, val) => sum + val, 0);
        const probabilities = {};
        let maxProb = 0;
        let finalPrediction = '';

        for (let i = 0; i < modelData.classes.length; i++) {
            const prob = totalVotes > 0 ? aggregateVotes[i] / totalVotes : 0;
            probabilities[modelData.classes[i]] = prob;
            if (prob > maxProb) {
                maxProb = prob;
                finalPrediction = modelData.classes[i];
            }
        }
        return { prediction: finalPrediction, probabilities: probabilities };
    }

    function showResults(data) {
        resultStream.textContent = data.prediction;
        resultProbs.innerHTML = '';
        const sortedProbs = Object.entries(data.probabilities).sort((a, b) => b[1] - a[1]);
        for (const [stream, prob] of sortedProbs) {
            const probPercent = (prob * 100).toFixed(2);
            const probEl = document.createElement('p');
            probEl.innerHTML = `<strong>${stream}:</strong> ${probPercent}% likely`;
            resultProbs.appendChild(probEl);
        }
        resultModal.classList.add('visible');
        closeResultBtn.onclick = () => {
            resultModal.classList.remove('visible');
            showPage('home-page');
        };
    }

    // --- NAVIGATION & BUTTON EVENT LISTENERS ---
    if (startJourneyBtn) startJourneyBtn.addEventListener('click', startAssessment);
    if (navTakeSurvey) navTakeSurvey.addEventListener('click', (e) => {
        e.preventDefault();
        startAssessment();
    });
    if (nextBtn) nextBtn.addEventListener('click', goToNextQuestion);
    if (prevBtn) prevBtn.addEventListener('click', goToPrevQuestion);
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', () => showPage('home-page'));
    
    const navProfile = document.getElementById('nav-profile');
    if (navProfile) navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        showProfilePage();
    });
    
    const navHome = document.getElementById('nav-home');
    if (navHome) navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });
    
    if (profileBackToHomeBtn) {
        profileBackToHomeBtn.addEventListener('click', () => showPage('home-page'));
    }

    // --- CHATBOT CODE ---
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (chatbotIcon && chatbotContainer) {
        chatbotIcon.addEventListener('click', () => {
            chatbotContainer.classList.remove('hide');
            chatbotIcon.classList.add('hide');
            setTimeout(() => {
                document.getElementById('user-input').focus();
            }, 300);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !chatbotContainer.classList.contains('hide')) {
                chatbotContainer.classList.add('hide');
                chatbotIcon.classList.remove('hide');
            }
        });

        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `position: absolute; right: 18px; top: 18px; font-size: 22px; color: #fff; cursor: pointer; font-weight: bold; z-index: 2; user-select: none;`;
            closeBtn.title = "Close Chat";
            chatHeader.style.position = "relative";
            chatHeader.appendChild(closeBtn);
            closeBtn.addEventListener('click', () => {
                chatbotContainer.classList.add('hide');
                chatbotIcon.classList.remove('hide');
            });
        }
    }

    function formatMarkdown(text) {
        if (!text) return '';
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    async function sendMessage() {
        const inputField = document.getElementById('user-input');
        const chatBox = document.getElementById('chat-box');
        if (!inputField || !chatBox) return;
        const userMessage = inputField.value.trim();
        if (userMessage === '') return;

        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.textContent = userMessage;
        chatBox.appendChild(userDiv);
        inputField.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const botDiv = document.createElement('div');
        botDiv.className = 'message bot';
        botDiv.textContent = 'Thinking...';
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma3:4b',
                    prompt: userMessage,
                    stream: false
                })
            });
            const data = await response.json();
            botDiv.innerHTML = formatMarkdown(data.response) || 'No response from AI.';
        } catch (error) {
            botDiv.textContent = 'Error connecting to Gemma model.';
            console.error(error);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // FIX: The button in your HTML has an onclick attribute which we should not use.
    // Instead, we give it an ID and add a listener here.
    const sendBtn = document.querySelector('.input-container button'); // A more robust selector
    if(sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
});
