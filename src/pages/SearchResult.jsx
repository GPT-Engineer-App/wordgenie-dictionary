import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

const SearchResult = () => {
  const { word } = useParams();
  const [showWord, setShowWord] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (showWord) {
      const timer = setTimeout(() => {
        setShowWord(false);
      }, 500); // Show the word for 500ms
      return () => clearTimeout(timer);
    }
  }, [showWord]);

  useEffect(() => {
    setShowWord(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = userInput.trim().toLowerCase() === decodeURIComponent(word).toLowerCase();
    setResult(isCorrect);
  };

  const handleFlashAgain = () => {
    setShowWord(true);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">Word Flash Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showWord ? (
            <div className="text-4xl font-bold text-center">{decodeURIComponent(word)}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Type the word you saw..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">Check</Button>
                <Button type="button" onClick={handleFlashAgain} className="flex-1">
                  <Zap className="mr-2 h-4 w-4" /> Flash Again
                </Button>
              </div>
            </form>
          )}
          {result !== null && (
            <div className={`text-center text-xl font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
              {result ? 'Correct!' : 'Incorrect. Try again!'}
            </div>
          )}
        </CardContent>
      </Card>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default SearchResult;
