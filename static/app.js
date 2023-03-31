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
	output.classList.toggle('spinner-border');
	output.classList.toggle('text-center');
}

function print_list_of_distortions(data) {
	for (const distortion in data) {
        console.debug('distortion', distortion);
        console.debug('data', data);
		output.append(
            print_distortion_item(
                distortion,
                data[distortion].explanation,
                data[distortion].strategies,
                data[distortion].reframed_thought));
	}
}

function print_distortion_item(distortion, explanation, strategies, reframed_thought) {
    const dl = document.createElement('dl');
    dl.classList.add('row');

    const dt_distortion = document.createElement('dt');
    const dt_explanation = document.createElement('dt');
    const dt_strategies = document.createElement('dt');
    const dt_reframed_thought = document.createElement('dt');

    dt_distortion.innerText = "Distortion";
    dt_explanation.innerText = "Explanation";
    dt_strategies.innerText = "Strategies";
    dt_reframed_thought.innerText = "Reframed Thought";


    const dd_distortion = document.createElement('dd');
    const dd_explanation = document.createElement('dd');
    const dd_strategies = document.createElement('dd');
    const dd_reframed_thought = document.createElement('dd');

    dd_distortion.innerText = distortion;
    dd_explanation.innerText = explanation;
    dd_strategies.innerText = strategies;
    dd_reframed_thought.innerText = reframed_thought;

    dl.append(dt_distortion);
    dl.append(dd_distortion);
    dl.append(dt_explanation);
    dl.append(dd_explanation);
    dl.append(dt_strategies);
    dl.append(dd_strategies);
    dl.append(dt_reframed_thought);
    dl.append(dd_reframed_thought);

	return dl;
}

/* ========================================================================== */
/* END Form Submission                                                        */
/* ========================================================================== */
