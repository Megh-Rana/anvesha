import pandas as pd
import os

# --- Configuration ---
RAW_DATA_FILENAME = "raw_data.csv"  # The name of your file with the raw survey responses
CLEAN_DATA_FILENAME = "dataset.csv"   # The name of the output file for the training script

print("--- Data Cleaning Script ---")

# --- 1. Check if the raw data file exists ---
if not os.path.exists(RAW_DATA_FILENAME):
    print(f"\nError: Raw data file not found!")
    print(f"Please make sure your raw survey data is saved as '{RAW_DATA_FILENAME}' in the same folder.")
    exit()

# --- 2. Define the Mapping Logic ---
# This dictionary maps the long text answers to simple numbers.
# The keys have been cleaned to remove extra whitespace and newlines.
ANSWER_MAP = {
    "A big project you lead fails. What do you do first?": {
        "Find out exactly what went wrong using facts and data.": 1,
        "Change the plan quickly and save what you can.": 2,
        "Talk to the team and check how they are feeling.": 3
    },
    "Which documentary would you like to watch more?": {
        "One that explains the truth about a science topic using experts and facts.": 1,
        "One about the life of a famous person, showing their story and feelings.": 2,
        "One about how businesses or innovations grew, showing their journey and strategies.": 3
    },
    "You suddenly get ₹10,000 for your project. How do you use it?": {
        "Use it to attract more money to make the project bigger.": 1,
        "Buy the best tools or software to make your work better.": 2,
        "Travel or meet people who inspire your ideas.": 3
    },
    "You must convince someone who doubts you. What do you do?": {
        "Show proof, data, and logic.": 1,
        "Show how it will benefit them personally.": 2,
        "Tell a story that makes them imagine it working.": 3
    },
    "Which statement feels most true to you?": {
        "The world is like a puzzle—you can solve it by study and analysis.": 1,
        "The world is full of emotions and stories.": 2,
        "The world works like a market of ideas and teamwork.": 3
    },
    "After reading a non-fiction book, what do you do?": {
        "Check if the facts are correct and logical.": 1,
        "Note the main points and think how to use them.": 2,
        "Link it to bigger ideas about life or society.": 3
    },
    "Which mistake is worse?": {
        "Missing a good chance because you were unsure.": 1,
        "Taking a chance and failing.": 2,
        "Spending too much time planning and never starting.": 3
    },
    "When do you feel most focused?": {
        "When competing in a high-pressure situation.": 1,
        "When creating something with a small team.": 2,
        "When solving a tough problem alone.": 3
    },
    "Which quality is not valued enough today?": {
        "Patience": 1, "Confidence": 2, "Kindness": 3
    },
    "How do you like feedback?": {
        "Direct and honest—just tell me what’s wrong.": 1,
        "A balanced talk about strengths and weaknesses.": 2,
        "Start with what’s good, then suggest improvements.": 3
    },
    "Two jobs, same pay. Which do you choose?": {
        "The safer job with clear steps and role.": 1,
        "The riskier job with bigger rewards if you succeed.": 2,
        "The job that lets you be more creative and flexible.": 3
    },
    "In group work, you are usually the one who…": {
        "Keeps the group focused on the goal.": 1,
        "Tests if the plan will really work.": 2,
        "Makes sure everyone’s ideas are heard.": 3
    },
    "Where do your best ideas come from?": {
        "Testing and improving step-by-step.": 1,
        "Sudden inspiration.": 2,
        "Talking and Group brainstorming with others": 3
    },
    "You design a city park. What matters most?": {
        "Eco-friendly and sustainable systems": 1,
        "Earning money from events to maintain it.": 2,
        "Beautiful design and feeling for visitors.": 3
    },
    "Which is a more valuable skill?": {
        "Deep knowledge of one subject.": 1,
        "Knowledge of many subjects and how they connect.": 2,
        "Practical skills that can be directly applied to real-life work.": 3
    },
    "Putting furniture together with instructions, you…": {
        "Follow each step exactly.": 1,
        "Use instructions as a guide but rely on your own way.": 2,
        "Try without instructions first.": 3
    },
    "Which leader do you admire more?": {
        "A visionary with a powerful future plan.": 1,
        "A strategist who outsmarts challenges.": 2,
        "A designer who makes perfect systems.": 3
    },
    "A group project goes well. What’s the first thing you do?": {
        "Study what steps worked best.": 1,
        "Think of how to make it even better.": 2,
        "Thank and appreciate the team.": 3
    },
    "You can attend one free workshop. Which do you choose?": {
        "Science experiments.": 1,
        "Filmmaking and storytelling.": 2,
        "Starting a business.": 3
    },
    "After reading something interesting, you…": {
        "Check if it’s true and accurate.": 1,
        "Think how to use it.": 2,
        "Link it to big ideas about life.": 3
    },
    "You feel most excited when…": {
        "Solving a problem alone.": 1,
        "Working creatively with others.": 2,
        "Competing and making quick decisions.": 3
    },
    "Which stream did you choose after 10th grade? (be honest)": {
        "Science": "Science",
        "Commerce": "Commerce",
        "Arts": "Arts"
    }
}


# --- 3. Load and Process the Data ---
try:
    print(f"Loading raw data from '{RAW_DATA_FILENAME}'...")
    df_raw = pd.read_csv(RAW_DATA_FILENAME)

    # --- FIX: Clean up column headers ---
    # This removes leading/trailing whitespace and newlines from the column names
    df_raw.columns = df_raw.columns.str.strip()

    # Create a new, clean DataFrame
    df_clean = pd.DataFrame()

    print("Mapping text answers to numbers...")
    # Iterate through the mapping dictionary
    for i, (question, mapping) in enumerate(ANSWER_MAP.items()):
        q_col_name = f"Q{i+1}"
        
        # Check if the question column exists in the raw data
        if question in df_raw.columns:
            # Also strip whitespace from the actual answers in the column before mapping
            df_clean[q_col_name] = df_raw[question].str.strip().map(mapping)
        else:
            print(f"  Warning: Column '{question}' not found in raw data. Skipping.")

    # --- 4. Create the 'Stream' Target Column ---
    # As discussed, we duplicate the answer from Q22 into a new 'Stream' column
    print("Creating the 'Stream' target column...")
    q22_column_name = "Which stream did you choose after 10th grade? (be honest)"
    if q22_column_name in df_raw.columns:
        # We need to strip any extra whitespace that might come from the survey export
        df_clean['Stream'] = df_raw[q22_column_name].str.strip()
    else:
         print(f"  Warning: Column for Q22 not found. Cannot create 'Stream' column.")


    # --- 5. Save the Clean Data ---
    # Add a check to see how many rows are being dropped
    initial_rows = len(df_clean)
    print(f"\nRows before cleaning missing values: {initial_rows}")
    
    # Drop rows with any missing values that might result from mapping errors
    df_clean.dropna(inplace=True)
    
    final_rows = len(df_clean)
    print(f"Rows after cleaning missing values: {final_rows}")
    
    if final_rows == 0 and initial_rows > 0:
        print("\nCRITICAL ERROR: All data rows were removed.")
        print("This usually means there's a mismatch between the answer text in your CSV and the script's ANSWER_MAP.")
        print("Please carefully check for typos, extra spaces, or different phrasing.")
    else:
        df_clean.to_csv(CLEAN_DATA_FILENAME, index=False)
        print(f"\nSuccess! Clean data has been saved to '{CLEAN_DATA_FILENAME}'")
        print(f"This file is now ready to be used with your training script.")

except Exception as e:
    print(f"\nAn error occurred during processing: {e}")
    print("Please check that your raw CSV file format matches the expected format.")
