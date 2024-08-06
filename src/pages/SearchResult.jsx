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
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        setError('OpenAI API key is not set. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant that provides concise definitions for words." },
            { role: "user", content: `Define the word "${word}" in a concise manner:` }
          ],
          max_tokens: 100,
          n: 1,
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        setDefinition(response.data.choices[0].message.content.trim());
      } catch (err) {
        console.error('Error fetching definition:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error ${err.response.status}: ${err.response.data.error || 'Unknown error'}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response received from the server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
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
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-gray-500">If this persists, please check your API key or try again later.</p>
            </div>
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
