document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));
  
        console.log('Form data being sent:', data); // Log the form data being sent
  
        fetch('http://localhost:3001/send-email', { // Ensure the URL and port are correct
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
  });
  