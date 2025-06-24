"use client"

import type React from "react"

import { Upload, Plus, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import React from "react"
import { OpenQuestion } from "./open-question"

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [answer1, setAnswer1] = useState<string>("")
  const [answer2, setAnswer2] = useState<string>("")
  const [answer3, setAnswer3] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
    ]

    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file)
    } else {
      alert("Please upload a PDF.")
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Green Gradient */}
      <div className="relative h-80 bg-gradient-to-br from-[#00ea51] to-emerald-400 overflow-hidden">
        {/* Diagonal Line Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-y-12"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent transform skew-y-12"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-[#ffffff] text-4xl md:text-5xl font-bold text-center px-4">
            Prototyping the future with us
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-16 max-w-4xl mx-auto rounded-t-lg rounded-4xl">
        {/* CV Upload */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-[#000000] text-3xl md:text-4xl font-bold mb-8">Making applying easy with FlashHire</h2>

            <div className="space-y-4 text-[#6e6e6e] text-lg leading-relaxed max-w-3xl mx-auto">
              <p>
                Hello there! I'm Flash, your personal AI assistant here at Reply! I'm here to help you discover the best
                job opportunities that match your skills and interests. With my help, applying for positions is simple and
                straightforward.
              </p>
              <p>
                Let me guide you through the process and make your job search a breeze. Together, we'll find the perfect
                role for you at Reply. Let's get started on this exciting journey!
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />

            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragOver
                ? "border-[#00ea51] bg-green-50"
                : selectedFile
                  ? "border-[#00ea51] bg-green-50"
                  : "border-[#d6d6d6] hover:border-[#00ea51]"
                }`}
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-[#00ea51]" />
                    <FileText className="w-8 h-8 text-[#00ea51]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#000000] text-lg font-semibold">{selectedFile.name}</p>
                    <p className="text-[#6e6e6e] text-sm">{formatFileSize(selectedFile.size)}</p>
                    <p className="text-[#00ea51] text-sm mt-2">File uploaded successfully!</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="text-[#6e6e6e] border-[#d6d6d6] hover:border-[#00ea51]"
                  >
                    Choose different file
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-20 bg-[#00ea51] rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00ea51] rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[#7a7a7a] text-xl font-medium block">Upload your CV</span>
                    <span className="text-[#6e6e6e] text-sm mt-2 block">Drag and drop or click to browse</span>
                    <span className="text-[#6e6e6e] text-xs mt-1 block">Supports PDF, DOC, DOCX, TXT (Max 10MB)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              className={`px-12 py-6 text-lg font-semibold rounded-full transition-all ${selectedFile
                ? "bg-[#00ea51] hover:bg-[#00d147] text-white"
                : "bg-[#d6d6d6] text-[#6e6e6e] cursor-not-allowed"
                }`}
              disabled={!selectedFile}
              onClick={() => {
                if (selectedFile) {
                  alert(`Processing ${selectedFile.name}...`)
                }
              }}
            >
              Continue
            </Button>

            <p className="text-[#6e6e6e] text-sm mt-6">
              By continuing, you agree to{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Terms of Service</span>,{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Privacy Policy</span>, and{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Cookie Policy</span>
            </p>
          </div>
        </div>

        <OpenQuestion
          heading="A question just for you..."
          question="I see that you've worked on several data analysis projects during your time at XYZ Company. Can you walk me through a specific instance where you faced a significant challenge with a dataset and how you overcame it? I'm particularly interested in understanding your problem-solving process and the tools you used."
          answer={answer1}
          setAnswer={setAnswer1}
        />

        <OpenQuestion
          heading="Let us test your skills..."
          question="I see that you've worked on several data analysis projects during your time at XYZ Company. Can you walk me through a specific instance where you faced a significant challenge with a dataset and how you overcame it? I'm particularly interested in understanding your problem-solving process and the tools you used."
          answer={answer2}
          setAnswer={setAnswer2}
        />

        <OpenQuestion
          heading="What do you want to do at Reply..."
          question="I see that you've worked on several data analysis projects during your time at XYZ Company. Can you walk me through a specific instance where you faced a significant challenge with a dataset and how you overcame it? I'm particularly interested in understanding your problem-solving process and the tools you used."
          answer={answer3}
          setAnswer={setAnswer3}
        />
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 space-y-2">
        <div className="w-3 h-8 bg-[#00ea51] rounded-full"></div>
        <div className="w-3 h-3 bg-[#d6d6d6] rounded-full"></div>
        <div className="w-3 h-3 bg-[#d6d6d6] rounded-full"></div>
      </div>
    </div >
  )
}
