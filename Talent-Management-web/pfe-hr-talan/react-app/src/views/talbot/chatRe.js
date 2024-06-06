import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button, TextField, Container, Box, Grid, Paper, IconButton, CircularProgress, Typography } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';
import logoImage from './Assets/talan.png';

function App() {
  const [employeeId1, setEmployeeId1] = useState(localStorage.getItem('employeeId1') || '');
  const [employeeId2, setEmployeeId2] = useState(localStorage.getItem('employeeId2') || '');
  const [response1, setResponse1] = useState(localStorage.getItem('response1') || '**Please provide an employee ID**');
  const [response2, setResponse2] = useState(localStorage.getItem('response2') || '**Please provide an employee ID**');
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const responseRef1 = useRef(null);
  const responseRef2 = useRef(null);

  useEffect(() => {
    localStorage.setItem('employeeId1', employeeId1);
    localStorage.setItem('employeeId2', employeeId2);
    localStorage.setItem('response1', response1);
    localStorage.setItem('response2', response2);
  }, [employeeId1, employeeId2, response1, response2]);

  const handleRecommendation = (url, setEmployeeId, setResponse, employeeId, responseKey, setLoading, recommendationTypeKey) => {
    if (!employeeId.trim()) {
      setResponse('**Please provide an employee ID**');
      return;
    }

    setLoading(true);
    setResponse('**Generating recommendation...**');

    axios.post(url, { employeeId: employeeId })
      .then((res) => {
        const responseText = res.data.response;
        if (responseText) {
          setResponse(responseText);
          localStorage.setItem(responseKey, responseText);
          localStorage.setItem(recommendationTypeKey, url.includes('api2') ? 'Professional' : 'Learning');
        } else {
          setResponse('**Error: No recommendation received. Check the ID or try later.**');
        }
      })
      .catch((err) => {
        console.error(err);
        setResponse('**Error generating recommendation. Check the ID or try later.**');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleSplitScreen = () => {
    setIsSplitScreen(!isSplitScreen);
  };

  const clearFields = () => {
    setEmployeeId1('');
    setEmployeeId2('');
    setResponse1('**Please provide an employee ID**');
    setResponse2('**Please provide an employee ID**');
    localStorage.removeItem('employeeId1');
    localStorage.removeItem('employeeId2');
    localStorage.removeItem('response1');
    localStorage.removeItem('response2');
    localStorage.removeItem('recommendationType1');
    localStorage.removeItem('recommendationType2');
  };

  const downloadReport = (employeeId, recommendationType, responseRef) => {
    const filename = `${recommendationType} - ${employeeId}.pdf`;
  
    html2canvas(responseRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(12);
      pdf.text(`Employee ID: ${employeeId}`, 10, 10);
      pdf.text(`Recommendation Type: ${recommendationType}`, 10, 16);
  
      // Add the logo image
      const logoWidth = 30; // Adjust the logo width as needed
      const logoHeight = 15; // Adjust the logo height as needed
      const logoX = pdf.internal.pageSize.getWidth() - logoWidth - 10; // Position the logo 10 units from the right edge
      const logoY = 10; // Position the logo 10 units from the top edge
      pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight);
      pdf.save(filename);
    }).catch(err => {
      console.error('Error capturing the recommendation:', err);
    });
  };

  return (
    <Container className={`container ${isSplitScreen ? 'split-screen' : ''}`}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton
          color="primary"
          onClick={toggleSplitScreen}
          className="toggle-button"
        >
          <ViewModuleIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={clearFields}
          className="clear-button"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2} className="zones-container">
        <Grid item xs={12} md={isSplitScreen ? 6 : 12}>
          <Paper className="zone" elevation={3}>
            <TextField
              label="Enter employee ID"
              variant="outlined"
              fullWidth
              value={employeeId1}
              onChange={(e) => setEmployeeId1(e.target.value)}
              className="input-box"
            />
            <Box className="button-group">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRecommendation('http://localhost:4500/api/', setEmployeeId1, setResponse1, employeeId1, 'response1', setLoading1, 'recommendationType1')}
                className="button learning"
              >
                Learning recommendation
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRecommendation('http://localhost:4500/api2/', setEmployeeId1, setResponse1, employeeId1, 'response1', setLoading1, 'recommendationType1')}
                className="button professional"
              >
                Professional recommendation
              </Button>
            </Box>
            <Box className="response-box" ref={responseRef1}>
              {loading1 ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2" style={{ marginLeft: 8 }}>
                    Generating recommendation...
                  </Typography>
                </Box>
              ) : (
                response1.startsWith('**Error') ? (
                  <Box display="flex" alignItems="center" color="error.main">
                    <ErrorIcon color="error" />
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      <ReactMarkdown>{response1}</ReactMarkdown>
                    </Typography>
                  </Box>
                ) : (
                  <ReactMarkdown>{response1}</ReactMarkdown>
                )
              )}
            </Box>
            <IconButton
              color="primary"
              onClick={() => downloadReport(employeeId1, localStorage.getItem('recommendationType1'), responseRef1)}
            >
              <DownloadIcon />
            </IconButton>
          </Paper>
        </Grid>
        {isSplitScreen && (
          <Grid item xs={12} md={6}>
            <Paper className="zone" elevation={3}>
              <TextField
                label="Enter employee ID"
                variant="outlined"
                fullWidth
                value={employeeId2}
                onChange={(e) => setEmployeeId2(e.target.value)}
                className="input-box"
              />
              <Box className="button-group">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRecommendation('http://localhost:4500/api/', setEmployeeId2, setResponse2, employeeId2, 'response2', setLoading2, 'recommendationType2')}
                  className="button learning"
                >
                  Learning recommendation
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRecommendation('http://localhost:4500/api2/', setEmployeeId2, setResponse2, employeeId2, 'response2', setLoading2, 'recommendationType2')}
                  className="button professional"
                >
                  Professional recommendation
                </Button>
              </Box>
              <Box className="response-box" ref={responseRef2}>
                {loading2 ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={20} />
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      Generating recommendation...
                    </Typography>
                  </Box>
                ) : (
                  response2.startsWith('**Error') ? (
                    <Box display="flex" alignItems="center" color="error.main">
                      <ErrorIcon color="error" />
                      <Typography variant="body2" style={{ marginLeft: 8 }}>
                        <ReactMarkdown>{response2}</ReactMarkdown>
                      </Typography>
                    </Box>
                  ) : (
                    <ReactMarkdown>{response2}</ReactMarkdown>
                  )
                )}
              </Box>
              <IconButton
                color="primary"
                onClick={() => downloadReport(employeeId2, localStorage.getItem('recommendationType2'), responseRef2)}
              >
                <DownloadIcon />
              </IconButton>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
