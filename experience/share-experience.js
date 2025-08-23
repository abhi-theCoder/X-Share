document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const nextBtn = document.getElementById('next-btn');

    let selectedExperience = null;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'selected' class from all cards
            cards.forEach(c => c.classList.remove('selected-card'));
            
            // Add 'selected' class to the clicked card
            card.classList.add('selected-card');

            // Store the selected experience ID
            selectedExperience = card.id;

            // Enable the next button
            nextBtn.disabled = false;
        });
    });

    nextBtn.addEventListener('click', () => {
        if (selectedExperience === 'placement-card') {
            // If 'Placement' is selected, navigate to the placement form page
            window.location.href = '../Share-Placement/index.html';
        } else if (selectedExperience === 'internship-card') {
            // If 'Placement' is selected, navigate to the placement form page
            window.location.href = '../Share-internship/index.html';
        } else if (selectedExperience === 'hackathon-card') {
            // If 'Placement' is selected, navigate to the placement form page
            window.location.href = '../Share-Hackathon/index.html';
        } else {
            // For other selections, you would add logic to go to other pages
            // For this example, we'll just show an alert
            alert('This feature is coming soon....');
        }
    });
});