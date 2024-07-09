document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));

            fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showPopup();
                } else {
                    alert('Error sending email. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error sending email. Please try again.');
            });
        });
    }

    function showPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.classList.add('show');
        }
    }

    function closePopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.classList.remove('show');
        }
    }

    // Live Data Fetching
    const liveDataDiv = document.getElementById('live-data');
    if (liveDataDiv) {
        // Function to fetch live data from the backend
        async function fetchLiveData() {
            try {
                const response = await fetch('http://localhost:3001/live-data');
                const data = await response.json();

                // Update the algorithm tab with the live data
                liveDataDiv.innerHTML = `
                    <p>Live Data:</p>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } catch (error) {
                console.error('Error fetching live data:', error);
            }
        }

        // Fetch live data periodically
        setInterval(fetchLiveData, 5000); // Fetch every 5 seconds
    }
});
