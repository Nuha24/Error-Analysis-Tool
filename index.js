// Integration with Charts and Form
let Absolute_Error = null;
let Relative_Error = null;
let Percentage_Error = null;

let pieChart, barChart;

// Initialize charts on page load
function initializeCharts() {
  const pieOptions = {
    series: [0, 0, 0],
    chart: {
      width: 380,
      type: "donut",
    },
    labels: ["Absolute Error", "Relative Error", "Percentage Error"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "gradient",
    },
    title: {
      text: "Error Distribution",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  pieChart = new ApexCharts(document.querySelector("#pieChart"), pieOptions);
  pieChart.render();

  const barOptions = {
    series: [
      {
        data: [0, 0], // Only include Absolute and Relative Error
      },
    ],
    chart: {
      type: "bar",
      height: 400,
      width: "100%",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    title: {
      text: "Error Analysis Bar Chart",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Absolute Error", "Relative Error"], // Exclude Percentage Error from bar chart
    },
  };
  barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
  barChart.render();
}

// Reset form and charts
function resetForm() {
  document.getElementById("input1").value = "";
  document.getElementById("input2").value = "";

  Absolute_Error = 0;
  Relative_Error = 0;
  Percentage_Error = 0;

  updateResultsSection();
  updateCharts([0, 0, 0]);
}

// Update results section
function updateResultsSection() {
  document.getElementById("absoluteError").innerText = Absolute_Error;
  document.getElementById("relativeError").innerText = Relative_Error;
  document.getElementById("percentageError").innerText = Percentage_Error;

  const errors = {
    "Absolute Error": Absolute_Error,
    "Relative Error": Relative_Error,
    "Percentage Error": Percentage_Error,
  };

  const largestError = Object.keys(errors).reduce(
    (a, b) => (errors[a] > errors[b] ? a : b),
    "N/A"
  );
  document.getElementById("largestError").innerText = largestError;
}

// Update charts
function updateCharts(data) {
  pieChart.updateSeries(data);
  barChart.updateSeries([
    {
      data: data.slice(0, 2), // Exclude Percentage Error for bar chart
    },
  ]);
}

// Calculate Errors
function calculateErrors(trueValue, approxValue) {
  Absolute_Error = Math.abs(trueValue - approxValue);
  Relative_Error = Absolute_Error / Math.abs(trueValue);
  Percentage_Error = Relative_Error * 100;
}

// Handle form submission
function submitErrorAnalysis(event) {
  event.preventDefault();
  const trueValue = parseFloat(document.getElementById("input1").value);
  const approxValue = parseFloat(document.getElementById("input2").value);

  if (isNaN(trueValue) || isNaN(approxValue)) {
    alert("Please enter valid numbers for True Value and Approximate Value.");
    return;
  }

  calculateErrors(trueValue, approxValue);
  updateResultsSection();
  updateCharts([Absolute_Error, Relative_Error, Percentage_Error]);
}

// Randomize input values
function randomize() {
  const trueValueInput = document.getElementById("input1");
  const approxValueInput = document.getElementById("input2");

  function generateMixedValue() {
    let randomValue = Math.random() * 2000 - 1000;
    return Math.random() > 0.5
      ? parseFloat(randomValue.toFixed(2))
      : Math.round(randomValue);
  }

  const randomTrueValue = generateMixedValue();
  const randomApproxValue = generateMixedValue();

  trueValueInput.value = randomTrueValue;
  approxValueInput.value = randomApproxValue;

  const trueValue = parseFloat(trueValueInput.value);
  const approxValue = parseFloat(approxValueInput.value);

  calculateErrors(trueValue, approxValue);
  updateResultsSection();
  updateCharts([Absolute_Error, Relative_Error, Percentage_Error]);
}

// Initialize charts and attach event listeners
initializeCharts();
document.getElementById("errorForm").addEventListener("submit", submitErrorAnalysis);
document.getElementById("randomizeButton").addEventListener("click", randomize);
