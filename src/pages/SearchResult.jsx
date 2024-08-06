import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThreeDots } from 'react-loader-spinner';

const SearchResult = () => {
  const { word } = useParams();
  const [definition, setDefinition] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true);
        // Replace this with your actual AI API endpoint
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
          prompt: `Define the word "${word}":`,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY_HERE`,
            'Content-Type': 'application/json',
          },
        });
        setDefinition(response.data.choices[0].text.trim());
      } catch (err) {
        setError('Failed to fetch definition. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">{word}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ThreeDots color="#3B82F6" height={50} width={50} />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <p className="text-lg text-gray-700">{definition}</p>
          )}
        </CardContent>
      </Card>
      <Link to="/" className="mt-8">
        <Button>Back to Search</Button>
      </Link>
    </div>
  );
};

export default SearchResult;
