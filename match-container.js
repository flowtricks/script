/* MIT License

Copyright (c) 2025 Martin Winkler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
(() => {
  const polyfill_key = "bae45330cd3d4e0e96b60d26b57009b5";
  const polyfill = Symbol.for(polyfill_key);
  window[polyfill] =
    window[polyfill] ??
    (() => {
      let count = 0;
      return { createID: () => `${polyfill_key}-${Date.now()}-${count++}` };
    })();
  const createID = window[polyfill].createID;
  class ContainerQueryListEvent extends Event {
    container;
    matches;
    constructor(type) {
      super(type);
    }
  }
  class ContainerQueryList extends EventTarget {
    container;
    matches;
    #context = null;
    constructor(element, containerQueryString, callback) {
      super();
      this.container = containerQueryString;
      const unique_name = "container-query-observer-" + createID();
      const markerAttribute = `data-${unique_name}`;
      element.setAttribute(markerAttribute, "");
      const sentinelProperty = `--${unique_name}`;
      const containerQuerySheet = new CSSStyleSheet();
      const css = `
        @property ${sentinelProperty} {
          syntax: '<custom-ident>';
          inherits: false;
          initial-value: --false;
        }
        @container ${containerQueryString} {
          [${markerAttribute}] {
            ${sentinelProperty}: --true;
          }
        }
      `;
      containerQuerySheet.replaceSync(css);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, containerQuerySheet];
      const style = getComputedStyle(element);
      this.matches = style.getPropertyValue(sentinelProperty) === "--true";

      if (typeof callback === "function") {
        this.#runCallback(callback, this.matches);
        this.addEventListener("change", (e) => {
          this.#runCallback(callback, e.matches);
        });
      }
      this.#startObserving(sentinelProperty, containerQueryString, element);
    }
    #runCallback(callback, match) {
      if (typeof gsap !== "undefined" && typeof gsap.context === "function") {
        if (this.#context) this.#context.revert();
        this.#context = gsap.context(() => {
          callback(match);
        });
      } else {
        callback(match);
      }
    }
    #startObserving(sentinelProperty, containerQueryString, observedElement) {
      const _callback = (values) => {
        if (sentinelProperty in values) {
          const matches = values[sentinelProperty] === "--true";
          this.matches = matches;
          const event = new ContainerQueryListEvent("change");
          event.matches = matches;
          event.container = containerQueryString;
          this.dispatchEvent(event);
        }
      };
      const _previousValues = {};
      observedElement.style.setProperty("transition", `${sentinelProperty} 0.001ms step-start`);
      observedElement.style.setProperty("transition-behavior", "allow-discrete");
      const onTransitionRun = (e) => {
        if (e.target !== observedElement) return;
        const computedStyle = getComputedStyle(observedElement);
        const currentValue = computedStyle.getPropertyValue(sentinelProperty);
        const previousValue = _previousValues[sentinelProperty];
        if (currentValue !== previousValue) {
          _previousValues[sentinelProperty] = currentValue;
          _callback({ [sentinelProperty]: currentValue });
        }
      };
      observedElement.addEventListener("transitionrun", onTransitionRun);
      const computedStyle = getComputedStyle(observedElement);
      const currentValue = computedStyle.getPropertyValue(sentinelProperty);
      _previousValues[sentinelProperty] = currentValue;
    }
  }
  if (!Element.prototype.observeContainer) {
    Element.prototype.observeContainer = function (containerQueryString, callback) {
      return new ContainerQueryList(this, containerQueryString, callback);
    };
  }
})();
