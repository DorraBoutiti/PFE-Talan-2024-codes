import Chart from 'react-apexcharts';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Accordion, Typography, AccordionDetails, AccordionSummary } from '@mui/material';

import './index.css';
import './collapse.css';
import * as api from '../../../services/service1';

export default function AppView() {
  const [data, setData] = useState([]);
  const [globalScorePercentage, setGlobalScorePercentage] = useState('N/A');
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [selectedElement, setSelectedElement] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const getAllInterviews = async () => {
      try {
        const allInterviews = await api.getAllInterviews(sessionStorage.getItem('candidateId'));
        allInterviews.forEach((interview) => {
          interview.informations = transformData(interview.informations);
        });

        setData(allInterviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getAllInterviews();
  }, []);

  const handleClick = (id) => {
    setSelectedElement(data.find(item => item.id === id));
  };

  const transformData = (interviewData) => {
    const skills = {};
    let globalScore = 'N/A';

    interviewData.forEach(item => {
      if (item.nomChamp === 'Global Score Percentage') {
        globalScore = item.valeur;
      } else {
        const [prefix, skillIdentifier] = item.nomChamp.split(/-(Hard Skill-\d+|Soft Skill-\d+|Soft-\d+)/);

        if (skillIdentifier) {
          if (!skills[skillIdentifier]) {
            skills[skillIdentifier] = {};
          }

          if (prefix === 'doc_node_value') {
            skills[skillIdentifier].value = item.valeur; // Use dot notation
          } else if (prefix === 'score') {
            skills[skillIdentifier].score = parseFloat(item.valeur).toFixed(2); // Use dot notation
          } else if (prefix === 'skill_name') {
            skills[skillIdentifier].name = item.valeur; // Use dot notation
          } else if (prefix === 'skill_type') {
            skills[skillIdentifier].type = item.valeur; // Use dot notation
          }
        }
      }
    });

    setGlobalScorePercentage(globalScore);

    return Object.keys(skills).map(key => ({
      id: key,
      ...skills[key]
    }));
  };

  const handleEnd = async () => {
    SpeechRecognition.stopListening();
    try {
      const results = await api.SpeechToTextProcess(
        sessionStorage.getItem('candidateId'),
        "I have experience with Python programming language and machine learning. I also have strong communication skills."
      );

      
      setData(results);
    } catch (error) {
      console.error('Error extracting skills:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={8}>
            <h1>Interview transcriber</h1>
            <div className="container">
              <h2>Interview Speech to Text Converter</h2>
              <br />
              <p>This component make it easy to convert interview to text, and extract skills.</p>
              <div className="main-content">
                Your browser does not support speech recognition. Please use a browser like Chrome, Edge, or Firefox for this
                feature.
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  }

  let skillsChartData = null;
  if (selectedElement) {
    skillsChartData = {
      series: [
        {
          name: 'Skill Score',
          data: selectedElement.informations.map(skill => skill.score)
        }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: selectedElement.informations.map(skill => skill.name),
        },
        yaxis: {
          title: {
            text: 'Score'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function formatValue(val) { 
              return val;
            }

          }
        }
      }
    };
  }

  const StopInterview = async () => {
    SpeechRecognition.stopListening();
  }
    

  const globalScoreChartData = {
    series: [parseFloat(globalScorePercentage).toFixed(2)],
    options: {
      chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '95%',
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        }
      },
      labels: ['Global Score'],
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
         
          <div className="container">
            <h2>Interview Speech to Text Converter</h2>
            <br />
            <p>This component make it easy to convert interview to text, and extract skills.</p>
            <div
              className="main-content"
              role="button"
              tabIndex={0}
              onClick={StopInterview}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') StopInterview();
              }}
            >
              {transcript || 'Click start to begin speech recognition.'}
            </div>
            <div className="btn-style">
              <button type="button" onClick={startListening}>
                Start Listening
              </button>
              <button type="button" onClick={handleEnd}>
                Stop Listening
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {data && data.map(item => (
            <Accordion key={item.id}>
              <AccordionSummary onClick={() => handleClick(item.id)}>
                <Typography>{formatDate(item.dateTelechargement)}</Typography>
              </AccordionSummary>
              <AccordionDetails className={selectedElement && selectedElement.id === item.id ? 'selected-panel' : ''}>
                <div>                  
                  <h4>Global Score Percentage</h4>
                  <Chart
                    options={globalScoreChartData.options}
                    series={globalScoreChartData.series}
                    type="radialBar"
                    height={350}
                  />
                  <h4>Information Extracted</h4>
                  {skillsChartData && (
                    <Chart
                      options={skillsChartData.options}
                      series={skillsChartData.series}
                      type="bar"
                      height={350}
                    />
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
