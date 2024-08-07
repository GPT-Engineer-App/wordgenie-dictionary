import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [word, setWord] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      navigate(`/flash/${encodeURIComponent(word.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Word Flash Challenge</h1>
        <p className="text-xl text-gray-600">Test your memory with our tachistoscope-like game!</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter a word or phrase..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Flash</Button>
        </div>
      </form>
    </div>
  );
};

export default Index;
