import React, { useState, useEffect, useRef } from 'react';
import { Typography, TextField, Button, Card, CardContent, Grid, CircularProgress, IconButton, Box, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import ClearIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';

const ChatbotInterface = () => {
    const [inputValue, setInputValue] = useState(localStorage.getItem('inputValue') || '');
    const [chatHistory2, setChatHistory] = useState(JSON.parse(localStorage.getItem('chatHistory2')) || []);
    const [isBotResponding, setIsBotResponding] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chatHistory2, isBotResponding]);

    useEffect(() => {
        localStorage.setItem('inputValue', inputValue);
    }, [inputValue]);

    useEffect(() => {
        localStorage.setItem('chatHistory2', JSON.stringify(chatHistory2));
    }, [chatHistory2]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            const message = inputValue.trim();
            setChatHistory([...chatHistory2, { message, type: 'user' }]);
            setInputValue('');
            setIsBotResponding(true);

            try {
                const response = await fetch('http://localhost:4000/rag/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });
                if (response.ok) {
                    const data = await response.json();
                    const botResponse = data.message;
                    setChatHistory(prevChatHistory => [
                        ...prevChatHistory,
                        { message: botResponse, type: 'bot' }
                    ]);
                } else {
                    console.error('Failed to send message:', response.statusText);
                    setChatHistory(prevChatHistory => [
                        ...prevChatHistory,
                        { message: 'Error: Failed to get a response from the server.', type: 'bot' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to send message:', error.message);
                setChatHistory(prevChatHistory => [
                    ...prevChatHistory,
                    { message: 'Error: Network error. Please try again later.', type: 'bot' }
                ]);
            } finally {
                setIsBotResponding(false);
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setChatHistory([]);
        localStorage.removeItem('chatHistory2');
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '0vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
            <Card sx={{ maxWidth: 1000, width: '100%', backgroundColor: '#ffffff', boxShadow: 3, borderRadius: 2, padding: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', display: 'flex', alignItems: 'center' }}>
                        <ChatIcon sx={{ marginRight: 1 }} /> CHAT WITH COMPANY DATA
                    </Typography>
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 300,
                            maxHeight: 500,
                            overflowY: 'auto',
                            padding: 2,
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            marginBottom: 2,
                            boxShadow: 1
                        }}
                    >
                        {chatHistory2.map((chat, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    textAlign: chat.type === 'user' ? 'right' : 'left',
                                    marginBottom: 2,
                                    padding: 1,
                                    borderRadius: 5,
                                    backgroundColor: chat.type === 'user' ? 'rgba(33, 150, 243, 0.5)' : 'rgba(237, 231, 246, 0.5)',
                                    color: chat.type === 'user' ? '#ffffff' : '#000000',
                                    alignSelf: chat.type === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    animation: 'fadeIn 0.3s ease-in-out'
                                }}
                            >
                                <Typography variant="body1">
                                    {chat.type === 'user' ? (
                                        chat.message
                                    ) : (
                                        <ReactMarkdown>{chat.message}</ReactMarkdown>
                                    )}
                                </Typography>
                            </Paper>
                        ))}
                        {isBotResponding && (
                            <Box sx={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                                    Bot is responding...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <IconButton
                                color="secondary"
                                onClick={handleClearChat}
                                sx={{ marginRight: 1, backgroundColor: '#ffffff', borderRadius: '50%' }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="Type your message"
                                variant="outlined"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleSendMessage}
                                sx={{ backgroundColor: '#2196f3', color: '#ffffff', borderRadius: 2 }}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChatbotInterface;
