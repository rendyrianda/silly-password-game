const passwordInput = document.getElementById("password");
const errorContainer = document.getElementById("errorContainer");

function checkProvinceExistence(userInput) {
  fetch("https://rendyrianda.github.io/api-wilayah-indonesia/api/provinces.json")
    .then((response) => response.json())
    .then((data) => {
      const provinceNames = data.map((province) => province.name);

      if (userInput) {
        // Normalize input to uppercase
        const normalizedInput = userInput.toUpperCase();

        // Check each province name for a match in the normalized input
        const matchedProvince = provinceNames.find((provinceName) =>
          normalizedInput.includes(provinceName.replace(/\s/g, ""))
        );

        if (matchedProvince) {
          console.log(true);
          return !!matchedProvince;
        } else {
          return false;
        }
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return false;
    });
}

let conditions = [
  {
    test: (password) => password.length >= 8,
    message: "Password harus memiliki lebih dari 8 Karakter.",
  },
  {
    test: (password) => /\d/.test(password),
    message: "Password harus memiliki kurang lebih 1 angka.",
  },
  {
    test: (password) => /[A-Z]/.test(password),
    message: "Password harus memiliki kurang lebih 1 Huruh KAPITAL!.",
  },
  {
    test: (password) => /[^a-zA-Z\d]/.test(password),
    message: "Password harus memiliki kurang lebih 1 karakter spesial.",
  },
  {
    test: (password) => checkProvinceExistence(password),
    message: "Password harus memiliki nama provinsi Indonesia.",
  },
  {
    test: (password) => {
      const numbers = password.match(/\d/g);
      const sumOfNumbers = numbers ? numbers.reduce((sum, num) => sum + parseInt(num), 0) : 0;
      return sumOfNumbers === 20;
    },
    message: "The sum of numbers in the password must be 20.",
  },
];

let currentIndex = 0;
let successStack = [];

passwordInput.addEventListener("input", function () {
  const password = this.value;

  // Clear the container
  errorContainer.innerHTML = "";

  let errorMessages = [];

  for (let index = 0; index < conditions.length; index++) {
    const condition = conditions[index];
    const isValid = condition.test(password);
    console.log(`Condition: ${condition.message}, isValid: ${isValid}`);

    if (!isValid) {
      errorMessages.push(condition.message);
    } else {
      // Update the success stack when a condition is met
      if (!successStack.includes(condition.message)) {
        successStack.unshift(condition.message);
      }
    }
  }

  // Remove success messages from stack if conditions are no longer fulfilled
  successStack = successStack.filter((message) =>
    conditions.find((cond) => cond.message === message).test(password)
  );

  // Show the error message in red at the top
  if (errorMessages.length > 0) {
    let box = document.createElement("div");
    box.className = "box error-box";
    box.innerHTML = errorMessages[0];
    errorContainer.appendChild(box);
  }

  // Show the previously met success messages in green
  successStack.forEach((message) => {
    let box = document.createElement("div");
    box.className = "box success-box";
    box.innerHTML = message;
    errorContainer.appendChild(box);
  });
});
