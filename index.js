// Integration with Charts and Form
let Absolute_Error = 0;
let Relative_Error = 0;
let Percentage_Error = 0;
let Truncation_Error = 0;
let Round_off_Error = 0;
let Error_Propagation = 0;

let pieChart, barChart;

// Initialize charts on page load
function initializeCharts() {
  const pieOptions = {
    series: [0, 0, 0, 0, 0],
    chart: {
      width: 380,
      type: "donut",
    },
    labels: [
      "Absolute Error",
      "Relative Error",
      "Percentage Error",
      "Truncation Error",
      "Round-off Error",
    ],
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
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
    chart: {
      type: "bar",
      height: 400, // Explicitly set the height
    width: "100%", // Ensure it takes full width
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
      categories: [
        "Absolute Error",
        "Relative Error",
        "Percentage Error",
        "Truncation Error",
        "Round-off Error",
        "Error Propagation",
      ],
    },
  };
  barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
  barChart.render();
}

// Reset form and charts
function resetForm() {
  // Clear input fields
  document.getElementById("input1").value = "";
  document.getElementById("input2").value = "";

  // Reset error values
  Absolute_Error = 0;
  Relative_Error = 0;
  Percentage_Error = 0;
  Truncation_Error = 0;
  Round_off_Error = 0;
  Error_Propagation = 0;

  // Reset results section
  updateResultsSection();

  // Reset charts
  updateCharts([0, 0, 0, 0, 0]);
}

// Update results section
function updateResultsSection() {
  document.getElementById("absoluteError").innerText = Absolute_Error.toFixed(2);
  document.getElementById("relativeError").innerText = Relative_Error.toFixed(4);
  document.getElementById("percentageError").innerText = `${Percentage_Error.toFixed(2)}`;
  document.getElementById("truncationError").innerText = Truncation_Error.toFixed(2);
  document.getElementById("roundOffError").innerText = Round_off_Error.toFixed(2);
  document.getElementById("errorPropagation").innerText = Error_Propagation.toFixed(2);

  const errors = {
    "Absolute Error": Absolute_Error,
    "Relative Error": Relative_Error,
    "Percentage Error": Percentage_Error,
    "Truncation Error": Truncation_Error,
    "Round-off Error": Round_off_Error,
  };

  const largestError = Object.keys(errors).reduce((a, b) => (errors[a] > errors[b] ? a : b), "N/A");
  document.getElementById("largestError").innerText = largestError;
}

// Update charts
function updateCharts(data) {
  pieChart.updateSeries(data.slice(0, 5)); // Update Pie Chart (first 5 errors)
  barChart.updateSeries([
    {
      data: [...data, Error_Propagation], // Update Bar Chart (all 6 errors)
    },
  ]);
}

// Calculate Errors
function calculateErrors(trueValue, approxValue) {
  Absolute_Error = Math.abs(trueValue - approxValue);
  Relative_Error = Absolute_Error / Math.abs(trueValue);
  Percentage_Error = Relative_Error * 100;

  const truncatedValue = Math.floor(approxValue * 100) / 100;
  Truncation_Error = Math.abs(approxValue - truncatedValue);

  const roundedValue = Math.round(approxValue * 100) / 100;
  Round_off_Error = Math.abs(approxValue - roundedValue);

  Error_Propagation = Absolute_Error + Truncation_Error; // Example propagation for addition
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
  updateCharts([
    Absolute_Error,
    Relative_Error,
    Percentage_Error,
    Truncation_Error,
    Round_off_Error,
  ]);
}

