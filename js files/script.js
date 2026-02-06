const counter = document.getElementById("counter");
if (counter) {
  let value = 0;
  const target = 12847;
  const animate = setInterval(() => {
    value += 97;
    counter.textContent = value.toLocaleString();

    if (value >= target) {
      counter.textContent = target.toLocaleString();
      clearInterval(animate);
    }
  }, 20);
}


const reveals = document.querySelectorAll(".reveal, .service-card");

const reveal = () => {
  const windowHeight = window.innerHeight;
  const elementVisible = 100;

  reveals.forEach((reveal) => {
    const elementTop = reveal.getBoundingClientRect().top;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    } else {
      reveal.classList.remove("active");
      // Optional: Remove else block if you want them to stay visible once revealed
    }
  });
};

window.addEventListener("scroll", reveal);
reveal(); // Trigger once on load

// WATCH DEMO MODAL
const watchDemoBtn = document.getElementById('watch-demo-btn');
const demoModal = document.getElementById('demo-modal');
const closeModal = document.getElementById('close-modal');
const demoVideo = document.getElementById('demo-video');

if (watchDemoBtn && demoModal && closeModal) {
  watchDemoBtn.addEventListener('click', () => {
    demoModal.classList.add('active');
    // Reload the video to autoplay if needed (YouTube embed trick)
    const videoSrc = demoVideo.src;
    demoVideo.src = videoSrc + (videoSrc.includes('?') ? '&' : '?') + 'autoplay=1';
  });

  const hideModal = () => {
    demoModal.classList.remove('active');
    // Stop the video by resetting the src
    const videoSrc = demoVideo.src;
    demoVideo.src = videoSrc.split('&autoplay=1')[0].split('?autoplay=1')[0];
  };

  closeModal.addEventListener('click', hideModal);

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      hideModal();
    }
  });
}

// MOBILE MENU TOGGLE
const menuToggle = document.getElementById('menu-toggle');
const navLinksMobile = document.querySelector('.nav-links');

if (menuToggle && navLinksMobile) {
  menuToggle.addEventListener('click', () => {
    navLinksMobile.classList.toggle('active');

    // Animate hamburger icon (optional)
    const icon = menuToggle.querySelector('i');
    if (navLinksMobile.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });

  // Close menu when clicking a link
  const links = navLinksMobile.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinksMobile.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });
}
