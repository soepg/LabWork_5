"use strict";

// ЛР5 (варіант 9): обчислення частки позначених інгредієнтів у відсотках
const extraChecks = document.querySelectorAll(".ingredient-check");
const extraResetButton = document.querySelector("#reset-ingredients");
const percentOutput = document.querySelector("#ingredients-percent");

function calculateProgressPercent(preparedCount, totalCount) {
    if (totalCount <= 0) {
        return 0;
    }
    return Math.round((preparedCount / totalCount) * 100);
}

function updateProgressPercent() {
    if (!percentOutput) return;

    let preparedCount = 0;
    extraChecks.forEach(function (check) {
        if (check.checked) {
            preparedCount = preparedCount + 1;
        }
    });

    const percent = calculateProgressPercent(preparedCount, extraChecks.length);
    percentOutput.textContent = `Completion progress: ${percent}%`;
}

extraChecks.forEach(function (check) {
    check.addEventListener("change", updateProgressPercent);
});

if (extraResetButton) {
    extraResetButton.addEventListener("click", updateProgressPercent);
}

updateProgressPercent();