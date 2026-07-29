const scriptPromises = new Map();

export function loadScript(src) {
  if (scriptPromises.has(src)) return scriptPromises.get(src);

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing?.dataset.loaded === "true") {
    return Promise.resolve(existing);
  }

  const promise = new Promise((resolve, reject) => {
    const script = existing || document.createElement("script");

    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve(script);
    };
    const handleError = () => {
      scriptPromises.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  scriptPromises.set(src, promise);
  return promise;
}

export const loadScripts = (sources) => Promise.all(sources.map(loadScript));
