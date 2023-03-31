// Get the form element and the output element
const form = document.getElementById('thought-form');
const output = document.getElementById('output');
const outerOutput = document.getElementById('outer-output');

// Add submit event listener to the form
form.addEventListener('submit', event => {
	// Prevent the default behavior of form submission
	event.preventDefault();

	// Extract data from the form fields
	const formData = new FormData(form);
    toggle_loading_spinner();

	// Use the fetch method to send the POST request to the server
	fetch('/results', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json()) // Parse the response as JSON
		.then(data => {
			// Display the response output on the page
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
    output.innerHTML = "";
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