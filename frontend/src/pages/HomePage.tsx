import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, ArrowRight } from '@/components/SimpleIcons'
import { fileApi, userApi } from '@/lib/api'
import { UserBase, UserLevel } from '@/types'
import { toast } from '@/hooks/use-toast'

export function HomePage() {
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<UserBase | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Error',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    setUploadedFile(file)

    try {
      // Upload file and extract user data
      const fileId = await fileApi.upload(file)
      const userData = await fileApi.getUserInfo(fileId)
      
      setExtractedData(userData)
      toast({
        title: 'Success',
        description: 'CV uploaded and processed successfully',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to process CV. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleCreateProfile = async () => {
    if (!extractedData) return

    try {
      const user = await userApi.create({
        ...extractedData,
        level: UserLevel.INITIAL
      })
      
      toast({
        title: 'Success',
        description: 'Profile created successfully',
      })
      
      navigate(`/profile/${user.uuid}`)
    } catch (error) {
      console.error('Create profile error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Recruiting Tool
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload your CV to get started with AI-powered candidate assessment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload CV</span>
            </CardTitle>
            <CardDescription>
              Upload your PDF resume to extract candidate information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
            >
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-600">Processing CV...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-lg font-medium">
                      {dragActive ? 'Drop your CV here' : 'Drag & drop your CV or click to browse'}
                    </p>
                    <p className="text-xs text-gray-400">PDF files only</p>
                  </div>
                )}
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {uploadedFile.name}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extracted Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
            <CardDescription>
              AI-extracted data from your CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            {extractedData ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={extractedData.name_first}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={extractedData.name_second}
                    readOnly
                    className="mt-1"
                  />
                </div>
                
                <Button
                  onClick={handleCreateProfile}
                  className="w-full"
                  size="lg"
                >
                  Create Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Upload a CV to see extracted information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 