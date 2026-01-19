let value = 0;
const target = 12847;
const counter = document.getElementById("counter");

const animate = setInterval(() => {
  value += 97;
  counter.textContent = value.toLocaleString();

  if (value >= target) {
    counter.textContent = target.toLocaleString();
    clearInterval(animate);
  }
}, 20);


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
