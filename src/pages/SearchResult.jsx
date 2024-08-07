import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchResult = () => {
  const { word } = useParams();
  const [stage, setStage] = useState('countdown');
  const [countdown, setCountdown] = useState(3);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (stage === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStage('flash');
      }
    } else if (stage === 'flash') {
      const flashTimer = setTimeout(() => setStage('blackout'), 50);
      return () => clearTimeout(flashTimer);
    } else if (stage === 'blackout') {
      const blackoutTimer = setTimeout(() => setStage('input'), 1000);
      return () => clearTimeout(blackoutTimer);
    }
  }, [stage, countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = userInput.trim().toLowerCase() === decodeURIComponent(word).toLowerCase();
    setResult(isCorrect);
  };

  const handleFlashAgain = () => {
    setStage('countdown');
    setCountdown(3);
    setResult(null);
    setUserInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <AnimatePresence>
        {stage !== 'input' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
          >
            {stage === 'countdown' && (
              <div className="text-6xl font-normal text-gray-600">{countdown}</div>
            )}
            {stage === 'flash' && (
              <div className="text-6xl font-bold text-white">{decodeURIComponent(word)}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {stage === 'input' && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-600">Word Flash Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {result !== null && (
              <div className={`text-center text-xl font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
                {result ? 'Correct!' : 'Incorrect. Try again!'}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default SearchResult;
