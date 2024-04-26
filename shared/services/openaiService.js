// shared/services/openaiService.js

const axios = require('axios');
const logger = require('../utils/logger'); 

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 确保你在.env文件中设置了OPENAI_API_KEY环境变量

async function generateText(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 60,
            n: 1,
            stop: null,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error fetching data from OpenAI:', error);
        throw error;
    }
}

async function getMockData() {
    try {
        const response = await axios.get('http://localhost:4000/api/data');
        logger.info(`[openaiService.js] getMockData: Successfully fetched mock data: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        logger.error('Error fetching mock data:', error);
        throw error;
    }
}

module.exports = {
    generateText,
    getMockData,
};