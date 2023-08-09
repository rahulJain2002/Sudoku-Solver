const puzzleBoard = document.getElementById("puzzle");
const solveButton = document.getElementById("solve-btn");
const resetButton = document.getElementById("reset-btn");
const valuesByUser = [];

for (let i = 0; i < 81; i++) {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "tel");
    inputElement.setAttribute("pattern", "[0-9]");
    inputElement.setAttribute("maxlength", "1");

    inputElement.setAttribute("tabindex", i + 1);

    // targeting 3x3 subgrids
    const rowIndex = Math.floor(i / 9);
    const colIndex = i % 9;
    if ((Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 0) {
        inputElement.classList.add("subgrid");
    }

    puzzleBoard.append(inputElement);
}

const getValues = () => {
    const inputs = document.querySelectorAll("#puzzle input");

    inputs.forEach((input) => {
        if (input.value) {
            let val = +input.value;
            if (isNaN(val)) {
                alert("Don't add special symbols, add only numbers");
                throw new Error("Don't add special symbols, add only numbers");
            }

            valuesByUser.push(val);
        } else {
            valuesByUser.push(0);
        }
    });

    console.log(valuesByUser);
};

const populateValues = (restultant_arr) => {
    for (let i = 0; i < 81; i++) {
        const place = document.querySelector(
            `#puzzle input:nth-child(${i + 1})`
        );
        place.value = restultant_arr[i];
    }
};

// solveButton.addEventListener("click", getValues);

const callAPI = async () => {
    try {
        getValues();
        document.querySelector(".btns").style.display = "none";
        document.querySelector(".spinner").style.display = "block";
        document.querySelector(".spin-container").style.display = "block";

        const url = "https://sudoku-solver3.p.rapidapi.com/sudokusolver/";
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key":
                    "76395922a3mshceeacc01293cb52p11f496jsnab50fe7da1ad",
                "X-RapidAPI-Host": "sudoku-solver3.p.rapidapi.com",
            },
            body: JSON.stringify({
                input: valuesByUser,
            }),
        };

        const response = await fetch(url, options);
        if (response.ok == false) {
            alert("Enter valid sudoku");
            document.querySelector(".spinner").style.display = "none";
            document.querySelector(".spin-container").style.display = "none";
            document.querySelector(".btns").style.display = "block";
            throw new Error("Please enter valid sudoku");
        }

        const data = await response.json();

        const restultant_arr = data.answer;
        console.log(restultant_arr);

        populateValues(restultant_arr);
        valuesByUser.length = 0;
        document.querySelector(".btns").style.display = "block";
        document.querySelector(".spinner").style.display = "none";
        document.querySelector(".spin-container").style.display = "none";

    } catch (error) {
        console.log(error);
    }
};

solveButton.addEventListener("click", callAPI);
resetButton.addEventListener("click", () => {
    const inputBtns = puzzleBoard.querySelectorAll("input");
    inputBtns.forEach((input) => {
        input.value = "";
        valuesByUser.length = 0;
    });
});

document.addEventListener("keydown", (event) => {
    const focusedElement = document.activeElement;
    const inputBtns = puzzleBoard.querySelectorAll("input");

    const currentIndex = Array.from(inputBtns).indexOf(focusedElement);

    if (event.key === "ArrowLeft" && currentIndex > 0) {
        inputBtns[currentIndex - 1].focus();
    } else if (
        event.key === "ArrowRight" &&
        currentIndex < inputBtns.length - 1
    ) {
        inputBtns[currentIndex + 1].focus();
    } else if (event.key === "ArrowUp" && currentIndex >= 9) {
        inputBtns[currentIndex - 9].focus();
    } else if (
        event.key === "ArrowDown" &&
        currentIndex < inputBtns.length - 9
    ) {
        inputBtns[currentIndex + 9].focus();
    }
});


