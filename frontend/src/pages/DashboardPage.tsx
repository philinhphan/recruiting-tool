import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, UserLevel } from '@/types'
import { userApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Users, Eye, Download, Plus } from '@/components/SimpleIcons'

export function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const usersData = await userApi.getAll()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadCV = async (userId: string, firstName: string, lastName: string) => {
    try {
      const blob = await userApi.downloadFile(userId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${firstName}_${lastName}_CV.pdf`
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

  const getLevelBadgeVariant = (level: UserLevel) => {
    switch (level) {
      case UserLevel.DONE: return 'default'
      case UserLevel.QUESTIONS: return 'secondary'
      case UserLevel.PERSONALITY: return 'outline'
      default: return 'outline'
    }
  }

  const getLevelLabel = (level: UserLevel): string => {
    switch (level) {
      case UserLevel.INITIAL: return 'Initial'
      case UserLevel.PERSONALITY: return 'Personality'
      case UserLevel.QUESTIONS: return 'Questions'
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage candidates and view their assessment progress
          </p>
        </div>
        
        <Button asChild>
          <Link to="/" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Candidate</span>
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Complete Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.level === UserLevel.DONE).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.level !== UserLevel.DONE && u.level !== UserLevel.INITIAL).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 ? Math.round(users.reduce((acc, u) => acc + u.questions.length, 0) / users.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Candidates</span>
          </CardTitle>
          <CardDescription>
            View and manage all candidate profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first candidate</p>
              <Button asChild>
                <Link to="/">Add Candidate</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Questions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {user.name_first} {user.name_second}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getLevelBadgeVariant(user.level)}>
                          {getLevelLabel(user.level)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">
                          {user.questions.length} answered
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link to={`/profile/${user.uuid}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          
                          {user.file_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadCV(user.uuid, user.name_first, user.name_second)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              CV
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 