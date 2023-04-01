'use strict';

/* ========================================================================== */
/* START Dark/Light Mode Switcher                                             */
/* ========================================================================== */

/**
 * Sets the theme color based on the user's preferences.
 */
function setThemePreference() {
	const prefersDarkMode = window.matchMedia(
		'(prefers-color-scheme: dark)'
	).matches;
	document.documentElement.setAttribute(
		'data-bs-theme',
		prefersDarkMode ? 'dark' : 'light'
	);
}

/**
 * Adds an event listener to the color scheme to call setThemePreference every
 * time user changes their preferred color scheme.
 */
function registerColorSchemeListener() {
	const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
	colorSchemeQuery.addEventListener('change', setThemePreference);
}

setThemePreference();
registerColorSchemeListener();

/* ========================================================================== */
/* END Dark/Light Mode Switcher                                               */
/* ========================================================================== */

/* ========================================================================== */
/* START Form Submission                                                      */
/* ========================================================================== */

const form = document.getElementById('thought-form');
const spinner = document.getElementById('spinner');
const result = document.getElementById('result');

// Add submit event listener to the form
form.addEventListener('submit', event => {
	event.preventDefault();
	// console.debug('inside event listener');

	// Extract data from form fields
	const formData = new FormData(form);
	toggleLoadingSpinner();

	// Send POST request to server
	fetch('/results', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json()) // Parse response as JSON
		.then(data => {
			// Clear spinner, print result on page
			toggleLoadingSpinner();
			generateAccordion(data);
		})
		.catch(error => {
			console.error('Error:', error);
			toggleLoadingSpinner();
			result.innerHTML = 'An error occurred while submitting the form';
		});
});

function toggleLoadingSpinner() {
	spinner.innerHTML = '';
	result.innerHTML = '';
	spinner.classList.toggle('spinner-border');
}

function generateAccordion(data) {
	for (const distortion in data) {
		const cardItem = createAccordionItem(
			distortion,
			data[distortion].explanation,
			data[distortion].strategies,
			data[distortion].reframed_thought
		);
		result.append(cardItem);
	}
}
function createAccordionItem(
	distortion,
	explanation,
	strategies,
	reframed_thought
) {
	const card = document.createElement('div');
	card.classList.add('card', 'text-bg-light');

	const cardBody = document.createElement('div');
	cardBody.classList.add('card-body');

	const title = document.createElement('h5');
	title.classList.add('card-title');
	title.innerText = distortion;

	const eCard = createSubCard('Explanation', explanation);
	const sCard = createSubCard('Strategies', strategies);
	const rCard = createSubCard('Reframed Thought', reframed_thought);

	cardBody.append(title);
	cardBody.append(eCard);
	cardBody.append(sCard);
	cardBody.append(rCard);

	card.append(cardBody);

	return card;
}

function createSubCard(title, description) {
	const card = document.createElement('div');
	card.classList.add('card', 'mt-3');

	const cardBody = document.createElement('div');
	cardBody.classList.add('card-body');

	const subhead = document.createElement('h6');
	subhead.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
	subhead.innerText = title;

	const paragraph = document.createElement('p');
	paragraph.classList.add('card-text');
	paragraph.innerText = description;

	cardBody.append(subhead);
	cardBody.append(paragraph);
	card.append(cardBody);

	return card;
}

/* ========================================================================== */
/* END Form Submission                                                        */
/* ========================================================================== */
