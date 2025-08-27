import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import warnings
import joblib
import os

# Ignore warnings for cleaner output
warnings.filterwarnings('ignore')

# --- Configuration ---
MODEL_FILENAME = "aptitude_model_22q.joblib"
DATASET_FILENAME = "dataset.csv"
ACCURACY_FILENAME = "model_accuracy.joblib" # New file to store accuracy

# --- Question Text for Interactive Input ---
# This dictionary holds the questions and options to show the user.
QUESTIONS = {
    'Q1': {
        "text": "A big project you lead fails. What do you do first?",
        "options": {
            1: "Find out exactly what went wrong using facts and data.",
            2: "Change the plan quickly and save what you can.",
            3: "Talk to the team and check how they are feeling."
        }
    },
    'Q2': {
        "text": "Which documentary would you like to watch more?",
        "options": {
            1: "One that explains the truth about a science topic using experts and facts.",
            2: "One about the life of a famous person, showing their story and feelings.",
            3: "One about how businesses or innovations grew, showing their journey and strategies."
        }
    },
    'Q3': {"text": "You suddenly get ₹10,000 for your project. How do you use it?", "options": {1: "Use it to attract more money to make the project bigger.", 2: "Buy the best tools or software to make your work better.", 3: "Travel or meet people who inspire your ideas."}},
    'Q4': {"text": "You must convince someone who doubts you. What do you do?", "options": {1: "Show proof, data, and logic.", 2: "Show how it will benefit them personally.", 3: "Tell a story that makes them imagine it working."}},
    'Q5': {"text": "Which statement feels most true to you?", "options": {1: "The world is like a puzzle—you can solve it by study and analysis.", 2: "The world is full of emotions and stories.", 3: "The world works like a market of ideas and teamwork."}},
    'Q6': {"text": "After reading a non-fiction book, what do you do?", "options": {1: "Check if the facts are correct and logical.", 2: "Note the main points and think how to use them.", 3: "Link it to bigger ideas about life or society."}},
    'Q7': {"text": "Which mistake is worse?", "options": {1: "Missing a good chance because you were unsure.", 2: "Taking a chance and failing.", 3: "Spending too much time planning and never starting."}},
    'Q8': {"text": "When do you feel most focused?", "options": {1: "When competing in a high-pressure situation.", 2: "When creating something with a small team.", 3: "When solving a tough problem alone."}},
    'Q9': {"text": "Which quality is not valued enough today?", "options": {1: "Patience", 2: "Confidence", 3: "Kindness"}},
    'Q10': {"text": "How do you like feedback?", "options": {1: "Direct and honest—just tell me what’s wrong.", 2: "A balanced talk about strengths and weaknesses.", 3: "Start with what’s good, then suggest improvements."}},
    'Q11': {"text": "Two jobs, same pay. Which do you choose?", "options": {1: "The safer job with clear steps and role.", 2: "The riskier job with bigger rewards if you succeed.", 3: "The job that lets you be more creative and flexible."}},
    'Q12': {"text": "In group work, you are usually the one who…", "options": {1: "Keeps the group focused on the goal.", 2: "Tests if the plan will really work.", 3: "Makes sure everyone’s ideas are heard."}},
    'Q13': {"text": "Where do your best ideas come from?", "options": {1: "Testing and improving step-by-step.", 2: "Sudden inspiration.", 3: "Talking and Group brainstorming with others"}},
    'Q14': {"text": "You design a city park. What matters most?", "options": {1: "Eco-friendly and sustainable systems", 2: "Earning money from events to maintain it.", 3: "Beautiful design and feeling for visitors."}},
    'Q15': {"text": "Which is a more valuable skill?", "options": {1: "Deep knowledge of one subject.", 2: "Knowledge of many subjects and how they connect.", 3: "Practical skills that can be directly applied to real-life work."}},
    'Q16': {"text": "Putting furniture together with instructions, you…", "options": {1: "Follow each step exactly.", 2: "Use instructions as a guide but rely on your own way.", 3: "Try without instructions first."}},
    'Q17': {"text": "Which leader do you admire more?", "options": {1: "A visionary with a powerful future plan.", 2: "A strategist who outsmarts challenges.", 3: "A designer who makes perfect systems."}},
    'Q18': {"text": "A group project goes well. What’s the first thing you do?", "options": {1: "Study what steps worked best.", 2: "Think of how to make it even better.", 3: "Thank and appreciate the team."}},
    'Q19': {"text": "You can attend one free workshop. Which do you choose?", "options": {1: "Science experiments.", 2: "Filmmaking and storytelling.", 3: "Starting a business."}},
    'Q20': {"text": "After reading something interesting, you…", "options": {1: "Check if it’s true and accurate.", 2: "Think how to use it.", 3: "Link it to big ideas about life."}},
    'Q21': {"text": "You feel most excited when…", "options": {1: "Solving a problem alone.", 2: "Working creatively with others.", 3: "Competing and making quick decisions."}}
}


