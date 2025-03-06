import "../styles/index.scss";
import throttle from "lodash.throttle";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";

import { isMobile } from "./utils.js";
import initDisclosures from "./disclosure.js";
import Lenis from 'lenis';

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
window.app.lenis =  new Lenis({
	autoRaf: true,
})

window.app.grecaptchaSiteKey = document.querySelector(`meta[name="gcaptcha-site-key"]`)?.getAttribute("content");
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
}, { threshold: window.innerWidth <= 768 ? 0.4 : 0.8 });
document.querySelectorAll(`[data-component*=":intersection-observer:"]`).forEach(elem => {
	intersectionObserver.observe(elem);
});

initCalculator();

function initCalculator() {
	const rangeTotal = document.querySelector(".range__total");
	if (!rangeTotal) return;
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

initFooterSubscription();

function initFooterSubscription() {
	const form = document.querySelector("#subscribe-form");
	const input = document.querySelector(".subscribe__input");
	const errorModalBody = document.querySelector(`[data-drawer="subscription-error"] .drawer__body`);
	const errorMsgTemplate = errorModalBody.innerHTML;

	const send = async (token) => {
		const API_KEY = "11EB8AC1618FB46A9AAE12EE88221E3B";
		const email = input.value;
		try {
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
			
			if (response.ok) {
				// const result = await response.json();
				window.app.drawers.open("subscription-success");
			} else {
				throw new Error(response.statusText);
			}
		} catch(ex) {
				console.error(ex);
			errorModalBody.innerHTML = errorMsgTemplate.replace("{{error-msg}}", `Error: ${ex.message}`);
			window.app.drawers.open("subscription-error");
		}
	}
	form.addEventListener("submit", (e) => {
		e.preventDefault();

		grecaptcha.execute(window.app.grecaptchaSiteKey, {action: 'submit'})
		.then(send);
	});
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
		elem.style.setProperty("--progress", `${(elem.value - min) / (max - min) * 100}%`);
	};
	recalcProgress();
	elem.addEventListener("input", recalcProgress);
});

document.querySelectorAll(`[data-component*=":case-studies-slider:"]`).forEach(root => {
	new Swiper(root, {
		wrapperClass: "case-studies__wrap",
		slideClass: "case-study-card",
		slidesPerView: "auto",
		spaceBetween: 30,
	});
});
document.querySelectorAll(`[data-component*=":trusted-by-slider:"]`).forEach(root => {
		console.log(root);
	new Swiper(root, {
		wrapperClass: "trusted-by__list",
		slideClass: "trusted-by__item",
		"modules": [Autoplay],
		"loop": true,
		speed: 4000,
		"autoplay": {
			"delay": 0,
			disableOnInteraction: false,
		},
		"slidesPerView": "auto",
		"freeMode": true,
		spaceBetween: 20,
	});
});