// Randomize input values
function randomize() {
  const trueValueInput = document.getElementById("input1");
  const approxValueInput = document.getElementById("input2");

  // Function to generate mixed integer and decimal values (positive and negative)
  function generateMixedValue() {
    let randomValue = Math.random() * 2000 - 1000; // Random between -1000 and 1000
    return Math.random() > 0.5 ? parseFloat(randomValue.toFixed(2)) : Math.round(randomValue); // Randomly choose decimal or integer
  }

  // Assign mixed values to inputs
  const randomTrueValue = generateMixedValue();
  const randomApproxValue = generateMixedValue();

  trueValueInput.value = randomTrueValue;
  approxValueInput.value = randomApproxValue;

  const trueValue = parseFloat(trueValueInput.value);
  const approxValue = parseFloat(approxValueInput.value);

  calculateErrors(trueValue, approxValue);
  updateResultsSection();
  updateCharts([
    Absolute_Error,
    Relative_Error,
    Percentage_Error,
    Truncation_Error,
    Round_off_Error,
  ]);
}

// Initialize charts and attach event listeners
initializeCharts();
document.getElementById("errorForm").addEventListener("submit", submitErrorAnalysis);
document.getElementById("randomizeButton").addEventListener("click", randomize);

// Function to perform Banker’s rounding
function bankersRound(value, significantDigits) {
    const factor = Math.pow(10, significantDigits - Math.floor(Math.log10(Math.abs(value))) - 1);
    const rounded = Math.round(value * factor);

    // Apply Banker’s rounding when the digit is exactly 5
    const lastDigit = rounded % 10;
    const isHalfway = (value * factor - Math.floor(value * factor) === 0.5);

    if (isHalfway) {
        return lastDigit % 2 === 0
            ? rounded / factor // If last digit is even, leave as is
            : (rounded - 1) / factor; // If last digit is odd, subtract 1
    }

    return rounded / factor;
}

// Function to calculate error propagation for addition and subtraction
function errorPropagationAddSubtract(errors, operands, isSubtraction = false) {
    const totalError = errors.reduce((acc, err) => acc + Math.abs(err), 0);
    const result = operands.reduce((acc, operand, index) => isSubtraction && index > 0 ? acc - operand : acc + operand, 0);
    return {
        totalError,
        relativeError: totalError / Math.abs(result)
    };
}

// Function to calculate error propagation for multiplication and division
function errorPropagationMultiplyDivide(errors, operands, isDivision = false) {
    const relativeErrors = errors.map((err, index) => Math.abs(err / operands[index]));
    const totalRelativeError = relativeErrors.reduce((acc, relErr) => acc + relErr, 0);

    const result = isDivision
        ? operands[0] / operands[1]
        : operands.reduce((acc, operand) => acc * operand, 1);

    return {
        totalError: Math.abs(result) * totalRelativeError,
        relativeError: totalRelativeError
    };
}

// User Input Handling
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question('Choose an option (round/equation): ', (choice) => {
        switch (choice.toLowerCase()) {
            case 'round':
                rl.question('Enter value to round: ', (value) => {
                    rl.question('Enter significant digits: ', (digits) => {
                        const result = bankersRound(parseFloat(value), parseInt(digits));
                        console.log(`Rounded Result: ${result}`);
                        rl.close();
                    });
                });
                break;
            case 'equation':
                rl.question('Enter X and Y (comma-separated): ', (xyInput) => {
                    rl.question('Enter absolute errors for X and Y (comma-separated): ', (errorsInput) => {
                        const [x, y] = xyInput.split(',').map(Number);
                        const [errorX, errorY] = errorsInput.split(',').map(Number);

                        const sum = x + y;
                        const totalError = errorX + errorY;
                        const relativeError = totalError / Math.abs(sum);

                        console.log(`Calculation: X + Y = ${x} + ${y} = ${sum}`);
                        console.log(`Absolute Errors: ΔX = ${errorX}, ΔY = ${errorY}`);
                        console.log(`Total Error: ΔX + ΔY = ${totalError}`);
                        console.log(`Relative Error: ${relativeError} (~${relativeError.toFixed(3)})`);
                        rl.close();
                    });
                });
                break;
            default:
                console.log('Invalid option. Please choose either "round" or "equation".');
                rl.close();
        }
    });
}

promptUser();
