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
const resultAccordion = document.getElementById('result-accordion');

// Add submit event listener to the form
form.addEventListener('submit', event => {
	event.preventDefault();

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
			resultAccordion.innerHTML = 'An error occurred while submitting the form';
		});
});

function toggleLoadingSpinner() {
	spinner.innerHTML = '';
	resultAccordion.innerHTML = '';
	spinner.classList.toggle('spinner-border');
}

function generateAccordion(data) {
	let index = 0;
	for (const distortion in data) {
		const accordionItem = createAccordionItem(
			index,
			distortion,
			data[distortion].explanation,
			data[distortion].strategies,
			data[distortion].reframed_thought
		);
		resultAccordion.append(accordionItem);
		index++;
	}
}
function createAccordionItem(
	index,
	distortion,
	explanation,
	strategies,
	reframed_thought
) {
	const itemId = `panelsStayOpen-collapse${index + 1}`;

	const accordionItem = document.createElement('div');
	accordionItem.className = 'accordion-item';

	const accordionHeader = document.createElement('h2');
	accordionHeader.className = 'accordion-header';

	const accordionButton = document.createElement('button');
	accordionButton.className =
		index === 0 ? 'accordion-button' : 'accordion-button collapsed';
	accordionButton.setAttribute('type', 'button');
	accordionButton.setAttribute('data-bs-toggle', 'collapse');
	accordionButton.setAttribute('data-bs-target', `#${itemId}`);
	accordionButton.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
	accordionButton.setAttribute('aria-controls', itemId);
	accordionButton.innerText = distortion;

	const accordionCollapse = document.createElement('div');
	accordionCollapse.className =
		index === 0
			? 'accordion-collapse collapse show'
			: 'accordion-collapse collapse';
	accordionCollapse.id = itemId;

	const accordionBody = document.createElement('div');
	accordionBody.className = 'accordion-body';

	const explanationSection = document.createElement('div');
	explanationSection.innerHTML = `<strong>Explanation</strong><p>${explanation}</p>`;

	const strategiesSection = document.createElement('div');
	strategiesSection.innerHTML = `<strong>Strategies</strong><p>${strategies}</p>`;

	const reframedThoughtSection = document.createElement('div');
	reframedThoughtSection.innerHTML = `<strong>Reframed Thought</strong><p>${reframed_thought}</p>`;

	accordionBody.appendChild(explanationSection);
	accordionBody.appendChild(strategiesSection);
	accordionBody.appendChild(reframedThoughtSection);

	accordionHeader.appendChild(accordionButton);
	accordionItem.appendChild(accordionHeader);
	accordionCollapse.appendChild(accordionBody);
	accordionItem.appendChild(accordionCollapse);

	return accordionItem;
}

/* ========================================================================== */
/* END Form Submission                                                        */
/* ========================================================================== */
