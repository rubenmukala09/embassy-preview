/* Embassy Visual Control Studio
 * Opt-in only: add ?design=1 to any page URL.
 * Client-side adjustments remain local to the current browser.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  if (params.get("design") !== "1") return;

  var tabs = ["Layout", "Size", "Position", "Frame", "Crop", "Color", "Effects", "Typography", "Widget", "Responsive", "Animation", "Accessibility", "Advanced"];
  var selected = null;
  var selecting = false;
  var activeTab = "Layout";
  var scope = "all";
  var undoStack = [];
  var redoStack = [];
  var originals = new WeakMap();
  var responsiveRules = {};
  var idCounter = 0;
  var saveKey = "embassy.visual-control:" + location.pathname;
  var toastTimer = 0;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>\"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char];
    });
  }

  function field(label, property, type, value, options, extra) {
    var attrs = extra || "";
    if (type === "select") {
      return '<label class="vs-field"><span>' + esc(label) + '</span><select data-style="' + esc(property) + '" ' + attrs + '>' + options.map(function (item) {
        var pair = Array.isArray(item) ? item : [item, item];
        return '<option value="' + esc(pair[0]) + '"' + (pair[0] === value ? " selected" : "") + '>' + esc(pair[1]) + '</option>';
      }).join("") + '</select></label>';
    }
    return '<label class="vs-field"><span>' + esc(label) + '</span><input data-style="' + esc(property) + '" type="' + esc(type || "text") + '" value="' + esc(value || "") + '" ' + attrs + '></label>';
  }

  function attrField(label, attribute, type, value, extra) {
    return '<label class="vs-field"><span>' + esc(label) + '</span><input data-attr="' + esc(attribute) + '" type="' + esc(type || "text") + '" value="' + esc(value || "") + '" ' + (extra || "") + '></label>';
  }

  function group(title, content) {
    return '<div class="vs-control-group"><div class="vs-control-group__title">' + esc(title) + '</div>' + content + '</div>';
  }

  function row(content) {
    return '<div class="vs-field-row">' + content + '</div>';
  }

  function panelContents(name) {
    var display = [["", "Auto"], ["block", "Block"], ["inline-block", "Inline block"], ["flex", "Flex"], ["grid", "Grid"], ["none", "Hidden"]];
    var position = [["", "Auto"], ["relative", "Relative"], ["absolute", "Absolute"], ["sticky", "Sticky"], ["fixed", "Fixed"]];
    var align = [["", "Auto"], ["start", "Start"], ["center", "Center"], ["end", "End"], ["stretch", "Stretch"], ["space-between", "Space between"]];
    var fits = [["cover", "Cover"], ["contain", "Contain"], ["fill", "Fill"], ["none", "Natural"], ["scale-down", "Scale down"]];
    var weights = [["300", "Light"], ["400", "Regular"], ["500", "Medium"], ["600", "Semibold"], ["700", "Bold"], ["800", "Extra bold"], ["900", "Black"]];
    var html = "";

    if (name === "Layout") {
      html += group("Display", row(field("Mode", "display", "select", "", display) + field("Gap", "gap", "text", "", null, 'placeholder="16px"')));
      html += group("Alignment", row(field("Align items", "align-items", "select", "", align) + field("Justify", "justify-content", "select", "", align)));
      html += group("Spacing", row(field("Padding", "padding", "text", "", null, 'placeholder="16px 20px"') + field("Margin", "margin", "text", "", null, 'placeholder="0 auto"')));
    } else if (name === "Size") {
      html += group("Dimensions", row(field("Width", "width", "text", "", null, 'placeholder="auto / 320px / 80%"') + field("Height", "height", "text", "", null, 'placeholder="auto / 240px"')) + row(field("Min width", "min-width", "text", "", null, 'placeholder="0"') + field("Max width", "max-width", "text", "", null, 'placeholder="720px"')) + row(field("Min height", "min-height", "text", "", null, 'placeholder="0"') + field("Max height", "max-height", "text", "", null, 'placeholder="none"')));
      html += group("Ratio", row(field("Aspect ratio", "aspect-ratio", "text", "", null, 'placeholder="16 / 9"') + field("Box sizing", "box-sizing", "select", "border-box", [["border-box", "Border box"], ["content-box", "Content box"]])));
    } else if (name === "Position") {
      html += group("Placement", row(field("Position", "position", "select", "", position) + field("Z index", "z-index", "number", "")) + row(field("X / left", "left", "text", "", null, 'placeholder="0px"') + field("Y / top", "top", "text", "", null, 'placeholder="0px"')));
      html += group("Transform", row(field("Translate X", "--vs-translate-x", "text", "", null, 'placeholder="0px"') + field("Translate Y", "--vs-translate-y", "text", "", null, 'placeholder="0px"')) + row(field("Rotation", "--vs-rotate", "text", "", null, 'placeholder="0deg"') + field("Scale", "--vs-scale", "text", "", null, 'placeholder="1"')) + '<button class="vs-ibtn" type="button" data-action="apply-transform">Apply transform</button>');
    } else if (name === "Frame") {
      html += group("Frame", row(field("Radius", "border-radius", "text", "", null, 'placeholder="20px"') + field("Overflow", "overflow", "select", "", [["", "Auto"], ["hidden", "Hidden"], ["visible", "Visible"], ["auto", "Scroll when needed"]])) + row(field("Border width", "border-width", "text", "", null, 'placeholder="1px"') + field("Border style", "border-style", "select", "", [["", "None"], ["solid", "Solid"], ["dashed", "Dashed"], ["double", "Double"]])));
      html += group("Media fit", row(field("Object fit", "object-fit", "select", "cover", fits) + field("Object position", "object-position", "text", "", null, 'placeholder="50% 50%"')));
    } else if (name === "Crop") {
      html += group("Crop mode", row(field("Fit", "object-fit", "select", "cover", fits) + field("Aspect ratio", "aspect-ratio", "text", "", null, 'placeholder="4 / 3"')));
      html += group("Focal point", row(field("Horizontal", "--media-focus-x", "range", "50", null, 'min="0" max="100" step="1" data-unit="%"') + field("Vertical", "--media-focus-y", "range", "50", null, 'min="0" max="100" step="1" data-unit="%"')) + '<p>Move the focal point without distorting or rotating the image.</p>');
    } else if (name === "Color") {
      html += group("Surface", row(field("Background", "background-color", "color", "#ffffff") + field("Text", "color", "color", "#0b2038")) + row(field("Border", "border-color", "color", "#d6dde5") + field("Opacity", "opacity", "range", "100", null, 'min="0" max="100" data-scale=".01"')));
      html += group("Brand tokens", '<button class="vs-ibtn" type="button" data-preset="navy">Royal navy</button> <button class="vs-ibtn" type="button" data-preset="gold">Diplomatic gold</button> <button class="vs-ibtn" type="button" data-preset="glass">Ivory glass</button>');
    } else if (name === "Effects") {
      html += group("Depth", field("Shadow", "box-shadow", "select", "", [["", "None"], ["var(--vs-shadow-sm)", "Soft"], ["var(--vs-shadow-md)", "Elevated"], ["var(--vs-shadow-lg)", "Editorial"], ["0 20px 60px rgba(3,26,51,.28)", "Royal"]]) + row(field("Blur", "--vs-blur", "range", "0", null, 'min="0" max="20" data-unit="px"') + field("Saturation", "--vs-saturation", "range", "100", null, 'min="0" max="180" data-unit="%"')) + '<button class="vs-ibtn" type="button" data-action="apply-filter">Apply image filter</button>');
      html += group("Glass", row(field("Backdrop blur", "backdrop-filter", "text", "", null, 'placeholder="blur(16px)"') + field("Blend mode", "mix-blend-mode", "select", "", [["", "Normal"], ["multiply", "Multiply"], ["screen", "Screen"], ["soft-light", "Soft light"], ["overlay", "Overlay"]])));
    } else if (name === "Typography") {
      html += group("Type", row(field("Size", "font-size", "text", "", null, 'placeholder="18px / clamp(...)"') + field("Weight", "font-weight", "select", "400", weights)) + row(field("Line height", "line-height", "text", "", null, 'placeholder="1.5"') + field("Letter spacing", "letter-spacing", "text", "", null, 'placeholder=".02em"')));
      html += group("Measure", row(field("Text align", "text-align", "select", "", [["", "Auto"], ["left", "Left"], ["center", "Center"], ["right", "Right"], ["justify", "Justify"]]) + field("Max width", "max-width", "text", "", null, 'placeholder="65ch"')));
    } else if (name === "Widget") {
      html += group("Widget behavior", row(field("Overflow", "overflow", "select", "", [["", "Auto"], ["hidden", "Clip"], ["auto", "Scrollable"], ["visible", "Visible"]]) + field("Isolation", "isolation", "select", "isolate", [["auto", "Auto"], ["isolate", "Isolate"]])) + row(field("Cursor", "cursor", "select", "", [["", "Auto"], ["pointer", "Pointer"], ["grab", "Grab"], ["default", "Default"]]) + field("Pointer events", "pointer-events", "select", "", [["", "Auto"], ["auto", "Enabled"], ["none", "Disabled"]])));
      html += group("Component state", attrField("Accessible label", "aria-label", "text", "", 'placeholder="Describe the action"') + '<label class="vs-field--check"><input type="checkbox" data-action="toggle-hidden"> Hide component</label>');
    } else if (name === "Responsive") {
      html += group("Editing scope", '<p>Choose All, Tablet or Mobile in the scope bar. Changes made at Tablet and Mobile become breakpoint-specific overrides.</p>' + '<div class="vs-field-row"><button class="vs-ibtn" type="button" data-scope="all">All</button><button class="vs-ibtn" type="button" data-scope="tablet">Tablet</button><button class="vs-ibtn" type="button" data-scope="mobile">Mobile</button></div>');
      html += group("Device visibility", '<label class="vs-field--check"><input type="checkbox" data-responsive-visible="desktop" checked> Desktop</label><label class="vs-field--check"><input type="checkbox" data-responsive-visible="tablet" checked> Tablet</label><label class="vs-field--check"><input type="checkbox" data-responsive-visible="mobile" checked> Mobile</label>');
      html += group("Responsive sizing", row(field("Width", "width", "text", "", null, 'placeholder="100%"') + field("Padding", "padding", "text", "", null, 'placeholder="16px"')));
    } else if (name === "Animation") {
      html += group("Motion", field("Transition", "transition", "select", "", [["", "None"], ["all .18s ease", "Quick"], ["all .28s cubic-bezier(.2,.8,.2,1)", "Smooth"], ["transform .45s cubic-bezier(.16,1,.3,1)", "Editorial"], ["opacity .25s ease, transform .25s ease", "Fade & move"]]) + row(field("Duration", "animation-duration", "text", "", null, 'placeholder="600ms"') + field("Delay", "animation-delay", "text", "", null, 'placeholder="0ms"')) + '<label class="vs-field--check"><input type="checkbox" data-action="pause-animation"> Pause animation</label>');
      html += group("Safety", '<p>Published motion continues to follow the visitor’s reduced-motion preference.</p>');
    } else if (name === "Accessibility") {
      html += group("Semantics", attrField("ARIA label", "aria-label", "text", "", 'placeholder="Clear accessible name"') + row(attrField("Role", "role", "text", "", 'placeholder="region / button"') + attrField("Tab index", "tabindex", "number", "", 'placeholder="0"')));
      html += group("Image alternative", attrField("Alt text", "alt", "text", "", 'placeholder="Describe the image purpose"') + '<button class="vs-ibtn" type="button" data-action="contrast-check">Check text contrast</button><p data-contrast-result>Choose a text element, then run the contrast check.</p>');
    } else if (name === "Advanced") {
      html += group("Selection", '<label class="vs-field"><span>CSS path</span><textarea data-readout="path" readonly></textarea></label><label class="vs-field"><span>Classes</span><input data-attr="class" type="text" value=""></label>');
      html += group("Output", '<button class="vs-ibtn" type="button" data-action="copy-css">Copy selected CSS</button><button class="vs-ibtn" type="button" data-action="copy-inventory">Copy page inventory</button><p>Saved edits are local browser preferences. Copy CSS when you want to promote an approved adjustment into the site source.</p>');
    }

    return '<section class="vs-panel' + (name === activeTab ? " is-active" : "") + '" data-panel="' + esc(name) + '" role="tabpanel"><h3>' + esc(name) + '</h3>' + html + '</section>';
  }

  function createUI() {
    document.body.classList.add("vs-design-mode", "vs-inspector-open");

    var panel = document.createElement("aside");
    panel.className = "vs-inspector";
    panel.setAttribute("aria-label", "Embassy visual control studio");
    panel.innerHTML =
      '<div class="vs-inspector__head">' +
        '<div class="vs-inspector__brand"><div><span>Embassy design system</span><strong>Visual Control Studio</strong></div><button class="vs-ibtn" type="button" data-action="close" aria-label="Close inspector">Close</button></div>' +
        '<div class="vs-inspector__head-actions"><button class="vs-ibtn vs-ibtn--primary" type="button" data-action="select">Select element</button><button class="vs-ibtn" type="button" data-action="undo" disabled>Undo</button><button class="vs-ibtn" type="button" data-action="redo" disabled>Redo</button></div>' +
      '</div>' +
      '<div class="vs-scope"><span class="vs-scope__dot"></span><span class="vs-scope__path">No element selected</span><select data-action="scope" aria-label="Editing scope"><option value="all">All screens</option><option value="tablet">Tablet ≤ 900</option><option value="mobile">Mobile ≤ 600</option></select></div>' +
      '<div class="vs-tabs" role="tablist">' + tabs.map(function (name) { return '<button class="vs-tab" type="button" role="tab" data-tab="' + esc(name) + '" aria-selected="' + (name === activeTab ? "true" : "false") + '">' + esc(name) + '</button>'; }).join("") + '</div>' +
      '<div class="vs-inspector__body">' + tabs.map(panelContents).join("") + '</div>' +
      '<div class="vs-inspector__foot"><div class="vs-footer-actions"><button class="vs-ibtn" type="button" data-action="reset">Reset selected</button><button class="vs-ibtn vs-ibtn--primary" type="button" data-action="save">Save local draft</button></div></div>';
    document.body.appendChild(panel);

    var launcher = document.createElement("button");
    launcher.className = "vs-launcher";
    launcher.type = "button";
    launcher.textContent = "Design controls";
    launcher.setAttribute("aria-expanded", "true");
    document.body.appendChild(launcher);

    var box = document.createElement("div");
    box.className = "vs-selection-box";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = '<span class="vs-selection-box__label"></span>' + ["nw", "n", "ne", "e", "se", "s", "sw", "w", "move"].map(function (dir) { return '<i class="vs-handle" data-dir="' + dir + '"></i>'; }).join("");
    document.body.appendChild(box);

    var toast = document.createElement("div");
    toast.className = "vs-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    return { panel: panel, launcher: launcher, box: box, toast: toast };
  }

  var ui = createUI();
  var overrideStyle = document.createElement("style");
  overrideStyle.id = "vs-responsive-overrides";
  document.head.appendChild(overrideStyle);

  function notify(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.classList.remove("is-visible"); }, 1900);
  }

  function cssPath(element) {
    if (!element || element === document.body) return "body";
    if (element.id) return "#" + CSS.escape(element.id);
    var parts = [];
    var node = element;
    while (node && node.nodeType === 1 && node !== document.body) {
      var part = node.tagName.toLowerCase();
      var stable = Array.prototype.filter.call(node.classList || [], function (name) { return !/^is-|^vs-/.test(name); }).slice(0, 2);
      if (stable.length) part += "." + stable.map(CSS.escape).join(".");
      var siblings = node.parentElement ? Array.prototype.filter.call(node.parentElement.children, function (child) { return child.tagName === node.tagName; }) : [];
      if (siblings.length > 1) part += ":nth-of-type(" + (siblings.indexOf(node) + 1) + ")";
      parts.unshift(part);
      node = node.parentElement;
      if (parts.length >= 6) break;
    }
    return "body > " + parts.join(" > ");
  }

  function ensureId(element) {
    if (!element.dataset.vsId) {
      idCounter += 1;
      element.dataset.vsId = "vc-" + Date.now().toString(36) + "-" + idCounter;
    }
    return element.dataset.vsId;
  }

  function rememberOriginal(element) {
    if (!originals.has(element)) {
      originals.set(element, {
        style: element.getAttribute("style"),
        aria: element.getAttribute("aria-label"),
        role: element.getAttribute("role"),
        tabindex: element.getAttribute("tabindex"),
        alt: element.getAttribute("alt"),
        hidden: element.hidden,
        className: element.getAttribute("class")
      });
    }
  }

  function takeSnapshot() {
    if (!selected) return null;
    return {
      element: selected,
      style: selected.getAttribute("style"),
      aria: selected.getAttribute("aria-label"),
      role: selected.getAttribute("role"),
      tabindex: selected.getAttribute("tabindex"),
      alt: selected.getAttribute("alt"),
      hidden: selected.hidden,
      className: selected.getAttribute("class"),
      rules: JSON.stringify(responsiveRules)
    };
  }

  function restoreSnapshot(snapshot) {
    if (!snapshot || !snapshot.element) return;
    selectElement(snapshot.element);
    setNullableAttribute(selected, "style", snapshot.style);
    setNullableAttribute(selected, "aria-label", snapshot.aria);
    setNullableAttribute(selected, "role", snapshot.role);
    setNullableAttribute(selected, "tabindex", snapshot.tabindex);
    setNullableAttribute(selected, "alt", snapshot.alt);
    setNullableAttribute(selected, "class", snapshot.className);
    selected.hidden = snapshot.hidden;
    responsiveRules = JSON.parse(snapshot.rules || "{}");
    renderResponsiveRules();
    syncFields();
    updateSelectionBox();
  }

  function setNullableAttribute(element, name, value) {
    if (value == null || value === "") element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  function checkpoint() {
    var snap = takeSnapshot();
    if (!snap) return;
    undoStack.push(snap);
    if (undoStack.length > 80) undoStack.shift();
    redoStack.length = 0;
    updateHistoryButtons();
  }

  function undo() {
    if (!undoStack.length || !selected) return;
    var current = takeSnapshot();
    var previous = undoStack.pop();
    if (current) redoStack.push(current);
    restoreSnapshot(previous);
    updateHistoryButtons();
  }

  function redo() {
    if (!redoStack.length || !selected) return;
    var current = takeSnapshot();
    var next = redoStack.pop();
    if (current) undoStack.push(current);
    restoreSnapshot(next);
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    var undoBtn = ui.panel.querySelector('[data-action="undo"]');
    var redoBtn = ui.panel.querySelector('[data-action="redo"]');
    undoBtn.disabled = !undoStack.length;
    redoBtn.disabled = !redoStack.length;
  }

  function renderResponsiveRules() {
    var tablet = [];
    var mobile = [];
    Object.keys(responsiveRules).forEach(function (id) {
      ["tablet", "mobile"].forEach(function (device) {
        var rules = responsiveRules[id] && responsiveRules[id][device];
        if (!rules) return;
        var declarations = Object.keys(rules).map(function (prop) { return prop + ":" + rules[prop] + " !important"; }).join(";");
        if (declarations) (device === "tablet" ? tablet : mobile).push('[data-vs-id="' + id + '"]{' + declarations + '}');
      });
    });
    overrideStyle.textContent = (tablet.length ? "@media(max-width:900px){" + tablet.join("") + "}" : "") + (mobile.length ? "@media(max-width:600px){" + mobile.join("") + "}" : "");
  }

  function normalizeValue(input) {
    var value = input.value;
    if (input.dataset.scale) value = String(Number(value) * Number(input.dataset.scale));
    if (input.dataset.unit) value += input.dataset.unit;
    return value;
  }

  function applyStyle(property, value) {
    if (!selected) return;
    if (scope === "all") {
      if (value === "") selected.style.removeProperty(property);
      else selected.style.setProperty(property, value);
    } else {
      var id = ensureId(selected);
      responsiveRules[id] = responsiveRules[id] || {};
      responsiveRules[id][scope] = responsiveRules[id][scope] || {};
      if (value === "") delete responsiveRules[id][scope][property];
      else responsiveRules[id][scope][property] = value;
      renderResponsiveRules();
    }
    updateSelectionBox();
  }

  function selectElement(element) {
    if (!element || ui.panel.contains(element) || element === ui.launcher || ui.box.contains(element)) return;
    if (selected) selected.removeAttribute("data-vs-selected");
    selected = element;
    rememberOriginal(selected);
    ensureId(selected);
    selected.dataset.vsSelected = "true";
    ui.panel.querySelector(".vs-scope__path").textContent = cssPath(selected);
    ui.box.classList.add("is-visible");
    syncFields();
    updateSelectionBox();
  }

  function computedValue(property) {
    if (!selected) return "";
    var explicit = selected.style.getPropertyValue(property);
    if (explicit) return explicit.trim();
    return getComputedStyle(selected).getPropertyValue(property).trim();
  }

  function colorToHex(value) {
    var match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
    return "#" + [match[1], match[2], match[3]].map(function (n) { return Number(n).toString(16).padStart(2, "0"); }).join("");
  }

  function syncFields() {
    ui.panel.querySelectorAll("[data-style]").forEach(function (input) {
      if (!selected) { input.disabled = true; return; }
      input.disabled = false;
      var property = input.dataset.style;
      var value = computedValue(property);
      if (input.type === "color") value = colorToHex(value);
      if (input.type === "range") {
        if (input.dataset.scale) value = Math.round(Number(value || 1) / Number(input.dataset.scale));
        else value = parseFloat(value) || Number(input.defaultValue) || 0;
      }
      if (input.tagName === "SELECT") {
        var has = Array.prototype.some.call(input.options, function (option) { return option.value === value; });
        input.value = has ? value : "";
      } else input.value = value;
    });
    ui.panel.querySelectorAll("[data-attr]").forEach(function (input) {
      input.disabled = !selected;
      if (selected) input.value = selected.getAttribute(input.dataset.attr) || "";
    });
    var pathReadout = ui.panel.querySelector('[data-readout="path"]');
    if (pathReadout) pathReadout.value = selected ? cssPath(selected) : "";
    var hiddenToggle = ui.panel.querySelector('[data-action="toggle-hidden"]');
    if (hiddenToggle) hiddenToggle.checked = !!(selected && selected.hidden);
    var pauseToggle = ui.panel.querySelector('[data-action="pause-animation"]');
    if (pauseToggle) pauseToggle.checked = !!(selected && selected.style.animationPlayState === "paused");
  }

  function updateSelectionBox() {
    if (!selected || !document.documentElement.contains(selected)) {
      ui.box.classList.remove("is-visible");
      return;
    }
    var rect = selected.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) { ui.box.classList.remove("is-visible"); return; }
    ui.box.classList.add("is-visible");
    ui.box.style.left = rect.left + "px";
    ui.box.style.top = rect.top + "px";
    ui.box.style.width = rect.width + "px";
    ui.box.style.height = rect.height + "px";
    ui.box.querySelector(".vs-selection-box__label").textContent = selected.tagName.toLowerCase() + " · " + Math.round(rect.width) + " × " + Math.round(rect.height);
  }

  function setTab(name) {
    activeTab = name;
    ui.panel.querySelectorAll("[data-tab]").forEach(function (button) { button.setAttribute("aria-selected", button.dataset.tab === name ? "true" : "false"); });
    ui.panel.querySelectorAll("[data-panel]").forEach(function (panel) { panel.classList.toggle("is-active", panel.dataset.panel === name); });
    syncFields();
  }

  function setScope(nextScope) {
    scope = nextScope;
    ui.panel.querySelector('[data-action="scope"]').value = scope;
    ui.panel.querySelectorAll("[data-scope]").forEach(function (button) { button.classList.toggle("is-active", button.dataset.scope === scope); });
    syncFields();
  }

  function togglePanel(force) {
    var open = typeof force === "boolean" ? force : ui.panel.hidden;
    ui.panel.hidden = !open;
    document.body.classList.toggle("vs-inspector-open", open);
    ui.launcher.setAttribute("aria-expanded", open ? "true" : "false");
    ui.launcher.textContent = open ? "Hide controls" : "Design controls";
    requestAnimationFrame(updateSelectionBox);
  }

  function luminance(rgb) {
    var values = rgb.match(/[\d.]+/g);
    if (!values || values.length < 3) return 0;
    var channels = values.slice(0, 3).map(function (v) {
      var n = Number(v) / 255;
      return n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4);
    });
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  }

  function contrastCheck() {
    if (!selected) return;
    var styles = getComputedStyle(selected);
    var bgNode = selected;
    var bg = styles.backgroundColor;
    while (bgNode.parentElement && (/rgba\([^)]*,\s*0\)/.test(bg) || bg === "transparent")) {
      bgNode = bgNode.parentElement;
      bg = getComputedStyle(bgNode).backgroundColor;
    }
    var l1 = luminance(styles.color);
    var l2 = luminance(bg);
    var ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
    var result = ui.panel.querySelector("[data-contrast-result]");
    result.textContent = "Contrast " + ratio.toFixed(2) + ":1 · " + (ratio >= 4.5 ? "AA pass for normal text" : ratio >= 3 ? "Pass for large text only" : "Needs stronger contrast");
  }

  function inventoryText() {
    return [
      "Embassy page visual inventory",
      "Route: " + location.pathname,
      "Images: " + document.images.length,
      "Links: " + document.links.length,
      "Buttons: " + document.querySelectorAll("button, [role=button], .btn").length,
      "Form controls: " + document.querySelectorAll("input, select, textarea").length,
      "Cards/widgets: " + document.querySelectorAll(".card, .tile, .stat, .ncard, [class*=widget]").length,
      "Headings: " + document.querySelectorAll("h1, h2, h3, h4, h5, h6").length
    ].join("\n");
  }

  function copyText(text, success) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { notify(success); });
    else {
      var area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      notify(success);
    }
  }

  function saveDraft() {
    var items = [];
    document.querySelectorAll("[data-vs-id]").forEach(function (element) {
      if (ui.panel.contains(element) || ui.box.contains(element)) return;
      items.push({
        path: cssPath(element),
        style: element.getAttribute("style"),
        aria: element.getAttribute("aria-label"),
        role: element.getAttribute("role"),
        tabindex: element.getAttribute("tabindex"),
        alt: element.getAttribute("alt"),
        hidden: element.hidden,
        id: element.dataset.vsId
      });
    });
    localStorage.setItem(saveKey, JSON.stringify({ items: items, responsiveRules: responsiveRules }));
    notify("Local design draft saved");
  }

  function loadDraft() {
    var raw = localStorage.getItem(saveKey);
    if (!raw) return;
    try {
      var draft = JSON.parse(raw);
      (draft.items || []).forEach(function (item) {
        var element = document.querySelector(item.path);
        if (!element || ui.panel.contains(element)) return;
        element.dataset.vsId = item.id;
        setNullableAttribute(element, "style", item.style);
        setNullableAttribute(element, "aria-label", item.aria);
        setNullableAttribute(element, "role", item.role);
        setNullableAttribute(element, "tabindex", item.tabindex);
        setNullableAttribute(element, "alt", item.alt);
        element.hidden = !!item.hidden;
      });
      responsiveRules = draft.responsiveRules || {};
      renderResponsiveRules();
      notify("Local design draft restored");
    } catch (error) {
      console.warn("Visual Control Studio could not restore its local draft.", error);
    }
  }

  function resetSelected() {
    if (!selected) return;
    checkpoint();
    var original = originals.get(selected);
    if (original) {
      setNullableAttribute(selected, "style", original.style);
      setNullableAttribute(selected, "aria-label", original.aria);
      setNullableAttribute(selected, "role", original.role);
      setNullableAttribute(selected, "tabindex", original.tabindex);
      setNullableAttribute(selected, "alt", original.alt);
      setNullableAttribute(selected, "class", original.className);
      selected.hidden = original.hidden;
    } else selected.removeAttribute("style");
    var id = selected.dataset.vsId;
    if (id) delete responsiveRules[id];
    renderResponsiveRules();
    syncFields();
    updateSelectionBox();
    notify("Selected element reset");
  }

  function applyPreset(name) {
    if (!selected) return;
    checkpoint();
    if (name === "navy") {
      applyStyle("background-color", "var(--vs-navy-900)");
      applyStyle("color", "#ffffff");
      applyStyle("border-color", "rgba(255,229,108,.32)");
    } else if (name === "gold") {
      applyStyle("background-color", "var(--vs-gold-500)");
      applyStyle("color", "var(--vs-navy-950)");
      applyStyle("border-color", "rgba(3,26,51,.18)");
    } else if (name === "glass") {
      applyStyle("background-color", "rgba(255,255,255,.72)");
      applyStyle("color", "var(--vs-ink)");
      applyStyle("backdrop-filter", "blur(16px) saturate(1.08)");
    }
    syncFields();
  }

  ui.panel.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-tab]");
    if (tab) { setTab(tab.dataset.tab); return; }
    var preset = event.target.closest("[data-preset]");
    if (preset) { applyPreset(preset.dataset.preset); return; }
    var scopeButton = event.target.closest("[data-scope]");
    if (scopeButton) { setScope(scopeButton.dataset.scope); return; }
    var action = event.target.closest("[data-action]");
    if (!action) return;
    var name = action.dataset.action;
    if (name === "close") togglePanel(false);
    else if (name === "select") {
      selecting = !selecting;
      document.body.classList.toggle("vs-selecting", selecting);
      action.classList.toggle("is-active", selecting);
      action.textContent = selecting ? "Click a page element" : "Select element";
    } else if (name === "undo") undo();
    else if (name === "redo") redo();
    else if (name === "reset") resetSelected();
    else if (name === "save") saveDraft();
    else if (name === "apply-transform" && selected) {
      checkpoint();
      var tx = selected.style.getPropertyValue("--vs-translate-x") || "0px";
      var ty = selected.style.getPropertyValue("--vs-translate-y") || "0px";
      var rotate = selected.style.getPropertyValue("--vs-rotate") || "0deg";
      var scale = selected.style.getPropertyValue("--vs-scale") || "1";
      applyStyle("transform", "translate(" + tx + "," + ty + ") rotate(" + rotate + ") scale(" + scale + ")");
    } else if (name === "apply-filter" && selected) {
      checkpoint();
      var blur = selected.style.getPropertyValue("--vs-blur") || "0px";
      var saturation = selected.style.getPropertyValue("--vs-saturation") || "100%";
      applyStyle("filter", "blur(" + blur + ") saturate(" + saturation + ")");
    } else if (name === "toggle-hidden" && selected) {
      checkpoint(); selected.hidden = action.checked; updateSelectionBox();
    } else if (name === "pause-animation" && selected) {
      checkpoint(); selected.style.animationPlayState = action.checked ? "paused" : "";
    } else if (name === "contrast-check") contrastCheck();
    else if (name === "copy-css" && selected) {
      var css = cssPath(selected) + " {\n  " + selected.style.cssText.split(";").filter(Boolean).join(";\n  ") + ";\n}";
      copyText(css, "Selected CSS copied");
    } else if (name === "copy-inventory") copyText(inventoryText(), "Page inventory copied");
  });

  ui.panel.addEventListener("change", function (event) {
    var input = event.target;
    if (input.dataset.action === "scope") { setScope(input.value); return; }
    if (input.dataset.style && selected) {
      checkpoint();
      applyStyle(input.dataset.style, normalizeValue(input));
      syncFields();
    } else if (input.dataset.attr && selected) {
      checkpoint();
      setNullableAttribute(selected, input.dataset.attr, input.value);
      updateSelectionBox();
    } else if (input.dataset.responsiveVisible && selected) {
      checkpoint();
      var device = input.dataset.responsiveVisible;
      var priorScope = scope;
      setScope(device === "desktop" ? "all" : device);
      applyStyle("display", input.checked ? "" : "none");
      setScope(priorScope);
    }
  });

  ui.panel.addEventListener("input", function (event) {
    var input = event.target;
    if (!input.dataset.style || input.type !== "range" || !selected) return;
    applyStyle(input.dataset.style, normalizeValue(input));
    updateSelectionBox();
  });

  ui.launcher.addEventListener("click", function () { togglePanel(); });

  document.addEventListener("click", function (event) {
    if (!selecting || ui.panel.contains(event.target) || event.target === ui.launcher || ui.box.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    selectElement(event.target);
    selecting = false;
    document.body.classList.remove("vs-selecting");
    var button = ui.panel.querySelector('[data-action="select"]');
    button.classList.remove("is-active");
    button.textContent = "Select element";
  }, true);

  ui.box.addEventListener("pointerdown", function (event) {
    var handle = event.target.closest("[data-dir]");
    if (!handle || !selected) return;
    event.preventDefault();
    checkpoint();
    var dir = handle.dataset.dir;
    var rect = selected.getBoundingClientRect();
    var startX = event.clientX;
    var startY = event.clientY;
    var startLeft = parseFloat(getComputedStyle(selected).left) || 0;
    var startTop = parseFloat(getComputedStyle(selected).top) || 0;
    if (getComputedStyle(selected).position === "static") selected.style.position = "relative";

    function move(moveEvent) {
      var dx = moveEvent.clientX - startX;
      var dy = moveEvent.clientY - startY;
      if (dir === "move") {
        selected.style.left = startLeft + dx + "px";
        selected.style.top = startTop + dy + "px";
      } else {
        if (/[ew]/.test(dir)) {
          var width = /w/.test(dir) ? rect.width - dx : rect.width + dx;
          selected.style.width = Math.max(24, width) + "px";
          if (/w/.test(dir)) selected.style.left = startLeft + dx + "px";
        }
        if (/[ns]/.test(dir)) {
          var height = /n/.test(dir) ? rect.height - dy : rect.height + dy;
          selected.style.height = Math.max(24, height) + "px";
          if (/n/.test(dir)) selected.style.top = startTop + dy + "px";
        }
      }
      updateSelectionBox();
    }

    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      syncFields();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  });

  var ticking = false;
  function requestBoxUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; updateSelectionBox(); });
  }
  window.addEventListener("resize", requestBoxUpdate, { passive: true });
  window.addEventListener("scroll", requestBoxUpdate, { passive: true, capture: true });

  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key.toLowerCase() === "d") { event.preventDefault(); togglePanel(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
    }
    if (event.key === "Escape" && selecting) {
      selecting = false;
      document.body.classList.remove("vs-selecting");
      var button = ui.panel.querySelector('[data-action="select"]');
      button.classList.remove("is-active");
      button.textContent = "Select element";
    }
  });

  loadDraft();
  setScope("all");
  syncFields();
  notify("Visual Control Studio ready · Alt+D toggles controls");
})();
