import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">AI-Powered Dictionary</h1>
        <p className="text-xl text-gray-600">Discover definitions with the power of AI</p>
      </div>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter a word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
    </div>
  );
};

export default Index;
