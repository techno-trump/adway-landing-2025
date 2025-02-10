const scrollNavContainer = document.querySelector(".scroll-nav-container");
const rangeTotal = document.querySelector(".range__total");
const videoControlButtons = document.querySelectorAll(".controls__button");
const showModal = document.querySelectorAll(".showModal");
const closeModal = document.querySelectorAll(".closeModal");
const hamburger = document.querySelector(".hamburger");
const subscribeForm = document.querySelector(".subscribe__form");
const slider = document.querySelectorAll("input[data-rangeSlider]");
const animateShowList = document.querySelectorAll(".become-client__paragraph");

const mediaLinks = document.querySelectorAll(".media-list__link");

mediaLinks.forEach(function (el) {
  el.addEventListener("mouseenter", function (event) {
    mediaLinks.forEach(function (link) {
      link.classList.add("media-list__link_hovered");
    });
    event.target.classList.remove("media-list__link_hovered");
  });

  el.addEventListener("mouseleave", function (event) {
    mediaLinks.forEach(function (link) {
      link.classList.remove("media-list__link_hovered");
    });
  });
});

function showBlocks() {
  for (let i = 0; i < animateShowList.length; i++) {
    setTimeout(function () {
      if (
        !animateShowList[i].classList.contains("become-client__paragraph_show")
      ) {
        animateShowList[i].classList.add("become-client__paragraph_show");
      }
    }, i * 300);
  }
}

function scrollPageToElement(hash) {
  const element = document.getElementById(hash);
  if (element) {
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: element.offsetTop,
    });
  }
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function initKeyShotXR() {
  const config = {
    nameOfDiv: "KeyShotXR",
    folderName: "../assets/3d",
    viewPortWidth: 630,
    viewPortHeight: 370,
    backgroundColor: "transparent",
    uCount: 20,
    vCount: 1,
    uWrap: true,
    vWrap: false,
    uMouseSensitivity: -0.1,
    vMouseSensitivity: 0,
    uStartIndex: 19,
    vStartIndex: 0,
    minZoom: -1,
    maxZoom: 1,
    rotationDamping: 0.96,
    downScaleToBrowser: true,
    addDownScaleGUIButton: false,
    downloadOnInteraction: false,
    imageExtension: "jpg",
    showLoading: true,
    loadingIcon: "ks_logo.png",
    allowFullscreen: true,
    uReverse: false,
    vReverse: false,
    hotspots: {},
  };

  return new keyshotXR(...Object.values(config));
}

function closeModalHandler() {
  document.body.classList.remove("ov-hidden");
  document.querySelector(".overlay").classList.remove("overlay_show");
  document.querySelector(".modal_show").classList.remove("modal_show");
}

async function onSubmitReCaptcha() {
  const API_KEY = "11EB8AC1618FB46A9AAE12EE88221E3B";
  const input = document.querySelector(".subscribe__input");
  const email = input.value;
  const response = await fetch("https://api.adwayusa.com/add/email", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify({
      API_KEY,
      data: {
        email,
      },
    }),
  });
  const res = await response.json();
  if (res.result === "success") {
    input.value = "";

    const modal = document.querySelector('[data-modal="4"]');
    document.querySelector(".overlay").classList.add("overlay_show");
    modal.classList.add("modal_show");
    document.querySelectorAll(".modal").forEach(function (itemModal) {
      if (itemModal.dataset.modal !== modal.dataset.modal) {
        itemModal.style.display = "none";
      }
    });
    modal.addEventListener("transitionend", (e) => {
      if (!e.target.classList.contains("modal_show")) {
        document.querySelectorAll(".modal").forEach(function (itemModal) {
          itemModal.removeAttribute("style");
        });
      }
    });
  }
  window.grecaptcha.reset();
}

hamburger.addEventListener("click", function () {
  document.querySelector(".header").classList.toggle("header_opened");
});

showModal.forEach(function (el) {
  el.addEventListener("click", function (e) {
    const modal = e.currentTarget.dataset.show;
    const modalElement = document.querySelector('[data-modal="' + modal + '"]');
    document.body.classList.add("ov-hidden");
    document.querySelector(".overlay").classList.add("overlay_show");
    modalElement.classList.add("modal_show");
    document.querySelectorAll(".modal").forEach(function (itemModal) {
      if (itemModal.dataset.modal !== modal) {
        itemModal.style.display = "none";
      }
    });

    modalElement.addEventListener("transitionend", (e) => {
      if (!e.target.classList.contains("modal_show")) {
        document.querySelectorAll(".modal").forEach(function (itemModal) {
          itemModal.removeAttribute("style");
        });
      }
    });

    new Swiper(".modalTextSwiper", {
      direction: "vertical",
      slidesPerView: "auto",
      freeMode: true,
      scrollbar: {
        el: ".swiper-scrollbar-modal-text",
        dragSize: 80,
      },
      mousewheel: true,
    });
  });
});

