"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CodePopupProps {
  onCodeVerified: () => void;
}

export default function CodePopup({ onCodeVerified }: CodePopupProps) {
  const [accessCode, setAccessCode] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to ensure code generation only happens on the client
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    const generateCode = () => {
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    const code = generateCode();
    setAccessCode(code);
    
    // Store the code in localStorage for verification
    localStorage.setItem('interviewAccessCode', code);
    localStorage.setItem('interviewAccessCodeTimestamp', Date.now().toString());
    
    // Set the base URL for the verification page
    setBaseUrl(window.location.origin);
    
    // Set up polling to check if code has been verified
    const interval = setInterval(() => {
      const verified = localStorage.getItem('interviewAccessCodeVerified');
      if (verified === 'true') {
        onCodeVerified();
        localStorage.removeItem('interviewAccessCodeVerified');
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [onCodeVerified]);
  
  // Function to bypass verification
  const handleBypass = () => {
    onCodeVerified();
  };
  
  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Enter this code to begin</h2>
        
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-6 gap-2">
            {accessCode.split('').map((char, index) => (
              <div 
                key={index} 
                className="w-12 h-16 flex items-center justify-center bg-gray-100 rounded-md text-3xl font-bold"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Go to the following URL on another device and enter this code:
        </p>
        
        <div className="bg-gray-100 p-3 rounded-md mb-6 font-mono text-center break-all">
          {baseUrl}/verify-code
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            This code will expire in 15 minutes
          </p>
          
          {/* Backdoor button styled to be subtle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-gray-600"
            onClick={handleBypass}
          >
            Skip Verification
          </Button>
        </div>
      </div>
    </div>
  );
} 