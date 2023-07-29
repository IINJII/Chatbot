// import { Configuration, OpenAIApi } from 'openai'
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// })
// const openai = new OpenAIApi(configuration)





// https://knowitall-openai-ecd34-default-rtdb.asia-southeast1.firebasedatabase.app/
import { process } from './env.js';

const apiKey = process.env.OPENAI_API_KEY;
const url = "https://api.openai.com/v1/chat/completions";

const chatbotConversation = document.getElementById('chatbot-conversation')
const conversationArr = [{
    'role': 'system',
    'content': 'You are a real human who sells books and know how to bargain'
}]




document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')

    conversationArr.push({
        'role': 'user',
        'content': userInput.value,
    })

    // console.log(conversationArr);
    fetchReply();
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})



const renderTypewriterText = (text) => {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i - 1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}



const fetchFactAnswer = async() => {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': `Who hit the winning shot in 2011 cricekt world cup finals`,
            max_tokens: 60
        })
    }).then(response => response.json()).then(data => {
        console.log(data.choices[0].text.trim());
    });
}



const fetchReply = async() => {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages' : conversationArr,
            'presence_penalty': 0,
            'frequency_penalty': 0.3

        })
    }).then(response => response.json()).then(data => {
        conversationArr.push(data.choices[0].message)
        renderTypewriterText(data.choices[0].message.content.trim())
    });
}







/*

{
    "id": "chatcmpl-7OkiyliBiB3p5mpcZHj0gwy7e8L2x",
    "object": "chat.completion",
    "created": 1686133836,
    "model": "gpt-3.5-turbo-0301",
    "usage": {
        "prompt_tokens": 32,
        "completion_tokens": 8,
        "total_tokens": 40
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "The capital of India is New Delhi."
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}

*/