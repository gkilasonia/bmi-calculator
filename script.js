// --- 1. CONSTANTS & CONFIGURATION ---
// Store "magic numbers" in constants for readability and easy updates.
const BMI_CATEGORIES = {
  UNDERWEIGHT: 18.5,
  HEALTHY: 24.9,
  OVERWEIGHT: 29.9,
};
const IMPERIAL_BMI_FACTOR = 703;
const INCHES_PER_FOOT = 12;
const POUNDS_PER_STONE = 14;

// --- 2. DOM ELEMENT SELECTION ---
// Get all necessary elements from the DOM once.
const metricRadio = document.getElementById("metric");
const imperialRadio = document.getElementById("imperial");
const metricContainer = document.getElementById("metric-container");
const imperialContainer = document.getElementById("imperial-container");

const metricHeightInput = document.getElementById("height-cm");
const metricWeightInput = document.getElementById("weight-kg");
const imperialHeightFtInput = document.getElementById("height-ft");
const imperialHeightInInput = document.getElementById("height-in");
const imperialWeightStInput = document.getElementById("weight-st");
const imperialWeightLbsInput = document.getElementById("weight-lbs");

const welcomeContainer = document.getElementById("welcome-container");
const bmiResultContainer = document.getElementById("bmi-result");
const bmiNumberEl = document.getElementById("bmi-number");
const weightClassificationEl = document.getElementById("weight-classification");
const idealWeightFromEl = document.getElementById("from");
const idealWeightToEl = document.getElementById("to");

// Group inputs for easier event handling and clearing.
const metricInputs = [metricHeightInput, metricWeightInput];
const imperialInputs = [
  imperialHeightFtInput,
  imperialHeightInInput,
  imperialWeightStInput,
  imperialWeightLbsInput,
];

// --- 3. CORE LOGIC & CALCULATION FUNCTIONS ---

/**
 * Determines the weight classification string based on the BMI value.
 * @param {number} bmi - The calculated Body Mass Index.
 * @returns {string} The weight classification text.
 */
function getWeightClassification(bmi) {
  if (bmi < BMI_CATEGORIES.UNDERWEIGHT) return "underweight";
  if (bmi < BMI_CATEGORIES.HEALTHY) return "a healthy weight";
  if (bmi < BMI_CATEGORIES.OVERWEIGHT) return "overweight";
  return "obese";
}

/**
 * Updates the UI to display the calculated BMI and ideal weight range.
 * @param {number} bmi - The calculated BMI.
 * @param {{low: number, high: number}} healthyRange - The ideal weight range.
 * @param {string} unit - The unit of weight (e.g., "kgs" or "lbs").
 */
function updateBmiDisplay(bmi, healthyRange, unit) {
  bmiNumberEl.textContent = bmi.toFixed(1);
  weightClassificationEl.textContent = getWeightClassification(bmi);
  idealWeightFromEl.textContent = `${healthyRange.low.toFixed(1)}${unit}`;
  idealWeightToEl.textContent = `${healthyRange.high.toFixed(1)}${unit}`;

  welcomeContainer.style.display = "none";
  bmiResultContainer.style.display = "flex";
}

/**
 * Calculates BMI using metric units and updates the display.
 */
function calculateMetricBMI() {
  const heightCm = parseFloat(metricHeightInput.value);
  const weightKg = parseFloat(metricWeightInput.value);

  // Validate that inputs are valid positive numbers.
  if (heightCm > 0 && weightKg > 0) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    const healthyWeightLow = BMI_CATEGORIES.UNDERWEIGHT * (heightM * heightM);
    const healthyWeightHigh = BMI_CATEGORIES.HEALTHY * (heightM * heightM);

    updateBmiDisplay(
      bmi,
      { low: healthyWeightLow, high: healthyWeightHigh },
      "kgs"
    );
  }
}

/**
 * Calculates BMI using imperial units and updates the display.
 */
