// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const stepInfo = document.getElementById('step-info');
    const progressBar = document.getElementById('progress-bar');
    const stepNav = document.getElementById('step-nav');
    const reviewContent = document.getElementById('review-content');
    
    let currentStep = 0; // Initialize with the first step (index 0)

    // Function to collect all form data
    function collectFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('#multi-step-form input, #multi-step-form textarea');

        inputs.forEach(input => {
            const name = input.name;
            if (name) {
                if (input.type === 'radio') {
                    if (input.checked) {
                        formData[name] = input.value;
                    }
                } else if (input.type === 'checkbox') {
                    if (input.checked) {
                        if (!formData[name]) {
                            formData[name] = [];
                        }
                        formData[name].push(input.value);
                    }
                } else {
                    formData[name] = input.value;
                }
            }
        });
        return formData;
    }

    // Function to display collected data on the review step
    function displayReviewData(data) {
        let htmlContent = '';
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                const title = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                let value = data[key];
                if (Array.isArray(value)) {
                    value = value.join(', ');
                }
                htmlContent += `
                    <div class="p-4 bg-white rounded-xl shadow-sm">
                        <h4 class="font-bold text-gray-800">${title}</h4>
                        <p class="text-gray-600 mt-1">${value}</p>
                    </div>
                `;
            }
        }
        reviewContent.innerHTML = htmlContent;
    }

    // Function to handle the final submission and save data to localStorage
    function submitForm() {
        const formData = collectFormData();
        
        // Add a unique ID and the 'isApproved' status to the form data.
        formData.id = Date.now();
        formData.isApproved = 'pending';

        // Get existing data from localStorage or initialize an empty array
        const existingData = JSON.parse(localStorage.getItem('pendingExperiences')) || [];
        
        // Add the new form data to the array
        existingData.push(formData);
        
        // Save the updated array back to localStorage
        localStorage.setItem('pendingExperiences', JSON.stringify(existingData));
        
        console.log('Final Form Data:', formData);
        
        // Using a custom message box instead of alert()
        const messageBox = document.createElement('div');
        messageBox.innerHTML = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl p-8 shadow-2xl max-w-sm text-center">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Success!</h3>
                    <p class="text-gray-600 mb-6">Your form has been submitted successfully.</p>
                    <button class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200" onclick="this.parentNode.parentNode.remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(messageBox);
        // In a real application, you would send this data to a server here, e.g., using fetch().
    }

    // Function to update the form's display
    function updateForm() {
        // Hide all steps first
        steps.forEach(step => {
            step.classList.add('hidden');
        });

        // Show the current step with a fade-in animation
        steps[currentStep].classList.remove('hidden');
        steps[currentStep].classList.add('fade-in');

        // Update the step information text (e.g., "Step 1 of 6")
        stepInfo.textContent = `Step ${currentStep + 1} of ${steps.length}`;

        // Update the progress bar width
        const progress = (currentStep) / (steps.length - 1) * 100;
        progressBar.style.width = `${progress}%`;

        // Update the bottom step indicator
        // Select direct children divs of stepNav
        const navItems = stepNav.querySelectorAll('#step-nav > div');
        navItems.forEach((navItem, index) => {
            const circle = navItem.querySelector('div');
            const label = navItem.querySelector('span');
            
            // Check if circle and label exist before trying to access classList
            if (circle && label) {
                if (index === currentStep) {
                    circle.classList.remove('bg-gray-300', 'text-gray-500');
                    circle.classList.add('bg-blue-600', 'text-white');
                    label.classList.remove('text-gray-500');
                    label.classList.add('text-blue-600', 'font-medium');
                } else if (index < currentStep) {
                    circle.classList.remove('bg-gray-300', 'text-gray-500');
                    circle.classList.add('bg-blue-600', 'text-white');
                    label.classList.remove('text-gray-500');
                    label.classList.add('text-blue-600', 'font-medium');
                } else {
                    circle.classList.remove('bg-blue-600', 'text-white');
                    circle.classList.add('bg-gray-300', 'text-gray-500');
                    label.classList.remove('text-blue-600', 'font-medium');
                    label.classList.add('text-gray-500');
                }
            }
        });

        // Show/hide the Previous button based on the current step
        if (currentStep === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        // Change button text and color on the last step
        if (currentStep === steps.length - 1) {
            nextBtn.innerHTML = 'Submit';
            nextBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            nextBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        } else {
            nextBtn.innerHTML = `Next Step <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
            nextBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            nextBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
    }

    // Event listener for the "Next" button
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission for now

        // Check if we are on the final step
        if (currentStep === steps.length - 1) {
            submitForm();
        } else {
            // Check if we are moving to the review step
            if (currentStep === steps.length - 2) {
                const formData = collectFormData();
                displayReviewData(formData);
            }
            currentStep++;
            updateForm();
        }
    });

    // Event listener for the "Previous" button
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default action
        
        // Check if it's not the first step
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });

    // Initial form setup
    updateForm();
});
