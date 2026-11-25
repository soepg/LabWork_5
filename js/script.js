"use strict";

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 10;

// ЛР5: модель рецепта з базовими даними на 1 порцію
const recipe = {
    baseServings: 1,
    ingredients: [
        { id: "eggs", name: "Large eggs", min: 2, max: 3, unit: "pcs", note: "" },
        { id: "salt", name: "Salt", min: null, max: null, unit: "", note: "to taste" },
        { id: "pepper", name: "Pepper", min: null, max: null, unit: "", note: "to taste" },
        { id: "fat", name: "Butter or oil", min: 1, max: 1, unit: "tbsp", note: "" },
        { id: "fillings", name: "Optional fillings", min: null, max: null, unit: "", note: "cheese, diced vegetables, cooked meats, herbs" }
    ]
};

let servings = recipe.baseServings;

const servingsCount = document.querySelector("#servings-count");
const decreaseButton = document.querySelector("#decrease-servings");
const increaseButton = document.querySelector("#increase-servings");
const servingsInput = document.querySelector("#servings-input");
const applyButton = document.querySelector("#apply-servings");
const servingsError = document.querySelector("#servings-error");
const checks = document.querySelectorAll(".ingredient-check");
const progress = document.querySelector("#ingredients-progress");
const resetButton = document.querySelector("#reset-ingredients");
const shoppingList = document.querySelector("#shopping-list");

// ЛР5: чисті функції перевірки та масштабування рецепта
function validateServings(value) {
    return Number.isInteger(value) && value >= MIN_SERVINGS && value <= MAX_SERVINGS;
}

function scaleRecipe(source, count) {
    if (!validateServings(count)) return null;
    const factor = count / source.baseServings;
    return source.ingredients.map(function (item) {
        return {
            ...item,
            min: item.min === null ? null : item.min * factor,
            max: item.max === null ? null : item.max * factor
        };
    });
}

// ЛР5: єдиний шлях оновлення порцій
function setServings(value) {
    if (!validateServings(value)) return;
    servings = value;
    servingsError.textContent = "";
    servingsInput.removeAttribute("aria-invalid");
    updateServings();
}

function applyInput() {
    const raw = servingsInput.value.trim();
    const value = Number(raw);
    if (raw === "" || !validateServings(value)) {
        servingsError.textContent = "Enter a whole number from 1 to 10.";
        servingsInput.setAttribute("aria-invalid", "true");
        return;
    }
    setServings(value);
}

function updateServings() {
    const scaled = scaleRecipe(recipe, servings);
    if (scaled === null) return;

    servingsCount.textContent = servings;
    servingsInput.value = servings;

    scaled.forEach(function (item) {
        if (item.min !== null) {
            const row = document.querySelector(`.ingredient[data-id="${item.id}"]`);
            const quantity = row.querySelector(".ingredient-quantity");
            quantity.textContent = item.min === item.max
                ? String(item.min)
                : `${item.min}-${item.max}`;
        }
    });

    decreaseButton.disabled = servings === MIN_SERVINGS;
    increaseButton.disabled = servings === MAX_SERVINGS;

    updateShoppingList();
}

function decreaseServings() {
    setServings(servings - 1);
}

function increaseServings() {
    setServings(servings + 1);
}

// ЛР5: форматування та оновлення списку непідготовлених інгредієнтів
function formatIngredient(item) {
    if (item.min === null) {
        return `${item.name}: ${item.note}`;
    }
    const amount = item.min === item.max
        ? String(item.min)
        : `${item.min}-${item.max}`;
    return `${item.name}: ${amount} ${item.unit}`;
}

function updateShoppingList() {
    const preparedIds = [];
    checks.forEach(function (check) {
        if (check.checked) {
            preparedIds.push(check.closest(".ingredient").dataset.id);
        }
    });

    const scaled = scaleRecipe(recipe, servings);
    if (scaled === null) return;

    const pending = scaled.filter(function (item) {
        return !preparedIds.includes(item.id);
    });

    const lines = pending.map(formatIngredient);
    shoppingList.textContent = lines.length === 0
        ? "All ingredients are ready!"
        : lines.join("\n");
}

function updateIngredients() {
    let prepared = 0;
    checks.forEach(function (check) {
        const item = check.closest(".ingredient");
        item.classList.toggle("is-prepared", check.checked);
        if (check.checked) {
            prepared = prepared + 1;
        }
    });
    progress.textContent = `Prepared ${prepared} of ${checks.length}`;
    updateShoppingList();
}

function resetIngredients() {
    checks.forEach(function (check) {
        check.checked = false;
    });
    updateIngredients();
}

decreaseButton.addEventListener("click", decreaseServings);
increaseButton.addEventListener("click", increaseServings);
applyButton.addEventListener("click", applyInput);
servingsInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        applyInput();
    }
});
checks.forEach(function (check) {
    check.addEventListener("change", updateIngredients);
});
resetButton.addEventListener("click", resetIngredients);

servings = recipe.baseServings;
updateServings();
resetIngredients();