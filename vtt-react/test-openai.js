require('dotenv').config();

const testOpenAI = async () => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    console.log('Testing OpenAI API connection...');
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: "Say 'API test successful!'"
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API call failed');
        }

        const data = await response.json();
        console.log('API Response:', data.choices[0].message.content);
        console.log('API test completed successfully!');
    } catch (error) {
        console.error('API Test Error:', error.message);
    }
};

testOpenAI();
