"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import CodePopup from "@/components/CodePopup";

// Dynamically import the Editor component to avoid SSR issues
const Editor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

// Sample coding challenges in Python
const CODING_CHALLENGES = [
  {
    prompt: "Write a function that finds the maximum value in a list of numbers.",
    starterCode: "def find_max(numbers):\n    # Your code here\n    pass\n\n# Example usage:\nnumbers = [5, 2, 9, 1, 7]\nprint(find_max(numbers))  # Should output 9",
    language: "Python"
  },
  {
    prompt: "Create a function that checks if a string is a palindrome (reads the same forwards and backwards).",
    starterCode: "def is_palindrome(text):\n    # Your code here\n    pass\n\n# Example usage:\nprint(is_palindrome(\"racecar\"))  # Should output True\nprint(is_palindrome(\"hello\"))  # Should output False",
    language: "Python"
  },
  {
    prompt: "Implement a function that returns the Fibonacci number at a given position. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.",
    starterCode: "def fibonacci(n):\n    # Your code here\n    pass\n\n# Example usage:\nprint(fibonacci(6))  # Should output 8 (0, 1, 1, 2, 3, 5, 8)",
    language: "Python"
  }
];

// Mock execution results for each challenge
const MOCK_EXECUTION_RESULTS = {
  "find_max": "9",
  "is_palindrome": "True\nFalse",
  "fibonacci": "8"
};

export default function Home() {
  // Select a random challenge
  const randomChallenge = CODING_CHALLENGES[Math.floor(Math.random() * CODING_CHALLENGES.length)];
  
  // State for code and execution
  const [userCode, setUserCode] = useState(randomChallenge.starterCode);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  
  // State for code verification popup
  const [showCodePopup, setShowCodePopup] = useState(true);
  
  // Function to simulate code execution
  const runCode = async () => {
    // Prevent multiple executions
    if (isExecuting) {
      return;
    }
    
    setIsExecuting(true);
    setOutput("Running code...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Determine which challenge is being run
      let result = "No output";
      
      if (userCode.includes("find_max")) {
        result = MOCK_EXECUTION_RESULTS.find_max;
      } else if (userCode.includes("is_palindrome")) {
        result = MOCK_EXECUTION_RESULTS.is_palindrome;
      } else if (userCode.includes("fibonacci")) {
        result = MOCK_EXECUTION_RESULTS.fibonacci;
      }
      
      // Check if the user has modified the code
      if (userCode !== randomChallenge.starterCode) {
        // If they've written some actual code, show the expected output
        if (userCode.includes("return") || userCode.includes("print(") || !userCode.includes("pass")) {
          setOutput(result);
        } else {
          // Otherwise show an error
          setOutput("Error: Function implementation is incomplete");
        }
      } else {
        setOutput("Error: You need to implement the function");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : "Failed to execute code"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle code verification
  const handleCodeVerified = () => {
    setShowCodePopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Code verification popup */}
      {showCodePopup && <CodePopup onCodeVerified={handleCodeVerified} />}
      
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Coding Challenge</h1>
          <p className="text-sm text-gray-500">{randomChallenge.language}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">30:00</span>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#FF6B19] via-[#FF6B6B] to-[#FFCC70]"
          >
            Submit <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Instructions */}
        <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <div className="prose prose-sm max-w-none">
              <p>{randomChallenge.prompt}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-medium mb-2">Video Feed</h3>
            <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
              {/* Placeholder for video */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Video feed disabled</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Video recording is disabled for this demo
            </p>
          </div>
        </div>
        
        {/* Right panel - Code editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 bg-gray-800 text-white flex items-center justify-between">
            <Badge variant="outline" className="text-gray-300 border-gray-600">
              {randomChallenge.language}
            </Badge>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white"
                onClick={runCode}
                disabled={isExecuting}
              >
                <Play className="h-4 w-4 mr-1" /> 
                {isExecuting ? "Running..." : "Run"}
              </Button>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className={`${output ? 'h-2/3' : 'h-full'} overflow-hidden`}>
              <Editor
                height="100%"
                defaultValue={userCode}
                value={userCode}
                onChange={(value) => setUserCode(value || "")}
                language="python"
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  readOnly: false,
                  tabSize: 4,
                }}
                className="flex-1 rounded-none border-0 font-mono text-sm"
                loading={
                  <div className="flex items-center justify-center h-full bg-gray-800">
                    <div className="text-white">Loading editor...</div>
                  </div>
                }
              />
            </div>
            
            {/* Output panel */}
            {output && (
              <div className="h-1/3 border-t border-gray-700 bg-gray-900 overflow-auto">
                <div className="p-2 text-xs text-gray-400 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                  <span>Output</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white h-6 px-2"
                    onClick={() => setOutput("")}
                  >
                    Clear
                  </Button>
                </div>
                <pre className="p-3 text-sm text-white font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
