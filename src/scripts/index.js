import "../styles/index.scss";
import throttle from "lodash.throttle";

import { isMobile } from "./utils.js";
import initDisclosures from "./disclosure.js";
// import "./range-slider.min.js";
import Lenis from 'lenis';

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
window.app.lenis =  new Lenis({
	autoRaf: true,
})

document.documentElement.classList.toggle("is-mobile", isMobile.any());


initDisclosures();
app.drawers.init();

// const tustedBySlider = new KeenSlider("#trusted-by", {
// 	selector: ".trusted-by__item",
// 	loop: true,
// 	slides: {
// 		perView: "auto",
// 		spacing: 20,
// 	}
// });
// setInterval(() => tustedBySlider.next(), 2000);

const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("_shown");
		}
	});
}, { threshold: 0.8 });
document.querySelectorAll(`[data-component*=":intersection-observer:"]`).forEach(elem => {
	intersectionObserver.observe(elem);
});

initCalculator();

function initCalculator() {
	const rangeTotal = document.querySelector(".range__total");
	const slider = document.querySelector("#monetizing-hours");
	const recalc = () => {
		document.querySelectorAll(".points__item").forEach(function (item) {
			item.classList.remove("points__item_active");
		});
		document
			.querySelector('[data-item="' + slider.value + '"]')?.classList.add("points__item_active");

		rangeTotal.innerText = `$${slider.value * 5}-$${slider.value * 5 + 25}`;
	};
	recalc();
	slider.addEventListener("change", recalc);
}

window.onSubmitReCaptcha = async function() {
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
// Hide title
document.addEventListener("scroll", throttle(() => {
	document.documentElement.classList.toggle("hide-title", window.scrollY > 50);
}));


document.querySelectorAll(`[href*="#"]`).forEach(elem => {
	elem.addEventListener("click", (e) => {
		e.preventDefault();
		const pattern = /.*?(\#.*)/;
		const href = elem.getAttribute("href");
		const match = href.match(pattern);
		const anchor = match ? match[1] : null;

		history.pushState(null, "", anchor);
		app.drawers.close("main-menu");
		window.app.lenis.scrollTo(anchor, { offset: -80 });
	});
});
document.querySelectorAll(`.range-slider`).forEach(elem => {
	const recalcProgress = () => {
		const min = parseFloat(elem.getAttribute("min"));
		const max = parseFloat(elem.getAttribute("max"));
		console.log(elem.value, min, max);
		elem.style.setProperty("--progress", `${(elem.value - min) / (max - min) * 100}%`);
	};
	recalcProgress();
	elem.addEventListener("input", recalcProgress);
});