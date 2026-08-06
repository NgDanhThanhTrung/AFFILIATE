'use client'

import React, { useState, useRef, useEffect } from 'react'

interface PinInputProps {
  length?: number
  onComplete: (pin: string) => void
  error?: string
}

export function PinInput({ length = 6, onComplete, error }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '')

    const newPin = [...pin]
    newPin[index] = numericValue.slice(-1) // Take only last character
    setPin(newPin)

    // Move to next input if value is entered
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if PIN is complete
    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

    if (pastedData) {
      const newPin = [...pin]
      pastedData.split('').forEach((char, i) => {
        if (i < length) newPin[i] = char
      })
      setPin(newPin)

      // Focus on the next empty input or the last one
      const nextEmptyIndex = newPin.findIndex((digit) => digit === '')
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex
      inputRefs.current[focusIndex]?.focus()

      if (newPin.every((digit) => digit !== '')) {
        onComplete(newPin.join(''))
      }
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
