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

// Фейковый онлайн в header (зависит от времени суток по МСК)
function getMoscowTime() {
  const now = new Date();
  // Получаем московское время (UTC+3)
  // Используем toLocaleString для получения времени в часовом поясе Москвы
  const moscowTimeString = now.toLocaleString('en-US', { 
    timeZone: 'Europe/Moscow',
    hour: 'numeric',
    hour12: false
  });
  return parseInt(moscowTimeString);
}

function getOnlineRange() {
  const hour = getMoscowTime();
  
  // Ночь (0-6): минимум
  if (hour >= 0 && hour < 6) {
    return { min: 120, max: 200 };
  }
  // Утро (6-12): около 170
  else if (hour >= 6 && hour < 12) {
    return { min: 150, max: 250 };
  }
  // День (12-18): средне
  else if (hour >= 12 && hour < 18) {
    return { min: 200, max: 350 };
  }
  // Вечер (18-24): больше
  else {
    return { min: 300, max: 500 };
  }
}

function updateOnlineCount() {
  const onlineCountElement = document.getElementById('onlineCount');
  if (onlineCountElement) {
    const range = getOnlineRange();
    const currentCount = parseInt(onlineCountElement.textContent) || range.min;
    
    // Ограничиваем максимальное изменение за раз (не больше 20 единиц)
    const maxChange = 20;
    const targetMin = Math.max(range.min, currentCount - maxChange);
    const targetMax = Math.min(range.max, currentCount + maxChange);
    
    // Генерируем новое значение в ограниченном диапазоне
    const newCount = Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin;
    
    // Плавная анимация изменения числа (медленнее)
    const diff = newCount - currentCount;
    const stepValue = diff > 0 ? 1 : -1;
    let current = currentCount;
    
    const updateInterval = setInterval(() => {
      current += stepValue;
      onlineCountElement.textContent = current;
      
      if ((stepValue > 0 && current >= newCount) || (stepValue < 0 && current <= newCount)) {
        onlineCountElement.textContent = newCount;
        clearInterval(updateInterval);
      }
    }, 30); // Немного медленнее анимация
  }
}

// Обновляем онлайн при загрузке страницы
if (document.getElementById('onlineCount')) {
  updateOnlineCount();
  
  // Обновляем онлайн каждые 25-45 секунд (реже)
  setInterval(() => {
    updateOnlineCount();
  }, Math.random() * 20000 + 25000);
}

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

  // ФУНКЦИОНАЛ ОТЗЫВОВ
const reviewForm = document.getElementById('reviewForm');
const reviewsContainer = document.getElementById('reviewsContainer');
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

// Инициализация рейтинга (по умолчанию 5 звезд)
let currentRating = 5;
updateStars(5);

// Обработка клика по звездам
stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    const rating = index + 1;
    currentRating = rating;
    ratingInput.value = rating;
    updateStars(rating);
  });
});

