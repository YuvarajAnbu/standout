export function lockPageScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${Math.max(0, scrollbarWidth)}px`;
  document.documentElement.style.overflowY = "hidden";
}

export function unlockPageScroll() {
  document.body.style.paddingRight = "0px";
  document.documentElement.style.overflowY = "scroll";
}
