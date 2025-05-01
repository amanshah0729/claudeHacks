"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  // Handle input change for each digit
  const handleInputChange = (index: number, value: string) => {
    // Only allow single characters
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    
    // Only allow alphanumeric characters
    if (!/^[A-Z0-9]$/i.test(value) && value !== "") {
      return;
    }
    
    // Update the code array
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    
    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().toUpperCase();
    
    // If pasted data is exactly 6 characters, fill all inputs
    if (/^[A-Z0-9]{6}$/i.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      
      // Focus the last input
      const lastInput = document.getElementById("code-input-5");
      if (lastInput) {
        lastInput.focus();
      }
    }
  };
  
  // Verify the code
  const verifyCode = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For this demo, we'll check against localStorage
      const fullCode = code.join("");
      const storedCode = localStorage.getItem("interviewAccessCode");
      const timestamp = localStorage.getItem("interviewAccessCodeTimestamp");
      
      // Check if code exists and is not expired (15 minutes)
      if (!storedCode || !timestamp) {
        setError("No active session found. Please refresh the interview page.");
        return;
      }
      
      const codeAge = Date.now() - parseInt(timestamp);
      if (codeAge > 15 * 60 * 1000) { // 15 minutes
        setError("Code has expired. Please refresh the interview page.");
        return;
      }
      
      // Verify the code
      if (fullCode !== storedCode) {
        setError("Invalid code. Please try again.");
        return;
      }
      
      // Mark as verified
      localStorage.setItem("interviewAccessCodeVerified", "true");
      setSuccess(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Enter Interview Access Code
        </h1>
        
        {!success ? (
          <>
            <p className="text-gray-600 text-center mb-8">
              Enter the 6-character code displayed on the interview screen
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-6 gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-16 text-center text-2xl font-bold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}
            
            <Button
              onClick={verifyCode}
              disabled={code.join("").length !== 6 || isVerifying}
              className="w-full py-6 bg-gradient-to-r from-[#FF6B19] via-[#FF6B6B] to-[#FFCC70]"
            >
              {isVerifying ? "Verifying..." : "Start Interview"}
            </Button>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Code Verified!</h2>
            <p className="text-gray-600 mb-4">
              The interview will begin automatically on the other device.
            </p>
            <p className="text-sm text-gray-500">
              You can close this window now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 