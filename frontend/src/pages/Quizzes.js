import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const Quizzes = () => {
  const { user, updateUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // Mock quiz data - in real app, this would come from your backend
      const mockQuizzes = [
        {
          id: '1',
          title: 'Waste Management Basics',
          description: 'Test your knowledge about proper waste disposal',
          difficulty: 'Easy',
          questions: 5,
          points: 25,
          completed: false,
          questions_data: [
            {
              question: 'What is the most environmentally friendly way to dispose of organic waste?',
              options: [
                'Throw it in regular trash',
                'Compost it',
                'Burn it',
                'Leave it outside'
              ],
              correct: 1,
              explanation: 'Composting organic waste creates nutrient-rich soil and reduces methane emissions.'
            },
            {
              question: 'How long does it take for a plastic bottle to decompose?',
              options: [
                '1 year',
                '10 years',
                '450 years',
                '1000 years'
              ],
              correct: 2,
              explanation: 'Plastic bottles can take up to 450 years to decompose in the environment.'
            },
            {
              question: 'Which of the following should NOT go in recycling bins?',
              options: [
                'Clean paper',
                'Glass bottles',
                'Pizza boxes with grease',
                'Aluminum cans'
              ],
              correct: 2,
              explanation: 'Greasy pizza boxes contaminate the recycling process and should be composted instead.'
            },
            {
              question: 'What percentage of waste can be recycled?',
              options: [
                '25%',
                '50%',
                '75%',
                '90%'
              ],
              correct: 2,
              explanation: 'Approximately 75% of household waste can be recycled or composted.'
            },
            {
              question: 'What is the main benefit of reducing waste?',
              options: [
                'Saves money',
                'Protects environment',
                'Creates jobs',
                'All of the above'
              ],
              correct: 3,
              explanation: 'Reducing waste saves money, protects the environment, and creates green jobs.'
            }
          ]
        },
        {
          id: '2',
          title: 'Climate Change & Environment',
          description: 'Learn about environmental impact and climate change',
          difficulty: 'Medium',
          questions: 7,
          points: 35,
          completed: false,
          questions_data: [
            {
              question: 'What is the primary cause of global warming?',
              options: [
                'Solar radiation',
                'Greenhouse gases',
                'Ocean currents',
                'Volcanic activity'
              ],
              correct: 1,
              explanation: 'Greenhouse gases trap heat in the atmosphere, causing global warming.'
            },
            {
              question: 'Which activity produces the most carbon emissions?',
              options: [
                'Driving a car',
                'Flying in a plane',
                'Using electricity',
                'Eating meat'
              ],
              correct: 1,
              explanation: 'Air travel produces significantly more carbon emissions per mile than other transportation methods.'
            },
            {
              question: 'What is the most effective way to reduce your carbon footprint?',
              options: [
                'Recycle more',
                'Use public transportation',
                'Eat less meat',
                'All of the above'
              ],
              correct: 3,
              explanation: 'Combining multiple sustainable practices has the greatest impact on reducing carbon footprint.'
            }
          ]
        },
        {
          id: '3',
          title: 'Sustainable Living',
          description: 'Discover ways to live more sustainably',
          difficulty: 'Hard',
          questions: 10,
          points: 50,
          completed: false,
          questions_data: [
            {
              question: 'What is the most water-efficient way to wash dishes?',
              options: [
                'Use a dishwasher',
                'Wash by hand with running water',
                'Wash by hand with a basin',
                'Use disposable plates'
              ],
              correct: 0,
              explanation: 'Modern dishwashers use less water than hand washing, especially when fully loaded.'
            }
          ]
        }
      ];

      setQuizzes(mockQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const isCorrect = selectedAnswer === currentQuiz.questions_data[currentQuestionIndex].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions_data.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    try {
      const finalScore = score + (selectedAnswer === currentQuiz.questions_data[currentQuestionIndex].correct ? 1 : 0);
      const percentage = (finalScore / currentQuiz.questions_data.length) * 100;
      const pointsEarned = Math.floor((percentage / 100) * currentQuiz.points);

      // Update user points
      const updatedUser = {
        ...user,
        points: user.points + pointsEarned
      };
      updateUser(updatedUser);

      // Mark quiz as completed
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === currentQuiz.id ? { ...quiz, completed: true } : quiz
      ));

      toast.success(`Quiz completed! You earned ${pointsEarned} points!`);
      
      // Reset quiz state
      setCurrentQuiz(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);

    } catch (error) {
      console.error('Error finishing quiz:', error);
      toast.error('Failed to submit quiz results');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (currentQuiz) {
    const currentQuestion = currentQuiz.questions_data[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions_data.length - 1;
    const isCorrect = selectedAnswer === currentQuestion.correct;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{currentQuiz.title}</h1>
              <button
                onClick={() => setCurrentQuiz(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions_data.length}</span>
              <span>•</span>
              <span>Score: {score}</span>
              <span>•</span>
              <span>{currentQuiz.points} points available</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions_data.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && selectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    showResult
                      ? index === currentQuestion.correct
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : selectedAnswer === index
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-gray-200 bg-gray-50'
                      : selectedAnswer === index
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    {showResult && index === currentQuestion.correct && (
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                    )}
                    {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
                      <XCircle className="text-red-600 mr-3" size={20} />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            {!showResult ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={submitting}
                className="btn-primary flex items-center"
              >
                {isLastQuestion ? (
                  <>
                    {submitting ? 'Submitting...' : 'Finish Quiz'}
                    <Trophy className="ml-2" size={16} />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="text-purple-600 mr-3" size={48} />
            <h1 className="text-4xl font-bold text-gray-900">Environmental Quizzes</h1>
          </div>
          <p className="text-xl text-gray-600">
            Test your knowledge and earn points while learning about environmental conservation.
          </p>
        </div>

        {/* User Stats */}
        <div className="card mb-8 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {user?.points || 0}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Points</h3>
                <p className="text-gray-600">Level {user?.level || 1} • Keep learning!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-purple-600">
                <Star size={20} className="mr-1" />
                <span className="font-medium">Eco Warrior</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{quiz.description}</p>
                </div>
                {quiz.completed && (
                  <CheckCircle className="text-green-600 ml-2" size={24} />
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="font-medium">{quiz.questions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="font-medium text-primary-600">{quiz.points}</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz(quiz)}
                disabled={quiz.completed}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  quiz.completed
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {quiz.completed ? 'Completed' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>

        {/* Learning Tips */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Learning Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Star className="text-blue-600 mr-3 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-blue-900">Read Carefully</h4>
                <p className="text-sm text-blue-800">Take your time to understand each question and all answer options.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Brain className="text-blue-600 mr-3 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-blue-900">Learn from Mistakes</h4>
                <p className="text-sm text-blue-800">Read the explanations to understand why answers are correct or incorrect.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
