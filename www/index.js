const checkboxes = document.querySelectorAll('input[type="checkbox"]');
for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', function() {
    if (this.checked) {
      this.value = "on";
    } else {
      this.value = "off";
    }
  });
  if (!checkboxes[i].checked) {
    checkboxes[i].value = "off";
  }
}
const form = document.getElementById('my-form');
const inputs = form.querySelectorAll('input, select');
const defaultFormData = {};
inputs.forEach(input => {
	const name = input.name;
	const defaultValue = input.defaultValue;
	if (input.closest('.settings')) {
		if (!defaultFormData.settings) {
			defaultFormData.settings = {};
		}
		defaultFormData.settings[name] = defaultValue;
	} else {
		defaultFormData[name] = defaultValue;
	}
});
form.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = {};
	inputs.forEach(input => {
		const name = input.name;
		let value = input.value;
		if (input.closest('.settings')) {
			if (!formData.settings) {
				formData.settings = {};
			}
			formData.settings[name] = value;
			if (value === input.defaultValue) {
				delete formData.settings[name];
			}
		} else {
			formData[name] = value;
			if (value === input.defaultValue) {
				delete formData[name];
			}
		}
		if (value === '' || value === input.defaultValue) {
			if (input.placeholder) {
				value = input.placeholder;
			}
		}
		if (input.closest('.settings')) {
			formData.settings[name] = value;
		} else {
			formData[name] = value;
		}
	});
	for (const [key, value] of Object.entries(defaultFormData)) {
		if (!(key in formData)) {
			if (input.placeholder) {
				if (input.closest('.settings')) {
					formData.settings[key] = input.placeholder;
				} else {
					formData[key] = input.placeholder;
				}
			} else {
				if (input.closest('.settings')) {
					formData.settings[key] = value;
				} else {
					formData[key] = value;
				}
			}
		}
	}
	const jsonData = {
		config: formData
	};
	const jsonString = JSON.stringify(jsonData);
	fetch('/config', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonString
	})
		.then(response => {
			if (response.ok) {
				// The server responded with a successful status code (e.g. 200 OK)
				console.log('Form data submitted successfully');
				window.location.replace("/build.zip");

			} else {
				// The server responded with an error status code (e.g. 400 Bad Request)
				alert('Error submitting form data:', response.statusText);
			}
		})
		.catch(error => {
			// An error occurred while sending the request or processing the response
			alert('Error submitting form data:', error);
		});
	
});