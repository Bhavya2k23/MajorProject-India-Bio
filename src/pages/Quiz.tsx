import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, Trophy } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const Quiz = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: "How many biogeographical zones does India have?",
      options: ["8", "10", "12", "15"],
      correct: 1,
      explanation: "India is divided into 10 distinct biogeographical zones based on climate, vegetation, and wildlife patterns.",
    },
    {
      id: 2,
      question: "Which species is critically endangered in India?",
      options: ["Bengal Tiger", "Gharial", "Indian Leopard", "Sloth Bear"],
      correct: 1,
      explanation: "The Gharial is critically endangered with only 650-700 individuals remaining due to river pollution and habitat loss.",
    },
    {
      id: 3,
      question: "Which biodiversity hotspot is located in India?",
      options: [
        "Amazon Rainforest",
        "Western Ghats",
        "Sahara Desert",
        "Great Barrier Reef",
      ],
      correct: 1,
      explanation: "The Western Ghats is one of the world's biodiversity hotspots with high levels of endemism.",
    },
    {
      id: 4,
      question: "What percentage of world's species does India host?",
      options: ["2-3%", "5-6%", "7-8%", "10-12%"],
      correct: 2,
      explanation: "India hosts 7-8% of the world's recorded species despite having only 2.4% of the world's land area.",
    },
    {
      id: 5,
      question: "Which ecosystem is characterized by mangroves?",
      options: [
        "Alpine Mountains",
        "Deserts",
        "Marine & Coastal",
        "Grasslands",
      ],
      correct: 2,
      explanation: "Marine and coastal ecosystems include mangrove forests which are vital for coastal protection and biodiversity.",
    },
    {
      id: 6,
      question: "What is the primary threat to Snow Leopards?",
      options: [
        "Overfishing",
        "Climate change",
        "River pollution",
        "Deforestation",
      ],
      correct: 1,
      explanation: "Climate change is the primary threat to Snow Leopards, affecting their high-altitude habitat in the Himalayas.",
    },
    {
      id: 7,
      question: "Which year was the Wildlife Protection Act enacted?",
      options: ["1960", "1972", "1986", "1992"],
      correct: 1,
      explanation: "The Wildlife Protection Act was enacted in 1972 to provide legal framework for species and habitat protection.",
    },
    {
      id: 8,
      question: "Where is the only natural habitat of Asiatic Lions?",
      options: [
        "Sundarbans",
        "Kaziranga",
        "Gir Forest",
        "Jim Corbett",
      ],
      correct: 2,
      explanation: "Gir Forest in Gujarat is the only natural habitat of Asiatic Lions, with a population of 600-700 individuals.",
    },
    {
      id: 9,
      question: "What conservation status indicates the highest risk?",
      options: [
        "Vulnerable",
        "Endangered",
        "Critically Endangered",
        "Extinct",
      ],
      correct: 2,
      explanation: "Critically Endangered indicates the highest risk of extinction in the wild among living species.",
    },
    {
      id: 10,
      question: "Which Indian state has the highest forest cover?",
      options: ["Kerala", "Uttarakhand", "Madhya Pradesh", "Arunachal Pradesh"],
      correct: 2,
      explanation: "Madhya Pradesh has the highest forest cover in India, followed by Arunachal Pradesh and Chhattisgarh.",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percentage = Math.round((score / questions.length) * 100);

  if (quizComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 text-center space-y-6 animate-fade-in">
            <div className="inline-flex p-6 bg-primary/10 rounded-full">
              <Trophy className="h-16 w-16 text-primary" />
            </div>

            <h1 className="text-3xl font-bold">Quiz Complete!</h1>

            <div className="space-y-4">
              <div>
                <div className="text-6xl font-bold text-primary mb-2">
                  {score}/{questions.length}
                </div>
                <p className="text-lg text-muted-foreground">
                  You scored {percentage}%
                </p>
              </div>

              <Badge
                className={`text-lg px-6 py-2 ${
                  percentage >= 80
                    ? "bg-status-safe"
                    : percentage >= 60
                    ? "bg-status-threatened"
                    : "bg-status-endangered"
                }`}
              >
                {percentage >= 80
                  ? "Excellent! 🎉"
                  : percentage >= 60
                  ? "Good Job! 👍"
                  : "Keep Learning! 📚"}
              </Badge>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-muted-foreground">
                {percentage >= 80
                  ? "You have excellent knowledge of Indian biodiversity!"
                  : percentage >= 60
                  ? "Great effort! Explore more to become a biodiversity expert."
                  : "Keep exploring to learn more about India's rich biodiversity."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={handleRestart} size="lg" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retake Quiz
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">Biodiversity Quiz</h1>
          <p className="text-lg text-muted-foreground">
            Test your knowledge about India's biodiversity
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="font-medium">
              Score: {score}/{answeredQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 animate-slide-up">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showStatus = showExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      !showStatus
                        ? "border-border hover:border-primary hover:bg-primary/5"
                        : isSelected && isCorrect
                        ? "border-status-safe bg-status-safe/10"
                        : isSelected && !isCorrect
                        ? "border-status-endangered bg-status-endangered/10"
                        : isCorrect
                        ? "border-status-safe bg-status-safe/10"
                        : "border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showStatus && isSelected && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-status-safe" />
                      )}
                      {showStatus && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-status-endangered" />
                      )}
                      {showStatus && !isSelected && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-status-safe" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-muted rounded-lg animate-fade-in">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {selectedAnswer === question.correct ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-status-safe" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-status-endangered" />
                      Incorrect
                    </>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Next Button */}
        {showExplanation && (
          <div className="flex justify-end">
            <Button onClick={handleNext} size="lg">
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "View Results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
