new Typed("#typed-text", {
    strings: [
        "Modern Platform",
        "Seamless Collaboration",
        "Resource Sharing"
    ],
    typeSpeed: 75,
    backSpeed: 30,
    loop: true,
    cursorChar: '|',
    fadeOut: true,
    fadeOutClass: 'typed-fade-out',
    fadeOutDelay: 500
});

// Modal functions
function openLogin() {
    document.getElementById("login-modal").style.display = "flex";
}
function closeLogin() {
    document.getElementById("login-modal").style.display = "none";
}
function openRegister() {
    document.getElementById("register-modal").style.display = "flex";
}
function closeRegister() {
    document.getElementById("register-modal").style.display = "none";
}
function handleLogin(e) {
    e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  fetch('login.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if(data.status === 'success') {
        alert(data.message);
        closeLogin();
        // Optionally, redirect to a dashboard:
        // window.location.href = 'dashboard.php';
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during login.');
    });
}
function handleRegister(e) {
    e.preventDefault();
  
    // Gather form data
    const form = e.target;
    const formData = new FormData(form);
  
    // Optionally, add an "action" field to tell your backend what to do:
    formData.append('action', 'registerUser');
  
    fetch('api.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if(data.status === 'success') {
        alert(data.message);
        closeRegister();
      } else {
        alert('Registration failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    });
  }
function handleContactSubmit(e) {
    e.preventDefault();
    alert("Message sent! We will contact you soon.");
    e.target.reset();
}

// Active nav link highlighting
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

function setActiveLink() {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").slice(1) === current) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", setActiveLink);

// Parallax effect for hero text
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

});