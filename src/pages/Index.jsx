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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 bg-[length:400%_400%] animate-gradient-xy">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-emerald-600">Rapid Recall</h1>
        <p className="text-xl text-gray-700">Challenge your memory with our tachistoscope-inspired game!</p>
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
          <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">Flash</Button>
        </div>
      </form>
    </div>
  );
};

export default Index;
