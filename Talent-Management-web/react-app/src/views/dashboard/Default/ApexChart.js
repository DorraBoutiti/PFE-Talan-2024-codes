import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ employee1Id, employee2Id, chartType }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: chartType,
      height: chartType === 'radar' ? 450 : 400,  // Increased height for radar chart
      stacked: chartType === 'bar',
    },
    title: {
      text: chartType === 'radar' ? 'Radar chart Comparison of Competencies' : 'Bar chart Competencies ',
    },
    stroke: {
      width: chartType === 'radar' ? 2 : 1,
      colors: chartType === 'radar' ? undefined : ['#fff'],
    },
    fill: {
      opacity: chartType === 'radar' ? 0.1 : 1,
    },
    yaxis: {
      show: chartType !== 'radar',
      title: {
        text: undefined,
      },
      stepSize: chartType === 'radar' ? 1 : undefined,
    },
    xaxis: {
      categories: [],
      labels: {
        formatter: val => val,
      },
    },
    tooltip: {
      y: {
        formatter: val => val,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  });

  useEffect(() => {
    if (employee1Id && employee2Id) {
      const endpoint = chartType === 'radar' ? 'radar-data' : 'barchartdata';
      fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee1_id: employee1Id, employee2_id: employee2Id }),
      })
        .then(response => response.json())
        .then(data => {
          const updatedSeries = [
            { name: 'Employee 1', data: data.levels_employee1 || [] },
            { name: 'Employee 2', data: data.levels_employee2 || [] },
          ];

          const updatedOptions = {
            ...options,
            xaxis: { categories: data.common_competencies || data.common_competences || [] },
          };

          setSeries(updatedSeries);
          setOptions(updatedOptions);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [employee1Id, employee2Id, chartType, options]);

  return (
    <div>
      <ReactApexChart options={options} series={series} type={chartType} height={options.chart.height} />
    </div>
  );
};

export default ApexChart;
