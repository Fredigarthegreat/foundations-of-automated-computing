function resize () {
  const wrapper = document.getElementById("wrapper")
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080,
  );
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", resize);
resize();
