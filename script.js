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


const serviceCards = document.querySelectorAll(".service-card");

const reveal = () => {
  serviceCards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
};

serviceCards.forEach(card => {
  card.style.opacity = 0;
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s ease";
});

window.addEventListener("scroll", reveal);
reveal();
