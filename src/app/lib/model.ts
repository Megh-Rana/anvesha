export type ModelTree = {
  children_left: number[];
  children_right: number[];
  feature: number[];
  threshold: number[];
  value: number[][];
};

export type ModelData = {
  trees: ModelTree[];
  columns: string[];
  classes: Array<"Arts" | "Commerce" | "Science">;
};

export type PredictionResult = {
  prediction: "Arts" | "Commerce" | "Science";
  probabilities: Record<"Arts" | "Commerce" | "Science", number>;
};

export function buildInputVector(
  columns: string[],
  questionIds: string[],
  answers: Array<number | null>,
) {
  return columns.map((col) => {
    const [questionId, optionKey] = col.split("_");
    const idx = questionIds.indexOf(questionId);
    if (idx < 0) return 0;
    const answer = answers[idx];
    if (answer == null) return 0;
    return String(answer + 1) === optionKey ? 1 : 0;
  });
}

export function predictWithLocalModel(modelData: ModelData, inputVector: number[]): PredictionResult {
  const treePredictions: number[][] = [];

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
  for (const prediction of treePredictions) {
    for (let i = 0; i < prediction.length; i += 1) {
      aggregateVotes[i] += prediction[i];
    }
  }

  const totalVotes = aggregateVotes.reduce((sum, value) => sum + value, 0);
  const probabilities = {
    Arts: 0,
    Commerce: 0,
    Science: 0,
  };
  let maxProb = -1;
  let finalPrediction: "Arts" | "Commerce" | "Science" = "Science";

  for (let i = 0; i < modelData.classes.length; i += 1) {
    const className = modelData.classes[i];
    const prob = totalVotes > 0 ? aggregateVotes[i] / totalVotes : 0;
    probabilities[className] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      finalPrediction = className;
    }
  }

  return { prediction: finalPrediction, probabilities };
}
