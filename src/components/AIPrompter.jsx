// src/components/AIPrompter.jsx
import { useState, useEffect } from 'react';

const AIPrompter = ({ sectionTitle, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState([]);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt: `As an academic coach, generate 3 critical thinking questions for the "${sectionTitle}" section of a scientific essay. Focus on: ${content}`,
          stream: false
        })
      });
      const data = await response.json();
      setPrompts(data.response.split('\n').filter(p => p.trim()));
    } catch (error) {
      console.error("AI Error:", error);
      setPrompts(["AI service unavailable - try again later"]);
    }
    setIsLoading(false);
  };

  return (
    <div className="ai-prompter">
      <h4>AI Thinking Coach</h4>
      <button onClick={fetchPrompts} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Get Prompts'}
      </button>
      <div className="prompts">
        {prompts.map((prompt, index) => (
          <div key={index} className="prompt">💡 {prompt}</div>
        ))}
      </div>
    </div>
  );
}; export default AIPrompter;