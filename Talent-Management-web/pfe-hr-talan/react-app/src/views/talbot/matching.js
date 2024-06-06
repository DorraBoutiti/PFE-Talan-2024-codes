import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Typography, TextField, Button, Card, CardContent, Grid, CircularProgress, IconButton, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import ReactMarkdown from 'react-markdown';
import { Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import logoImage from './Assets/talan.png';

const parseCompetencesAndNiveaux = (str) => {
    if (!str) {
        return [];
    }

    // Remove the square brackets and split the string by comma
    const items = str.slice(1, -1).split(', ');

    // Extract the values and trim the whitespace
    return items.map((item) => item.trim().replace(/'/g, ''));
};

const extractRelevantDescription = (description) => {
    if (!description) {
        return {
            poste: 'N/A',
            classification: 'N/A',
            niveauExperience: 'N/A'
        };
    }

    const posteMatch = description.match(/Poste:\s*([^,]*)/);
    const classificationMatch = description.match(/Classification:\s*([^,]*)/);
    const niveauExperienceMatch = description.match(/Niveau d'expérience:\s*([^,]*)/);

    return {
        poste: posteMatch ? posteMatch[1].trim() : 'N/A',
        classification: classificationMatch ? classificationMatch[1].trim() : 'N/A',
        niveauExperience: niveauExperienceMatch ? niveauExperienceMatch[1].trim() : 'N/A'
    };
};

const ChatbotInterface = () => {
    const [inputValue, setInputValue] = useState(localStorage.getItem('inputValue') || '');
    const [numTopMatches, setNumTopMatches] = useState(localStorage.getItem('numTopMatches') || 5);
    const [chatHistory3, setChatHistory] = useState(JSON.parse(localStorage.getItem('chatHistory3')) || []);
    const [isBotResponding, setIsBotResponding] = useState(false);
    const [error, setError] = useState('');
    const [isTableView, setIsTableView] = useState(false);
    const [tableData, setTableData] = useState(JSON.parse(localStorage.getItem('tableData')) || []);
    const [lastSentMessage, setLastSentMessage] = useState('');
    const chatContainerRef = useRef(null);
    const tableRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory3, isBotResponding]);

    useEffect(() => {
        localStorage.setItem('inputValue', inputValue);
    }, [inputValue]);

    useEffect(() => {
        localStorage.setItem('numTopMatches', numTopMatches);
    }, [numTopMatches]);

    useEffect(() => {
        localStorage.setItem('chatHistory3', JSON.stringify(chatHistory3));
    }, [chatHistory3]);

    useEffect(() => {
        localStorage.setItem('tableData', JSON.stringify(tableData));
    }, [tableData]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleNumTopMatchesChange = (event) => {
        setNumTopMatches(event.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            const message = inputValue.trim();
            setChatHistory([...chatHistory3, { message, type: 'user' }]);
            // Store the current inputValue in localStorage before clearing it
            setLastSentMessage(message);
            setInputValue('');
            setIsBotResponding(true);
            setError('');

            try {
                const response = await axios.post('http://localhost:4500/api_matching/', { text: message, numTopMatches: parseInt(numTopMatches) });
                if (response.status === 200) {
                    const data = response.data.response;
                    const table = response.data.table;
                    setChatHistory(prevChatHistory => [
                        ...prevChatHistory,
                        { message: data, type: 'bot' }
                    ]);
                    setTableData(table);

                    console.log("Table Data:", table);

                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                setError('Failed to send message: ' + error.message);
            } finally {
                setIsBotResponding(false);
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setChatHistory([]);
        setInputValue('');
        setTableData([]);
        localStorage.removeItem('chatHistory3');
        localStorage.removeItem('inputValue');
        localStorage.removeItem('numTopMatches');
        localStorage.removeItem('tableData');
    };

    const toggleView = () => {
        setIsTableView(!isTableView);
    };

    const [openRows, setOpenRows] = useState([]);

    const handleRowClick = (rowIndex) => {
        if (openRows.includes(rowIndex)) {
            setOpenRows(openRows.filter((index) => index !== rowIndex));
        } else {
            setOpenRows([...openRows, rowIndex]);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case '0':
                return 'rgba(255, 0, 0, 0.2)'; // Semi-transparent red
            case '1':
                return 'rgba(255, 0, 0, 0.2)'; // Semi-transparent red
            case '2':
                return 'rgba(255, 165, 0, 0.2)'; // Semi-transparent orange
            case '3':
                return 'rgba(255, 255, 0, 0.2)'; // Semi-transparent yellow
            case '4':
                return 'rgba(0, 128, 0, 0.2)'; // Semi-transparent green
            case '5':
                return 'rgba(0, 100, 0, 0.4)'; // Semi-transparent darker green
            default:
                return 'transparent'; // Default to transparent
        }
    };

    const downloadTableAsPDF = async () => {
        const tableElement = tableRef.current;
        const canvas = await html2canvas(tableElement);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190; // Adjust width to fit the PDF page
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        const jobDescription = lastSentMessage.trim();
        pdf.text("Job Description:", 10, 10);
        pdf.text(jobDescription, 10, 20);

        // Add the logo image
        const logoWidth = 30; // Adjust the logo width as needed
        const logoHeight = 15; // Adjust the logo height as needed
        const logoX = pdf.internal.pageSize.getWidth() - logoWidth - 10; // Position the logo 10 units from the right edge
        const logoY = 10; // Position the logo 10 units from the top edge
        pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);

        pdf.addImage(imgData, 'PNG', 10, 40, imgWidth, imgHeight);

        const fileName = jobDescription.length > 0 ? `${jobDescription}-job matching.pdf` : 'table.pdf';
        pdf.save(fileName);
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '0vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
            <Card sx={{ maxWidth: 1200, width: '100%', backgroundColor: '#ffffff', boxShadow: 3, borderRadius: 2, padding: 2 }}>
                <CardContent sx={{ padding: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', display: 'flex', alignItems: 'center' }}>
                            <ChatIcon sx={{ marginRight: 1 }} /> Job Description Matcher
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <IconButton color="primary" onClick={toggleView}>
                                <ViewListIcon />
                            </IconButton>
                            {isTableView && (
                                <IconButton color="primary" onClick={downloadTableAsPDF}>
                                    <DownloadIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                    {!isTableView ? (
                        <>
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
                                {chatHistory3.map((chat, index) => (
                                    <Paper
                                        key={index}
                                        sx={{
                                            textAlign: chat.type === 'user' ? 'right' : 'left',
                                            marginBottom: 3,
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
                                            Bot is responding, this may take a minute...
                                        </Typography>
                                    </Box>
                                )}
                                {error && (
                                    <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                        {error}
                                    </Typography>
                                )}
                            </Box>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <IconButton
                                        color="secondary"
                                        onClick={clearChat}
                                        sx={{ marginRight: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        fullWidth
                                        label="Please provide a job description"
                                        variant="outlined"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        sx={{ backgroundColor: '#ffffff' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Top Matches"
                                        type="number"
                                        variant="outlined"
                                        value={numTopMatches}
                                        onChange={handleNumTopMatchesChange}
                                        sx={{ width: 100, backgroundColor: '#ffffff' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        onClick={handleSendMessage}
                                        sx={{ backgroundColor: '#2196f3', color: '#ffffff' }}
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table size="small" ref={tableRef}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Classification</TableCell>
                                        <TableCell>Experience</TableCell>
                                        <TableCell>Position</TableCell>
                                        <TableCell colSpan={2}>Skills and Levels</TableCell>
                                        <TableCell>Sim%</TableCell> {/* New column */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, rowIndex) => {
                                        const { poste, classification, niveauExperience } = extractRelevantDescription(row.Description);
                                        const competences = parseCompetencesAndNiveaux(row.competence);
                                        const niveaux = parseCompetencesAndNiveaux(row.niveau);

                                        return (
                                            <React.Fragment key={rowIndex}>
                                                <TableRow hover onClick={() => handleRowClick(rowIndex)}>
                                                    <TableCell>{row.Matricule}</TableCell>
                                                    <TableCell>{classification}</TableCell>
                                                    <TableCell>{niveauExperience}</TableCell>
                                                    <TableCell>{poste}</TableCell>
                                                    <TableCell colSpan={2}>
                                                        <IconButton size="small" onClick={() => handleRowClick(rowIndex)}>
                                                            {openRows.includes(rowIndex) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{row.similarity}%</TableCell> {/* New column */}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                        <Collapse in={openRows.includes(rowIndex)} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Skill</TableCell>
                                                                            <TableCell>Level</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {competences.map((comp, index) => (
                                                                            <TableRow
                                                                                key={`${rowIndex}-${index}`}
                                                                                sx={{
                                                                                    '& > *:nth-child(1)': {
                                                                                        backgroundColor: `rgba(255, 255, 255, 255)`,
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <TableCell>{comp}</TableCell>
                                                                                <TableCell sx={{ backgroundColor: getLevelColor(niveaux[index]) }}>
                                                                                    {niveaux[index]}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChatbotInterface;
