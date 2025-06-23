import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Job, JobBase } from '@/types'
import { jobApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Briefcase, Plus, X } from '@/components/SimpleIcons'

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const jobsData = await jobApi.getAll()
      setJobs(jobsData)
    } catch (error) {
      console.error('Error loading jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createJob = async () => {
    if (!newJobName.trim()) return

    setIsCreating(true)
    try {
      const jobData: JobBase = { name: newJobName.trim() }
      await jobApi.create(jobData)
      
      toast({
        title: 'Success',
        description: 'Job created successfully',
      })
      
      setNewJobName('')
      setShowAddForm(false)
      loadJobs() // Reload jobs list
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createJob()
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage job postings and positions
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Add Job Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add New Job</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setNewJobName('')
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobName">Job Title</Label>
                <Input
                  id="jobName"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter job title..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={createJob}
                  disabled={!newJobName.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Job'
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewJobName('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>Available Positions</span>
          </CardTitle>
          <CardDescription>
            All job postings in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-500 mb-4">Create your first job posting to get started</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <Card key={job.uuid} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span>{job.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      Job ID: {job.uuid.substring(0, 8)}...
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 