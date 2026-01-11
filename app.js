const button = document.querySelector(".connect-btn");
const bars = document.querySelectorAll(".slashes span");
const title = document.querySelector(".title");
const connectionStatus = document.querySelector(".connection-status");
const statusText = document.querySelector(".status-text");
const progressBar = document.querySelector(".progress-bar");
const steps = document.querySelectorAll(".step");

let interval = null;
let isConnecting = false;
let isConnected = false;

// Анимация полосок при наведении
button.addEventListener("mouseenter", () => {
  let i = 0;
  interval = setInterval(() => {
    bars.forEach(b => {
      b.style.opacity = "0.4";
      b.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.1)";
    });
    bars[i].style.opacity = "0.8";
    bars[i].style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.2)";
    i = (i + 1) % bars.length;
  }, 180);
});

button.addEventListener("mouseleave", () => {
  clearInterval(interval);
  bars.forEach(b => {
    b.style.opacity = "0.4";
    b.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.1)";
  });
});

// Эффект типапинга для заголовка (опционально)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Случайные глитч-эффекты
setInterval(() => {
  if (Math.random() > 0.7) {
    title.style.animation = 'none';
    setTimeout(() => {
      title.style.animation = 'glitch 0.3s';
    }, 10);
  }
}, 3000);

// Эффект мерцания для текста
const glass = document.querySelector(".glass");
if (glass) {
  setInterval(() => {
    if (Math.random() > 0.8) {
      glass.style.opacity = "0.7";
      setTimeout(() => {
        glass.style.opacity = "1";
      }, 100);
    }
  }, 2000);
}

// Анимация подключения к VPN
function startConnectionAnimation() {
  if (isConnecting) return;
  
  isConnecting = true;
  connectionStatus.classList.add("connecting");
  
  // Сброс состояния
  progressBar.style.width = "0%";
  steps.forEach(step => {
    step.classList.remove("active", "completed");
  });
  
  // Этап 1: Инициализация
  statusText.textContent = "> Инициализация подключения...";
  steps[0].classList.add("active");
  progressBar.style.width = "25%";
  
  setTimeout(() => {
    steps[0].classList.remove("active");
    steps[0].classList.add("completed");
    steps[1].classList.add("active");
    statusText.textContent = "> Поиск оптимального сервера...";
    progressBar.style.width = "50%";
    
    setTimeout(() => {
      steps[1].classList.remove("active");
      steps[1].classList.add("completed");
      steps[2].classList.add("active");
      statusText.textContent = "> Установка защищенного соединения...";
      progressBar.style.width = "75%";
      
      setTimeout(() => {
        steps[2].classList.remove("active");
        steps[2].classList.add("completed");
        steps[3].classList.add("active");
        statusText.textContent = "> Подключено успешно!";
        progressBar.style.width = "100%";
        
        // Анимация успешного подключения
        setTimeout(() => {
          statusText.textContent = "> ВПН готов к подключению";
          steps[3].classList.remove("active");
          steps[3].classList.add("completed");
          isConnecting = false;
          isConnected = true;
        }, 1000);
      }, 1500);
    }, 1500);
  }, 1500);
}

// Кнопка подключения теперь сразу переходит в бота (без анимации)

// Эффект частиц при клике (более тонкий)
document.addEventListener("click", (e) => {
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = e.clientX + "px";
    particle.style.top = e.clientY + "px";
    particle.style.width = "2px";
    particle.style.height = "2px";
    particle.style.background = "#ffffff";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9999";
    particle.style.boxShadow = "0 0 3px rgba(255, 255, 255, 0.5)";
    particle.style.opacity = "0.6";
    
    const angle = (Math.PI * 2 * i) / 6;
    const velocity = 30 + Math.random() * 30;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    document.body.appendChild(particle);
    
    let x = e.clientX;
    let y = e.clientY;
    let opacity = 0.6;
    
    const animate = () => {
      x += vx * 0.1;
      y += vy * 0.1;
      opacity -= 0.03;
      
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };
    
    animate();
  }
});

// Анимация фона при прокрутке
const bgLayer1 = document.querySelector(".bg-layer-1");
const bgLayer2 = document.querySelector(".bg-layer-2");
const bgLayer3 = document.querySelector(".bg-layer-3");

function updateBackgroundOnScroll() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollProgress = scrollY / (documentHeight - windowHeight);
  
  // Плавный переход между слоями
  if (scrollProgress < 0.33) {
    // Первая треть страницы - первый фон
    const opacity = 1 - (scrollProgress / 0.33);
    bgLayer1.style.opacity = opacity;
    bgLayer2.style.opacity = 0;
    bgLayer3.style.opacity = 0;
  } else if (scrollProgress < 0.66) {
    // Вторая треть - переход между первым и вторым
    const progress = (scrollProgress - 0.33) / 0.33;
    bgLayer1.style.opacity = 0;
    bgLayer2.style.opacity = progress;
    bgLayer3.style.opacity = 0;
  } else {
    // Последняя треть - переход между вторым и третьим
    const progress = (scrollProgress - 0.66) / 0.34;
    bgLayer2.style.opacity = 1 - progress;
    bgLayer3.style.opacity = progress;
  }
}

// Показ/скрытие фиксированного хедера при прокрутке
const fixedHeader = document.querySelector(".fixed-header");

function handleHeaderScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 200) {
    fixedHeader.classList.add("visible");
  } else {
    fixedHeader.classList.remove("visible");
  }
}

// Оптимизированный обработчик скролла
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateBackgroundOnScroll();
      handleHeaderScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Инициализация при загрузке
updateBackgroundOnScroll();
handleHeaderScroll();

// Анимация появления карточек преимуществ при прокрутке
const featureCards = document.querySelectorAll(".feature-card");

const featureObserverOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -80px 0px"
};

const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      featureObserver.unobserve(entry.target);
    }
  });
}, featureObserverOptions);

featureCards.forEach((card) => {
  featureObserver.observe(card);
});

// Анимация появления карточек сравнения скорости при прокрутке
const speedCards = document.querySelectorAll(".speed-card");

const speedObserverOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -100px 0px"
};

const speedObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      speedObserver.unobserve(entry.target);
    }
  });
}, speedObserverOptions);

speedCards.forEach((card) => {
  speedObserver.observe(card);
});

// Анимация появления отзывов при прокрутке
const reviewCards = document.querySelectorAll(".review-card");

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const reviewObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      reviewObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

reviewCards.forEach((card) => {
  reviewObserver.observe(card);
});