function calculateImperialBMI() {
  const heightFt = parseFloat(imperialHeightFtInput.value) || 0;
  const heightIn = parseFloat(imperialHeightInInput.value) || 0;
  const weightSt = parseFloat(imperialWeightStInput.value) || 0;
  const weightLbs = parseFloat(imperialWeightLbsInput.value) || 0;

  // Validate that total height and weight are positive numbers
  const totalHeightInches = heightFt * INCHES_PER_FOOT + heightIn; // Convert height fully to inches
  const totalWeightPounds = weightSt * POUNDS_PER_STONE + weightLbs; // Convert weight fully to pounds

  // Validate inputs. Feet and Stone must be positive.
  if (totalHeightInches > 0 && totalWeightPounds > 0) {
    const bmi =
      (totalWeightPounds / (totalHeightInches * totalHeightInches)) *
      IMPERIAL_BMI_FACTOR;

    const healthyWeightLow =
      (BMI_CATEGORIES.UNDERWEIGHT * (totalHeightInches * totalHeightInches)) /
      IMPERIAL_BMI_FACTOR;
    const healthyWeightHigh =
      (BMI_CATEGORIES.HEALTHY * (totalHeightInches * totalHeightInches)) /
      IMPERIAL_BMI_FACTOR;

    updateBmiDisplay(
      bmi,
      { low: healthyWeightLow, high: healthyWeightHigh },
      "lbs"
    );
  }
}

// --- 4. UI & EVENT HANDLING ---

/**
 * Manages the UI state when switching between unit systems.
 * @param {('metric'|'imperial')} systemToShow - The system to display.
 */
function switchUnitSystem(systemToShow) {
  const isMetric = systemToShow === "metric";

  metricContainer.style.display = isMetric ? "flex" : "none";
  imperialContainer.style.display = isMetric ? "none" : "flex";

  // Reset the display to the welcome message.
  welcomeContainer.style.display = "flex";
  bmiResultContainer.style.display = "none";

  // Clear the input values of the system being hidden.
  const inputsToClear = isMetric ? imperialInputs : metricInputs;
  inputsToClear.forEach((input) => (input.value = ""));
}

// Attach event listeners.
metricRadio.addEventListener("change", () => switchUnitSystem("metric"));
imperialRadio.addEventListener("change", () => switchUnitSystem("imperial"));

// A single event handler is attached to all metric inputs.
metricInputs.forEach((input) =>
  input.addEventListener("input", calculateMetricBMI)
);

// A single event handler is attached to all imperial inputs.
imperialInputs.forEach((input) =>
  input.addEventListener("input", calculateImperialBMI)
);

// const metric = document.getElementById("metric");
// const imperial = document.getElementById("imperial");
// const metricContainer = document.getElementById("metric-container");
// const metricHeight = document.getElementById("height-cm");
// const metricWeight = document.getElementById("weight-kg");
// const imperialContainer = document.getElementById("imperial-container");
// const imperialHeightFt = document.getElementById("height-ft");
// const imperialHeightIn = document.getElementById("height-in");
// const imperialWeightSt = document.getElementById("weight-st");
// const imperialWeightLbs = document.getElementById("weight-lbs");
// const welcomeContainer = document.getElementById("welcome-container");
// const bmiResult = document.getElementById("bmi-result");
// const bmiNumber = document.getElementById("bmi-number");
// const weightClassification = document.getElementById("weight-classification");
// const from = document.getElementById("from");
// const to = document.getElementById("to");

// const metricInputs = [metricHeight, metricWeight];

// const imperialInputs = [
//   imperialHeightFt,
//   imperialHeightIn,
//   imperialWeightSt,
//   imperialWeightLbs,
// ];

// imperial.addEventListener("click", () => {
//   metricContainer.style.display = "none";
//   imperialContainer.style.display = "flex";
//   welcomeContainer.style.display = "flex";
//   bmiResult.style.display = "none";
//   metricInputs.forEach((input) => {
//     input.value = "";
//   });
// });

// metric.addEventListener("click", () => {
//   metricContainer.style.display = "flex";
//   imperialContainer.style.display = "none";
//   welcomeContainer.style.display = "flex";
//   bmiResult.style.display = "none";
//   imperialInputs.forEach((input) => {
//     input.value = "";
//   });
// });

// metricHeight.addEventListener("input", () => {
//   if (metricHeight.value > 0 && metricWeight.value > 0) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateMetricBMI(metricHeight.value, metricWeight.value);
//   }
// });

