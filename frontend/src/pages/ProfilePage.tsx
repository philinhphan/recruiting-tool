import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { User, Question, UserLevel } from '@/types'
import { userApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { User as UserIcon, Download, MessageSquare, Brain } from '@/components/SimpleIcons'

const QUESTION_TYPES = [
  { id: 0, name: 'Technical Skills', description: 'Questions about technical skills and expertise' },
  { id: 1, name: 'Teamwork Skills', description: 'Questions about collaboration and teamwork' },
  { id: 2, name: 'Interests & Goals', description: 'Questions about interests and future goals' },
]

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [selectedQuestionType, setSelectedQuestionType] = useState<number>(0)
  const [answer, setAnswer] = useState('')
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)

  useEffect(() => {
    if (userId) {
      loadUser(userId)
    }
  }, [userId])

  const loadUser = async (id: string) => {
    try {
      const userData = await userApi.getById(id)
      setUser(userData)
    } catch (error) {
      console.error('Error loading user:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const generateQuestion = async (questionType: number) => {
    if (!userId) return

    setIsGeneratingQuestion(true)
    try {
      const question = await userApi.getQuestion(userId, questionType)
      setCurrentQuestion(question)
      setSelectedQuestionType(questionType)
    } catch (error) {
      console.error('Error generating question:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate question. Make sure the backend is running and OpenAI is configured.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingQuestion(false)
    }
  }

  const submitAnswer = async () => {
    if (!userId || !currentQuestion || !answer.trim()) return

    try {
      const questionData: Question = {
        question: currentQuestion,
        answer: answer.trim()
      }

      const updatedUser = await userApi.postQuestion(userId, questionData)
      setUser(updatedUser)
      setCurrentQuestion('')
      setAnswer('')
      
      toast({
        title: 'Success',
        description: 'Answer submitted successfully',
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit answer',
        variant: 'destructive',
      })
    }
  }

  const downloadCV = async () => {
    if (!userId) return

    try {
      const blob = await userApi.downloadFile(userId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${user?.name_first}_${user?.name_second}_CV.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading CV:', error)
      toast({
        title: 'Error',
        description: 'Failed to download CV',
        variant: 'destructive',
      })
    }
  }

  const getLevelProgress = (level: UserLevel): number => {
    switch (level) {
      case UserLevel.INITIAL: return 25
      case UserLevel.PERSONALITY: return 50
      case UserLevel.QUESTIONS: return 75
      case UserLevel.DONE: return 100
      default: return 0
    }
  }

  const getLevelLabel = (level: UserLevel): string => {
    switch (level) {
      case UserLevel.INITIAL: return 'Initial'
      case UserLevel.PERSONALITY: return 'Personality Assessment'
      case UserLevel.QUESTIONS: return 'Interview Questions'
      case UserLevel.DONE: return 'Complete'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <p className="text-gray-600">The requested user profile could not be found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name_first} {user.name_second}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{getLevelLabel(user.level)}</Badge>
              <span className="text-sm text-gray-500">
                {user.questions.length} questions answered
              </span>
            </div>
          </div>
        </div>
        
        {user.file_id && (
          <Button onClick={downloadCV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download CV
          </Button>
        )}
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Assessment Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{getLevelProgress(user.level)}%</span>
            </div>
            <Progress value={getLevelProgress(user.level)} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personality Traits */}
        <Card>
          <CardHeader>
            <CardTitle>Personality Profile</CardTitle>
            <CardDescription>Big Five personality traits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(user.personality).map(([trait, value]) => (
              <div key={trait}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{trait}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <Progress value={value * 100} className="w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Question Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Interview Questions</span>
            </CardTitle>
            <CardDescription>
              AI-generated questions based on CV analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-900">
                    {QUESTION_TYPES.find(qt => qt.id === selectedQuestionType)?.name} Question:
                  </p>
                  <p className="text-blue-800 mt-1">{currentQuestion}</p>
                </div>
                
                <div>
                  <Label htmlFor="answer">Your Answer</Label>
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Type your answer here..."
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={submitAnswer} disabled={!answer.trim()}>
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={() => setCurrentQuestion('')} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Choose question type:</p>
                  <div className="grid gap-2">
                    {QUESTION_TYPES.map((questionType) => (
                      <Button
                        key={questionType.id}
                        onClick={() => generateQuestion(questionType.id)}
                        disabled={isGeneratingQuestion}
                        variant="outline"
                        className="text-left justify-start h-auto p-3"
                      >
                        <div>
                          <div className="font-medium">{questionType.name}</div>
                          <div className="text-xs text-gray-500">{questionType.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {isGeneratingQuestion && (
                  <div className="text-center py-4">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Generating question...</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous Questions */}
      {user.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Questions & Answers</CardTitle>
            <CardDescription>
              Review all answered questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.questions.map((qa, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="font-medium text-gray-900">Q{index + 1}:</p>
                    <p className="text-gray-700">{qa.question}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Answer:</p>
                    <p className="text-gray-700">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 