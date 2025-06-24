"use client"

import type React from "react"

import { Upload, Plus, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { OpenQuestion } from "./open-question"
import { Offerings, OpenPosition } from "./offerings"
import { UserApi } from "./api-client"
import { PersonalityTestSection } from "./personality-test-section"
import { LoadingButton } from "./loading-button"

export default function Component() {
  const client = new UserApi();

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uuid, setUuid] = useState<string>("")
  const [question1, setQuestion1] = useState<string>("")
  const [question2, setQuestion2] = useState<string>("")
  const [question3, setQuestion3] = useState<string>("")
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const personalityTestRef = useRef<HTMLDivElement>(null)
  const firstQuestionRef = useRef<HTMLDivElement>(null)
  const secondQuestionRef = useRef<HTMLDivElement>(null)
  const thirdQuestionRef = useRef<HTMLDivElement>(null)
  const openPositionRef = useRef<HTMLDivElement>(null)

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
            <div className="flex justify-center">
              <LoadingButton
                disabled={!selectedFile}
                onClick={async () => {
                  if (selectedFile) {
                    const response = await client.uploadFilePost(selectedFile)
                    const userInfo = await client.getUserinfoByFileFileFidUserdataGet(response.data)
                    const user = await client.createUserUserPost(userInfo.data)
                    setUuid(user.data.uuid === undefined ? "" : user.data.uuid);
                    if (user.data.uuid !== undefined) {
                      const question = await client.getQuestionByUserUserUidQuestionQidGet(user.data.uuid, 0)
                      setQuestion1(question.data)

                      // Scroll to first question after a short delay
                      setTimeout(() => {
                        personalityTestRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 100);
                    }
                  }
                }}
              >
                Continue
              </LoadingButton>
            </div>

            <p className="text-[#6e6e6e] text-sm mt-6">
              By continuing, you agree to{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Terms of Service</span>,{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Privacy Policy</span>, and{" "}
              <span className="text-[#00ea51] cursor-pointer hover:underline">Cookie Policy</span>
            </p>
          </div>
        </div>

        <div ref={personalityTestRef}>
        <PersonalityTestSection
          heading="Test"
          jumpTo={firstQuestionRef}
          description="To better understand your skills and preferences, I have prepared a short personality test. This will help me find the best job opportunities for you at Reply."
          questions={["test question 1", "test question 2", "test question 3", "test question 4", "test question 5"]}
        />
        </div>

        <div ref={firstQuestionRef}>
          <OpenQuestion
            heading="A question just for you..."
            question={question1}
            jumpTo={secondQuestionRef}
            onContinue={async (answer) => {
              const data = {
                question: question1,
                answer: answer
              }

              await client.postQuestionByUserUserUidQuestionPost(uuid, data)
              const question = await client.getQuestionByUserUserUidQuestionQidGet(uuid, 1)
              setQuestion2(question.data);
            }}
          />
        </div>

        <div ref={secondQuestionRef}>
          <OpenQuestion
            heading="Let us test your skills..."
            question={question2}
            jumpTo={thirdQuestionRef}
            onContinue={async (answer) => {
              const data = {
                question: question2,
                answer: answer
              }

              await client.postQuestionByUserUserUidQuestionPost(uuid, data)
              const question = await client.getQuestionByUserUserUidQuestionQidGet(uuid, 2)
              setQuestion3(question.data)
            }}
          />
        </div>

        <div ref={thirdQuestionRef}>
          <OpenQuestion
            heading="What do you want to do at Reply..."
            question={question3}
            jumpTo={openPositionRef}
            onContinue={async (answer) => {
              const data = {
                question: question3,
                answer: answer
              }

              await client.postQuestionByUserUserUidQuestionPost(uuid, data)
              const positions = await client.getOfferingsByUserUserUidOfferingsGet(uuid)
              const test = positions.data;
              setOpenPositions(test.output.map((item) => ({
                title: item.title,
                description: item.description,
                location: item.locations.join(", ")
              })));
            }}
          />
        </div>

        <div ref={openPositionRef}>
          <Offerings
            heading="Top job positions for you"
            openPositions={openPositions}
          />
        </div>


        {/* Progress Indicator */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 space-y-2">
          <div className="w-3 h-8 bg-[#00ea51] rounded-full"></div>
          <div className="w-3 h-3 bg-[#d6d6d6] rounded-full"></div>
          <div className="w-3 h-3 bg-[#d6d6d6] rounded-full"></div>
        </div>
      </div >
    </div>
  )
}