// Обновление визуального отображения звезд
function updateStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// Обработка наведения на звезды
const starRating = document.querySelector('.star-rating');
if (starRating) {
  starRating.addEventListener('mouseleave', () => {
    updateStars(currentRating);
  });
  
  stars.forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
      const hoverRating = index + 1;
      stars.forEach((s, i) => {
        if (i < hoverRating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
}

// Загрузка отзывов из localStorage
function loadReviews() {
  const savedReviews = localStorage.getItem('vpnReviews');
  if (savedReviews) {
    const reviews = JSON.parse(savedReviews);
    reviews.forEach(review => {
      addReviewToPage(review);
    });
  }
}

// Сохранение отзыва в localStorage
function saveReview(review) {
  const savedReviews = localStorage.getItem('vpnReviews');
  const reviews = savedReviews ? JSON.parse(savedReviews) : [];
  reviews.push(review);
  localStorage.setItem('vpnReviews', JSON.stringify(reviews));
}

// Добавление отзыва на страницу
function addReviewToPage(review) {
  const reviewCard = document.createElement('div');
  reviewCard.className = 'review-card';
  
  // Получаем первую букву username для аватара
  const avatarLetter = review.username.charAt(0).toUpperCase();
  
  // Форматируем дату
  const dateStr = formatDate(review.date);
  
  // Создаем звезды
  let starsHTML = '';
  for (let i = 0; i < 5; i++) {
    starsHTML += `<span class="material-icons">${i < review.rating ? 'star' : 'star_border'}</span>`;
  }
  
  reviewCard.innerHTML = `
    <div class="review-header">
      <div class="review-avatar">${avatarLetter}</div>
      <div class="review-author">
        <div class="review-name">${escapeHtml(review.username)}</div>
        <div class="review-date">${dateStr}</div>
      </div>
      <div class="review-rating">
        ${starsHTML}
      </div>
    </div>
    <p class="review-text">${escapeHtml(review.text)}</p>
  `;
  
  // Добавляем в начало контейнера
  reviewsContainer.insertBefore(reviewCard, reviewsContainer.firstChild);
  
  // Добавляем анимацию появления
  setTimeout(() => {
    reviewCard.classList.add('visible');
  }, 100);
  
  // Наблюдаем за новой карточкой
  reviewObserver.observe(reviewCard);
}

// Форматирование даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'сегодня';
  } else if (diffDays === 1) {
    return 'вчера';
  } else if (diffDays < 7) {
    return `${diffDays} ${getDayWord(diffDays)} назад`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${getWeekWord(weeks)} назад`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${getMonthWord(months)} назад`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${getYearWord(years)} назад`;
  }
}

function getDayWord(days) {
  if (days === 1) return 'день';
  if (days >= 2 && days <= 4) return 'дня';
  return 'дней';
}

function getWeekWord(weeks) {
  if (weeks === 1) return 'неделя';
  if (weeks >= 2 && weeks <= 4) return 'недели';
  return 'недель';
}

function getMonthWord(months) {
  if (months === 1) return 'месяц';
  if (months >= 2 && months <= 4) return 'месяца';
  return 'месяцев';
}

function getYearWord(years) {
  if (years === 1) return 'год';
  if (years >= 2 && years <= 4) return 'года';
  return 'лет';
}

// Экранирование HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Обработка отправки формы
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const rating = parseInt(ratingInput.value);
    const text = document.getElementById('reviewText').value.trim();
    
    // Очистка username от @ если есть
    const cleanUsername = username.replace(/^@/, '');
    
    if (!cleanUsername || !text) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    // Создаем объект отзыва
    const review = {
      username: cleanUsername,
      rating: rating,
      text: text,
      date: new Date().toISOString()
    };
    
    // Сохраняем отзыв
    saveReview(review);
    
    // Добавляем на страницу
    addReviewToPage(review);
    
    // Очищаем форму
    reviewForm.reset();
    currentRating = 5;
    ratingInput.value = 5;
    updateStars(5);
    
    // Показываем сообщение об успехе
    const submitBtn = reviewForm.querySelector('.review-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отзыв отправлен!';
    submitBtn.style.background = 'rgba(0, 255, 65, 0.4)';
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 2000);
  });
}

// Загружаем сохраненные отзывы при загрузке страницы
loadReviews();

// ОТСЛЕЖИВАНИЕ ТРАФИКА - передача ref как start в Telegram бота
function addRefParamToTelegramLinks() {
  // Получаем параметр ref из URL страницы
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');
  
  // Если параметр ref есть, передаем его как start в ссылки на бота
  if (refParam) {
    const telegramBotLinks = document.querySelectorAll('a[href*="t.me/coffemaniaVPNbot"]');
    
    telegramBotLinks.forEach(link => {
      const currentHref = link.getAttribute('href');
      const url = new URL(currentHref);
      
      // Передаем ref как start в Telegram бота
      url.searchParams.set('start', refParam);
      
      // Обновляем href
      link.setAttribute('href', url.toString());
    });
  }
}

// Инициализация при загрузке страницы
addRefParamToTelegramLinks();