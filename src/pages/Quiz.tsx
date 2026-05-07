import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, RefreshCw, Trophy, Medal } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Quiz = () => {

  const questions: Question[] = [
    // ── Animal Questions ────────────────────────────────────────────────────
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
      options: ["Amazon Rainforest", "Western Ghats", "Sahara Desert", "Great Barrier Reef"],
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
      question: "Where is the only natural habitat of Asiatic Lions?",
      options: ["Sundarbans", "Kaziranga", "Gir Forest", "Jim Corbett"],
      correct: 2,
      explanation: "Gir Forest in Gujarat is the only natural habitat of Asiatic Lions, with a population of 600-700 individuals.",
    },
    {
      id: 6,
      question: "Which year was the Wildlife Protection Act enacted?",
      options: ["1960", "1972", "1986", "1992"],
      correct: 1,
      explanation: "The Wildlife Protection Act was enacted in 1972 to provide legal framework for species and habitat protection.",
    },
    {
      id: 7,
      question: "What is the primary threat to Snow Leopards?",
      options: ["Overfishing", "Climate change", "River pollution", "Deforestation"],
      correct: 1,
      explanation: "Climate change is the primary threat to Snow Leopards, affecting their high-altitude habitat in the Himalayas.",
    },
    {
      id: 8,
      question: "Which Indian state has the highest forest cover?",
      options: ["Kerala", "Uttarakhand", "Madhya Pradesh", "Arunachal Pradesh"],
      correct: 2,
      explanation: "Madhya Pradesh has the highest forest cover in India, followed by Arunachal Pradesh and Chhattisgarh.",
    },
    // ── Plant Questions ────────────────────────────────────────────────────
    {
      id: 9,
      question: "What is the scientific name of the Banyan tree, India's national tree?",
      options: ["Ficus religiosa", "Ficus benghalensis", "Mangifera indica", "Azadirachta indica"],
      correct: 1,
      explanation: "The Banyan tree (Ficus benghalensis) is India's national tree, famous for its aerial prop roots that form additional trunks.",
    },
    {
      id: 10,
      question: "Which plant is known as the 'Queen of Herbs' in Ayurveda?",
      options: ["Aloe Vera", "Ashwagandha", "Tulsi (Holy Basil)", "Neem"],
      correct: 2,
      explanation: "Tulsi (Ocimum tenuiflorum) is revered as the Queen of Herbs in Ayurveda for its wide-ranging medicinal properties.",
    },
    {
      id: 11,
      question: "Which critically endangered medicinal plant is found in Himalayan mountains?",
      options: ["Brahmi", "Sarpagandha", "Jatamansi", "Giloy"],
      correct: 2,
      explanation: "Jatamansi (Nardostachys jatamansi) is critically endangered due to over-harvesting for its roots used in medicines and perfumes.",
    },
    {
      id: 12,
      question: "The Brahma Kamal flower is the state flower of which Indian state?",
      options: ["Kerala", "Uttarakhand", "Himachal Pradesh", "Sikkim"],
      correct: 1,
      explanation: "Brahma Kamal (Saussurea obvallata) is the state flower of Uttarakhand and is found in alpine meadows above 4000m.",
    },
    {
      id: 13,
      question: "Which plant from the Western Ghats blooms only once every 12 years?",
      options: ["Sandalwood", "Kurinji", "Cardamom", "Black Pepper"],
      correct: 1,
      explanation: "Kurinji (Strobilanthes kunthiana) turns the Nilgiri hills blue when it blooms every 12 years, making it a rare spectacle.",
    },
    {
      id: 14,
      question: "Which mangrove tree is the most dominant in the Sundarbans?",
      options: ["Mangrove Apple", "Sundari Tree", "Nipa Palm", "Red Mangrove"],
      correct: 1,
      explanation: "The Sundari tree (Heritiera fomes) gives the Sundarbans its name. It is endangered due to rising sea levels and cyclones.",
    },
    {
      id: 15,
      question: "Agarwood, one of the world's most expensive natural products, comes from which plant family?",
      options: ["Sandalwood family", "Fig family", "Aquilaria (Thymelaeaceae)", "Terminalaceae"],
      correct: 2,
      explanation: "Agarwood is produced by Aquilaria malaccensis trees when infected by a specific mould. It is critically endangered in India.",
    },
    {
      id: 16,
      question: "Which Indian plant is used as a natural pesticide and known as the 'village pharmacy'?",
      options: ["Mango", "Neem", "Peepal", "Ashoka"],
      correct: 1,
      explanation: "The Neem tree (Azadirachta indica) produces compounds like azadirachtin used as natural pesticides. Every part is medicinally valuable.",
    },
    {
      id: 17,
      question: "Where does the Pitcher Plant (Nepenthes khasiana) — India's only native carnivorous plant — grow?",
      options: ["Western Ghats", "Thar Desert", "Northeast India", "Himalayas"],
      correct: 2,
      explanation: "Nepenthes khasiana is endemic to Meghalaya in Northeast India and is endangered due to habitat loss and illegal collection.",
    },
    {
      id: 18,
      question: "Which ecosystem in India supports the highest plant diversity per unit area?",
      options: ["Thar Desert", "Gangetic Plains", "Western Ghats tropical forests", "Deccan Plateau"],
      correct: 2,
      explanation: "The tropical wet forests of the Western Ghats have the highest plant diversity in India, with over 5000 species of flowering plants.",
    },
    {
      id: 19,
      question: "The Lotus is the national flower of India. What is its scientific name?",
      options: ["Nymphaea pubescens", "Nelumbo nucifera", "Victoria amazonica", "Nuphar lutea"],
      correct: 1,
      explanation: "The Lotus (Nelumbo nucifera) is India's national flower, growing in wetlands. It symbolizes purity and is sacred in Hinduism.",
    },
    {
      id: 20,
      question: "Which conservation status indicates a species is close to the threatened threshold?",
      options: ["Safe", "Near Threatened", "Vulnerable", "Endangered"],
      correct: 1,
      explanation: "Near Threatened means the species does not qualify as threatened now but is likely to in the future without conservation efforts.",
    },
  ];

  // API QUESTIONS STATE
  const [questionsData, setQuestionsData] = useState<Question[]>(questions);

  useEffect(() => {

    fetch(`${API_BASE}/quiz/questions`)
      .then((res) => res.json())
      .then((data) => {

        const apiQuestions = data.data || data;

        if (apiQuestions && apiQuestions.length > 0) {
          setQuestionsData(apiQuestions);
        }

      })
      .catch((error) => console.error("Error loading quiz:", error));

  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Leaderboard state
  const [playerName, setPlayerName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; total: number; date: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("quiz-leaderboard") || "[]"); } catch { return []; }
  });

  const saveToLeaderboard = (name: string, finalScore: number) => {
    const entry = {
      name: name.trim() || "Anonymous",
      score: finalScore,
      total: questionsData.length,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
    };
    const updated = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem("quiz-leaderboard", JSON.stringify(updated));
    setNameSaved(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questionsData[currentQuestion].correct) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const MEDAL = ["🥇", "🥈", "🥉"];

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
    setNameSaved(false);
    setPlayerName("");
  };

  const progress = ((currentQuestion + 1) / questionsData.length) * 100;
  const percentage = Math.round((score / questionsData.length) * 100);

  if (quizComplete) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Score Card */}
            <Card className="p-8 text-center space-y-5 animate-fade-in">
              <div className="inline-flex p-6 bg-primary/10 rounded-full">
                <Trophy className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Quiz Complete!</h1>
              <div>
                <div className="text-6xl font-bold text-primary mb-1">{score}/{questionsData.length}</div>
                <p className="text-muted-foreground">You scored {percentage}%</p>
              </div>
              <Badge className={`text-lg px-5 py-1.5 ${
                percentage >= 80 ? "bg-status-safe" : percentage >= 60 ? "bg-status-threatened" : "bg-status-endangered"
              }`}>
                {percentage >= 80 ? "Excellent! 🎉" : percentage >= 60 ? "Good Job! 👍" : "Keep Learning! 📚"}
              </Badge>

              {/* Name Entry */}
              {!nameSaved ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Save your score to the leaderboard:</p>
                  <Input
                    id="quiz-name-input"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && playerName.trim() && saveToLeaderboard(playerName, score)}
                    placeholder="Enter your name"
                    className="text-center"
                    maxLength={20}
                  />
                  <Button
                    id="quiz-save-score-btn"
                    onClick={() => saveToLeaderboard(playerName || "Anonymous", score)}
                    className="w-full"
                  >
                    🏆 Save to Leaderboard
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-green-600 font-semibold">✅ Score saved as <strong>{playerName || "Anonymous"}</strong>!</p>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <Button onClick={handleRestart} size="lg" className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Retake Quiz
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-5">
                <Medal className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Leaderboard</h2>
                <span className="text-xs text-muted-foreground ml-auto">Top 10</span>
              </div>
              {leaderboard.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No scores yet. Be the first! 🌟</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-lg ${
                        entry.name === (playerName || "Anonymous") && nameSaved && i === leaderboard.findIndex(e => e.name === (playerName || "Anonymous") && e.score === score)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/40"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{MEDAL[i] || `#${i + 1}`}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary">{entry.score}/{entry.total}</p>
                        <p className="text-xs text-muted-foreground">{Math.round((entry.score / entry.total) * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {leaderboard.length > 0 && (
                <button
                  onClick={() => { setLeaderboard([]); localStorage.removeItem("quiz-leaderboard"); }}
                  className="mt-4 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear leaderboard
                </button>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const question = questionsData[currentQuestion];

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
              Question {currentQuestion + 1} of {questionsData.length}
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
              {currentQuestion < questionsData.length - 1
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