# --- 1. Load and Prepare the Dataset ---

# Check if the dataset file exists
if not os.path.exists(DATASET_FILENAME):
    print(f"Error: Dataset file not found!")
    print(f"Please create a '{DATASET_FILENAME}' file in the same folder as this script.")
    exit()

# Load the data from the CSV file
print(f"Loading data from {DATASET_FILENAME}...")
df = pd.read_csv(DATASET_FILENAME)

# Define the feature columns (Q1 to Q22)
feature_columns = [f'Q{i}' for i in range(1, 23)]
X = df[feature_columns]
y = df['Stream']

# --- 2. Preprocess the Data (One-Hot Encoding) ---
print("Preprocessing data...")
X_encoded = pd.get_dummies(X.astype(str))

# --- 3. Load Existing Model or Train a New One ---

# Check if a trained model already exists
if os.path.exists(MODEL_FILENAME):
    print(f"\nLoading existing model from {MODEL_FILENAME}...")
    model = joblib.load(MODEL_FILENAME)
    model_columns = joblib.load(MODEL_FILENAME + "_columns.joblib")
    
    # Load and display the accuracy from the last training session
    if os.path.exists(ACCURACY_FILENAME):
        accuracy = joblib.load(ACCURACY_FILENAME)
        print(f"Model Accuracy (from last training): {accuracy * 100:.2f}%")
    
    print("Model loaded successfully.")
else:
    print("\nNo existing model found. Training a new one...")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42, stratify=y
    )
    
    model = RandomForestClassifier(n_estimators=100, random_state=42,class_weight='balanced')
    model.fit(X_train, y_train)
    print("Model training complete.")

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy on Test Data: {accuracy * 100:.2f}%")
    
    print(f"Saving new model and accuracy to files...")
    joblib.dump(model, MODEL_FILENAME)
    joblib.dump(X_encoded.columns.tolist(), MODEL_FILENAME + "_columns.joblib")
    joblib.dump(accuracy, ACCURACY_FILENAME) # Save the accuracy
    model_columns = X_encoded.columns.tolist()
    print("Model saved.")


# --- 4. Prediction Function for New Inputs ---

def predict_stream(answers):
    """
    Takes a dictionary of new answers, preprocesses them, and predicts the stream.
    """
    input_df = pd.DataFrame([answers])
    input_encoded = pd.get_dummies(input_df.astype(str))
    input_aligned = input_encoded.reindex(columns=model_columns, fill_value=0)
    prediction = model.predict(input_aligned)
    return prediction[0]

# --- 5. Interactive Function to Get User Input ---

def get_user_input():
    """
    Displays the questionnaire and collects answers from the user.
    """
    print("\n--- Please answer the following questions ---")
    user_answers = {}
    for q_id, q_data in QUESTIONS.items():
        print(f"\n{q_id}: {q_data['text']}")
        for option_num, option_text in q_data['options'].items():
            print(f"  ({option_num}) {option_text}")
        
        while True:
            try:
                choice = int(input("Your choice: "))
                if choice in q_data['options']:
                    user_answers[q_id] = choice
                    break
                else:
                    print("Invalid choice. Please enter a valid option number.")
            except ValueError:
                print("Invalid input. Please enter a number.")
    return user_answers


# --- 6. Main Execution Block ---

if __name__ == "__main__":
    # Get answers interactively from the user
    new_answers = get_user_input()
    
    # Predict the stream based on the user's answers
    predicted_stream = predict_stream(new_answers)
    
    print("\n---------------------------------")
    print(f"🚀 Based on your profile, the recommended stream is: {predicted_stream}")
    print("---------------------------------")
