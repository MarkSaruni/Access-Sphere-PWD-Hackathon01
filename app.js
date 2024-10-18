document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Initialize Bootstrap Carousel with custom settings
    let carouselElement = document.querySelector('#carouselExample');
    if (carouselElement) {
      let carousel = new bootstrap.Carousel(carouselElement, {
        interval: 5000,  // Auto-change slides every 5 seconds
        pause: 'hover'
      });
    }
  
    // Trigger form validation for registration and login forms
    let forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(form => {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  
    // Trigger dynamic content loading
    const jobContainer = document.getElementById('job-container');
    if (jobContainer) {
      fetchJobs();
    }
  
    // Lazy load carousel images for better performance
    const carouselImages = document.querySelectorAll('.carousel-item img');
    lazyLoadCarousel(carouselImages);
  
    // Initialize tooltips (optional)
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
  
  // Function to lazily load carousel images
  function lazyLoadCarousel(images) {
    images.forEach(img => {
      if (!img.src) {
        img.src = img.getAttribute('data-src');  // Load the real image source
      }
    });
  }
  
  // Function to fetch job listings via API
  async function fetchJobs() {
    try {
      let response = await fetch('/api/jobs');  // Replace with your backend API URL
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      let jobs = await response.json();
      renderJobs(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      document.getElementById('job-container').innerHTML = '<p>Unable to load jobs. Please try again later.</p>';
    }
  }
  
  // Function to dynamically render job listings
  function renderJobs(jobs) {
    const jobContainer = document.getElementById('job-container');
    jobContainer.innerHTML = '';  // Clear current jobs before rendering new ones
    jobs.forEach(job => {
      let jobCard = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${job.company_logo_url}" class="card-img-top" alt="${job.company_name}">
            <div class="card-body">
              <h5 class="card-title">${job.title}</h5>
              <p class="card-text">${job.company_name} - ${job.location}</p>
              <a href="/job/${job.id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;
      jobContainer.innerHTML += jobCard;
    });
  }
  
  // Handle registration form submission
  async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
  
    const payload = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      accessibility_needs: formData.get('accessibility_needs')
    };
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      const result = await response.json();
      alert('Registration successful!');
      window.location.href = '/login';  // Redirect to login
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  
  // Handle login form submission
  async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
  
    const payload = {
      email: formData.get('email'),
      password: formData.get('password')
    };
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const result = await response.json();
      alert('Login successful!');
      window.location.href = '/dashboard';  // Redirect to dashboard
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  
  // Handle logout functionality
  async function handleLogout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      alert('Logged out successfully!');
      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  
  // Attach the event listeners for register and login forms
  const registerForm = document.querySelector('form[action="/register"]');
  const loginForm = document.querySelector('form[action="/login"]');
  const logoutButton = document.querySelector('a[href="/logout"]');
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
  
  // Function to lazy load images in the carousel
  function lazyLoadCarousel() {
    const carouselImages = document.querySelectorAll('.carousel-item img[data-src]');
    carouselImages.forEach(img => {
      img.src = img.getAttribute('data-src');  // Load real image
      img.removeAttribute('data-src');  // Remove the data-src attribute
    });
  }
  
  // IntersectionObserver for lazy loading images when carousel enters viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lazyLoadCarousel();
        observer.disconnect();  // Stop observing once the images are loaded
      }
    });
  });
  
  observer.observe(document.querySelector('#carouselExample'));
  
  // SEO Meta Tags Update (dynamic content like job details)
  function updateSEOMetaTags(job) {
    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription.setAttribute("content", `Job: ${job.title} at ${job.company_name}. Apply today!`);
  
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    metaKeywords.setAttribute("content", `${job.title}, ${job.company_name}, ${job.location}, inclusive jobs, PWD jobs`);
  }
  
  // Dynamic focus management for modals (ensuring keyboard accessibility)
  function trapFocus(modal) {
    let focusableElements = modal.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
    let firstElement = focusableElements[0];
    let lastElement = focusableElements[focusableElements.length - 1];
  
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  
  // Example of trapping focus when a modal is opened
  const modalElement = document.getElementById('jobModal');
  if (modalElement) {
    trapFocus(modalElement);
  }
  