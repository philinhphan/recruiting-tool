import React, { useState } from "react"
import { Button } from "@/components/ui/button"

interface LoadingButtonProps {
  children: React.ReactNode
  onClick: () => Promise<void>
  disabled?: boolean
  className?: string
  loadingText?: string
}

export function LoadingButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  loadingText = "Loading..."
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || loading) return
    
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={`${className} flex items-center justify-center`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-6 w-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}