// metricWeight.addEventListener("input", () => {
//   if (metricHeight.value > 0 && metricWeight.value > 0) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateMetricBMI(metricHeight.value, metricWeight.value);
//   }
// });

// imperialHeightFt.addEventListener("input", () => {
//   if (
//     imperialHeightFt.value > 0 &&
//     imperialHeightIn.value > 0 &&
//     imperialWeightSt.value > 0 &&
//     imperialWeightLbs.value > 0
//   ) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateImperialBMI(
//       imperialHeightFt.value,
//       imperialHeightIn.value,
//       imperialWeightSt.value,
//       imperialWeightLbs.value
//     );
//   }
// });

// imperialHeightIn.addEventListener("input", () => {
//   if (
//     imperialHeightFt.value > 0 &&
//     imperialHeightIn.value > 0 &&
//     imperialWeightSt.value > 0 &&
//     imperialWeightLbs.value > 0
//   ) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateImperialBMI(
//       imperialHeightFt.value,
//       imperialHeightIn.value,
//       imperialWeightSt.value,
//       imperialWeightLbs.value
//     );
//   }
// });

// imperialWeightSt.addEventListener("input", () => {
//   if (
//     imperialHeightFt.value > 0 &&
//     imperialHeightIn.value > 0 &&
//     imperialWeightSt.value > 0 &&
//     imperialWeightLbs.value > 0
//   ) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateImperialBMI(
//       imperialHeightFt.value,
//       imperialHeightIn.value,
//       imperialWeightSt.value,
//       imperialWeightLbs.value
//     );
//   }
// });

// imperialWeightLbs.addEventListener("input", () => {
//   if (
//     imperialHeightFt.value > 0 &&
//     imperialHeightIn.value > 0 &&
//     imperialWeightSt.value > 0 &&
//     imperialWeightLbs.value > 0
//   ) {
//     welcomeContainer.style.display = "none";
//     bmiResult.style.display = "flex";
//     calculateImperialBMI(
//       imperialHeightFt.value,
//       imperialHeightIn.value,
//       imperialWeightSt.value,
//       imperialWeightLbs.value
//     );
//   }
// });

// function calculateMetricBMI(heightCm, weightKg) {
//   let bmi = weightKg / ((heightCm * heightCm) / 10000);
//   bmiNumber.textContent = bmi.toFixed(1);
//   let healthyWeightLow = 18.5 * ((heightCm * heightCm) / 10000);
//   let healthyWeightHigh = 24.9 * ((heightCm * heightCm) / 10000);
//   from.textContent = healthyWeightLow.toFixed(1) + "kgs";
//   to.textContent = healthyWeightHigh.toFixed(1) + "kgs";
//   if (bmi < 18.5) {
//     weightClassification.textContent = "underweight";
//   } else if (bmi < 24.9) {
//     weightClassification.textContent = "healthy weight";
//   } else if (bmi < 29.9) {
//     weightClassification.textContent = "overweight";
//   } else {
//     weightClassification.textContent = "obese";
//   }
// }

// function calculateImperialBMI(heightFt, heightIn, weightSt, weightLbs) {
//   let totalHeightInches = heightFt * 12 + parseInt(heightIn);
//   let totalPounds = weightSt * 14 + parseInt(weightLbs);
//   let bmi = (totalPounds / (totalHeightInches * totalHeightInches)) * 703;
//   bmiNumber.textContent = bmi.toFixed(1);
//   let healthyWeightLow = (18.5 * (totalHeightInches * totalHeightInches)) / 703;
//   let healthyWeightHigh = (24.9 * (totalHeightInches * totalHeightInches)) / 703;
//   from.textContent = healthyWeightLow.toFixed(1) + "lbs";
//   to.textContent = healthyWeightHigh.toFixed(1) + "lbs";
//   if (bmi < 18.5) {
//     weightClassification.textContent = "underweight";
//   } else if (bmi < 24.9) {
//     weightClassification.textContent = "healthy weight";
//   } else if (bmi < 29.9) {
//     weightClassification.textContent = "overweight";
//   } else {
//     weightClassification.textContent = "obese";
//   }
// }
