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
const output = document.getElementById('output');
const outerOutput = document.getElementById('outer-output');

// Add submit event listener to the form
form.addEventListener('submit', event => {
	event.preventDefault();

	// Extract data from form fields
	const formData = new FormData(form);
	toggle_loading_spinner();

	// Send POST request to server
	fetch('/results', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json()) // Parse response as JSON
		.then(data => {
			// Clear spinner, print result on page
			toggle_loading_spinner();
			print_list_of_distortions(data);
		})
		.catch(error => {
			console.error('Error:', error);
			toggle_loading_spinner();
			output.innerHTML = 'An error occurred while submitting the form';
		});
});

function toggle_loading_spinner() {
	output.innerHTML = '';
	outerOutput.classList.toggle('text-center');
	output.classList.toggle('spinner-border');
}

function print_list_of_distortions(data) {
	for (const distortion in data) {
		output.append(print_distortion_item(distortion, data[distortion]));
	}
}

function print_distortion_item(distortion, explanation) {
	const card = document.createElement('div');
	card.classList.add('card', 'border-dark', 'mb-3');

	const header = document.createElement('div');
	header.classList.add('card-header');
	header.innerText = distortion;

	const body = document.createElement('div');
	body.classList.add('card-body');

	const text = document.createElement('p');
	text.classList.add('card-text');
	text.innerText = explanation;

	body.append(text);
	card.append(header);
	card.append(body);

	return card;
}

/* ========================================================================== */
/* END Form Submission                                                        */
/* ========================================================================== */
