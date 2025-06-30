import "./styles/index.css";

import { createTimeline } from "animejs";
import { createSignal, createEffect } from "solid-js";

const i1 = document
  .querySelector("#i1")
  .content.cloneNode(true)
  .querySelector("svg");

const i2 = document
  .querySelector("#i2")
  .content.cloneNode(true)
  .querySelector("svg");

const i3 = document
  .querySelector("#i3")
  .content.cloneNode(true)
  .querySelector("svg");

const getScrollH = () => {
  const scrollPosition = window.pageYOffset;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  return scrollPosition / documentHeight;
};

const [h, setH] = createSignal(getScrollH());

const tl1 = createTimeline({
  autoplay: false,
  easing: "linear",
  duration: 200,
  direction: "alternate",
})
  .add("#icon-prelude path", {
    transform: i1.querySelector("g").getAttribute("transform"),
    d: i1.querySelector("path").getAttribute("d"),
  })
  .add("#icon-some-details-1 path", {
    d: i1.querySelector("path").getAttribute("d"),
  });
/* .add("#icon-some-details-2 path", {
    transform: "translate(-201.705583866009924 100)",
  }); */

const tl2 = createTimeline({
  autoplay: false,
  easing: "linear",
  duration: 200,
  direction: "alternate",
}).add("#icon-some-details-2 path", {
  translate: "75% 100%",
});

window.addEventListener("scroll", () => {
  setH(getScrollH());
});

createEffect(() => {
  tl1.seek(tl1.duration * h());
  tl2.seek(tl2.duration * h());
});

const form = document.querySelector("#questionnaire");

const _token = "7375761549:AAHiE9l1u4FOPriXmf7Nz9rAlo4M2DQBinU";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");

  if (!name) return;

  const message = `${name}\n${formData.get("alcho-list")}`;

  fetch(`https://api.telegram.org/bot${_token}/getUpdates`)
    .then((res) => res.json())
    .then((res) => [
      ...new Set(res.result.map(({ message }) => message.chat.id)),
    ])
    .then((chatIdList) => {
      chatIdList.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${_token}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });
      });
    });
});
