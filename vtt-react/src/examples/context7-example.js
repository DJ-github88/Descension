/**
 * This is an example file demonstrating how to use Context7 in your code.
 * 
 * When working with AI coding assistants like Cursor, Claude Desktop, VS Code with Copilot, etc.,
 * you can use Context7 by adding `use context7` to your prompts.
 * 
 * Example prompts:
 * 
 * 1. "Create a React component that fetches data from an API. use context7"
 * 2. "How do I implement authentication with NextAuth.js? use context7"
 * 3. "Show me how to use the zustand library for state management. use context7"
 * 
 * Context7 will fetch up-to-date documentation and code examples for the libraries
 * mentioned in your prompt, ensuring that the AI assistant provides accurate and
 * current information.
 */

// Example React component created with Context7 assistance
import React, { useState, useEffect } from 'react';

function DataFetchingExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function was created with help from Context7
    // by asking: "Create a React component that fetches data from an API. use context7"
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Data from API</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetchingExample;
