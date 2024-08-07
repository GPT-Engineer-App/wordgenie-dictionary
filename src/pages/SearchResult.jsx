import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue } from "framer-motion";
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SearchResult = () => {
  const { word } = useParams();
  const [stage, setStage] = useState('countdown');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);
  const [definition, setDefinition] = useState('');
  const [significantWord, setSignificantWord] = useState('');
  const [significantWordDefinition, setSignificantWordDefinition] = useState('');
  const [showCountdownBar, setShowCountdownBar] = useState(true);
  const countdownProgress = useMotionValue(100);
  const fetchDefinition = useCallback(async (word) => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.data && response.data.length > 0) {
        const firstMeaning = response.data[0].meanings[0];
        if (firstMeaning && firstMeaning.definitions.length > 0) {
          const def = firstMeaning.definitions[0].definition;
          setDefinition(def);
          findSignificantWord(def);
        }
      }
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('Definition not found.');
    }
  }, []);

  const findSignificantWord = (text) => {
    const words = text.split(/\s+/).map(word => word.toLowerCase().replace(/[^a-z]/g, ''));
    const wordFrequency = {};
    words.forEach(word => {
      if (word.length > 2) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after']);
    const uncommonWords = Object.keys(wordFrequency).filter(word => !commonWords.has(word));

    if (uncommonWords.length > 0) {
      // Sort by frequency (ascending) and then by length (descending)
      uncommonWords.sort((a, b) => {
        if (wordFrequency[a] !== wordFrequency[b]) {
          return wordFrequency[a] - wordFrequency[b];
        }
        return b.length - a.length;
      });
      setSignificantWord(uncommonWords[0]);
    } else {
      // If no uncommon words are found, pick the longest word
      const longestWord = words.reduce((longest, current) => 
        current.length > longest.length ? current : longest
      , '');
      setSignificantWord(longestWord);
    }
  };

  const fetchSignificantWordDefinition = async () => {
    if (significantWord) {
      try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${significantWord}`);
        if (response.data && response.data.length > 0) {
          const firstMeaning = response.data[0].meanings[0];
          if (firstMeaning && firstMeaning.definitions.length > 0) {
            setSignificantWordDefinition(firstMeaning.definitions[0].definition);
          }
        }
      } catch (error) {
        console.error('Error fetching significant word definition:', error);
        setSignificantWordDefinition('Definition not found.');
      }
    }
  };

  useEffect(() => {
    if (stage === 'countdown') {
      const timer = setTimeout(() => {
        setStage('flash');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (stage === 'flash') {
      const flashTimer = setTimeout(() => setStage('input'), 50);
      return () => clearTimeout(flashTimer);
    }
  }, [stage]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (stage === 'input') {
        if (e.key === 'Enter') {
          handleSubmit();
        } else if (e.key === 'Backspace') {
          setUserInput((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1) {
          setUserInput((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, userInput]);

  const handleSubmit = () => {
    const isCorrect = userInput.trim().toLowerCase() === decodeURIComponent(word).toLowerCase();
    setResult(isCorrect);
    fetchDefinition(decodeURIComponent(word));
    setStage('result');
  };

  const handleFlashAgain = () => {
    setStage('countdown');
    setShowCountdownBar(true);
    countdownProgress.set(100);
    setResult(null);
    setUserInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        >
          {stage === 'countdown' && showCountdownBar && (
            <div className="w-[400px] h-2.5 mb-4 bg-transparent relative">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-gray-400"
                style={{ width: countdownProgress }}
                onAnimationComplete={() => {
                  setShowCountdownBar(false);
                }}
              />
            </div>
          )}
          {stage === 'flash' && (
            <div className="text-6xl font-bold text-white h-[100px] flex items-center justify-center py-5">
              {decodeURIComponent(word)}
            </div>
          )}
          {(stage === 'flash' || stage === 'input') && (
            <div className="flex flex-col items-center w-full">
              <div className="text-6xl font-bold text-white flex items-center justify-center h-[100px] py-5 relative">
                {stage === 'input' ? userInput : ''}
                <span className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-[2px] h-[60px] bg-white"></span>
              </div>
              <p className={`text-sm mt-4 ${stage === 'flash' ? 'text-black' : 'text-gray-400'}`}>
                Type what you just saw and then press Enter
              </p>
            </div>
          )}
          {stage === 'result' && (
            <div className="text-center">
              <div className={`text-xl font-bold mb-4 ${result ? 'text-green-400' : 'text-red-400'}`}>
                {result ? 'Correct!' : 'Incorrect.'}
              </div>
              <div className="text-2xl font-bold text-white mb-4">
                The word was: {decodeURIComponent(word)}
              </div>
              {definition && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white max-w-2xl">
                  <h3 className="text-lg font-semibold mb-2">Definition:</h3>
                  <p>
                    {definition.split(/(\s+)/).map((part, index) => {
                      if (/\s+/.test(part)) {
                        return part;
                      }
                      const word = part.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
                      const isSignificant = word.toLowerCase() === significantWord.toLowerCase();
                      return isSignificant ? (
                        <Popover key={index}>
                          <PopoverTrigger asChild>
                            <span 
                              className="cursor-pointer font-bold text-blue-400 hover:underline"
                              onClick={() => fetchSignificantWordDefinition()}
                            >
                              {part}
                            </span>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 bg-gray-700 text-white border-gray-600">
                            <h4 className="font-semibold mb-2">{word}</h4>
                            <p>{significantWordDefinition || 'Loading...'}</p>
                          </PopoverContent>
                        </Popover>
                      ) : part;
                    })}
                  </p>
                </div>
              )}
              <div className="mt-8 space-x-4">
                <Button onClick={handleFlashAgain} className="bg-emerald-700 hover:bg-emerald-800">
                  <Zap className="mr-2 h-4 w-4" /> Flash Again
                </Button>
                <Link to="/">
                  <Button className="bg-blue-700 hover:bg-blue-800">Try New Word</Button>
                </Link>
                <Link to="/">
                  <Button className="bg-gray-700 hover:bg-gray-800">Back to Home</Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SearchResult;