closeModal.forEach(function (el) {
  el.addEventListener("click", closeModalHandler);
});

document.body.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay_show")) {
    closeModalHandler();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Escape") {
    closeModalHandler();
  }
});

scrollNavContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const hash = e.target.getAttribute("href").slice(1);
    scrollPageToElement(hash);
    window.location.hash = hash;
    document.querySelector(".header").classList.toggle("header_opened");
  }
});

videoControlButtons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    const current = e.currentTarget;
    const currentVideo = current.dataset.video;
    const videoElement = document.querySelector(
      '[data-video="' + currentVideo + '"]'
    );
    const textElement = current
      .closest(".controls")
      .querySelector(".controls__label");
    const svgElement = current.firstElementChild;
    const useElement = svgElement.firstElementChild;
    const useXLinkHref = useElement.getAttribute("xlink:href").split("#")[0];

    if (current.classList.contains("control__button_play")) {
      current.classList.remove("control__button_play");
      current.classList.add("control__button_pause");
      textElement.innerText = "Pause the video";
      svgElement.classList.remove("controls__svg-icon_play");
      svgElement.classList.add("controls__svg-icon_pause");
      useElement.setAttribute("xlink:href", [useXLinkHref, "pause"].join("#"));
      videoElement.play();
      return;
    }

    current.classList.remove("control__button_pause");
    current.classList.add("control__button_play");
    textElement.innerText = "Watch the video";
    svgElement.classList.remove("controls__svg-icon_pause");
    svgElement.classList.add("controls__svg-icon_play");
    useElement.setAttribute("xlink:href", [useXLinkHref, "play"].join("#"));
    videoElement.pause();
  });
});

window.onload = function () {
  const hash = window.location.hash.slice(1);

  if (hash) {
    scrollPageToElement();
  }

  new Swiper(".testimonialsSwiper", {
    slidesPerView: 4,
    scrollbar: {
      el: ".swiper-scrollbar-testimonials",
      draggable: true,
      dragSize: 200,
    },
    breakpoints: {
      1920: {
        slidesPerView: 4,
      },
      1280: {
        slidesPerView: 3,
      },
      568: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    },
  });

  new Swiper(".case-studiesSwiper", {
    slidesPerView: 3,
    scrollbar: {
      el: ".swiper-scrollbar-case-studies",
      draggable: true,
      dragSize: 200,
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      568: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    },
  });

  new Swiper(".case-mediaSwiper", {
    slidesPerView: 4,
    scrollbar: {
      el: ".swiper-scrollbar-case-media",
      draggable: true,
      dragSize: 200,
    },
    breakpoints: {
      1280: {
        slidesPerView: 4,
      },
      568: {
        slidesPerView: 3,
      },
      320: {
        slidesPerView: 1,
      },
    },
  });

  initKeyShotXR();

  new Typed(".typed", {
    strings: ["DRIVING INTO DOLLARS", "COMMUTING INTO CASH"],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
  });

  rangeSlider.create(slider, {
    polyfill: true,
    rangeClass: "rangeSlider",
    disabledClass: "rangeSlider--disabled",
    fillClass: "rangeSlider__fill",
    bufferClass: "rangeSlider__buffer",
    handleClass: "rangeSlider__handle",
    startEvent: ["mousedown", "touchstart", "pointerdown"],
    moveEvent: ["mousemove", "touchmove", "pointermove"],
    endEvent: ["mouseup", "touchend", "pointerup"],
    min: 10,
    max: 60,
    step: 5,
    value: 25,

    onInit: function () {
      document
        .querySelector('[data-item="25"]')
        .classList.add("points__item_active");
    },

    onSlide: function (position) {
      rangeTotal.innerText = `$${position * 5}-$${position * 5 + 25}`;
    },

    onSlideEnd: function (position) {
      document.querySelectorAll(".points__item").forEach(function (item) {
        item.classList.remove("points__item_active");
      });
      document
        .querySelector('[data-item="' + position + '"]')
        .classList.add("points__item_active");
    },
  });
};

window.addEventListener("scroll", function () {
  if (
    window.scrollY >= document.querySelector(".become-client__title").offsetTop
  ) {
    showBlocks();
  }
});
