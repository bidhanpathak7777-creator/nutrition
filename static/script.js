/* ============================================================
   Know Your Nutrition — Full Script
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ===== ORIGINAL BEHAVIOUR ===== */

    const searchInput = document.querySelector('.search-box input[name="food"]');
    const searchForm = document.querySelector(".search-box");

    if (searchInput) searchInput.focus();

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            const food = searchInput.value.trim();
            if (food === "") {
                event.preventDefault();
                searchForm.classList.add("shake");
                searchForm.addEventListener("animationend", function () {
                    searchForm.classList.remove("shake");
                }, { once: true });
                alert("Please enter a food name.");
            }
        });
    }

    /* ===== ANIMATIONS ===== */

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (calm) return;

    /* --- scroll progress + navbar shadow --- */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const nav = document.querySelector(".navbar");

    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
        if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* --- count-up --- */
    function countUp(el) {
        const node = Array.prototype.find.call(el.childNodes, function (n) {
            return n.nodeType === 3 && /\d/.test(n.textContent);
        });
        if (!node) return;
        const original = node.textContent;
        const m = original.match(/\d+(\.\d+)?/);
        if (!m) return;
        const target = parseFloat(m[0]);
        const decimals = (m[1] || "").length ? m[1].length - 1 : 0;
        const pre = original.slice(0, m.index);
        const post = original.slice(m.index + m[0].length);
        const start = performance.now(), dur = 1400;

        (function tick(now) {
            const t = Math.min((now - start) / dur, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            node.textContent = t === 1 ? original : pre + (target * eased).toFixed(decimals) + post;
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }

    window.kynCountUp = countUp;

    /* --- scroll reveal --- */
    const revealTargets = document.querySelectorAll(
        ".section-heading, .about-container > *, .feature-card, .result-header, " +
        ".result-card, .data-box, .back-link, .search-again, .footer-container"
    );

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add("in");
            const num = el.matches(".result-card") ? el.querySelector(".result-value") : null;
            if (num) setTimeout(function () { countUp(num); }, 250);
            io.unobserve(el);
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
        const siblings = Array.prototype.filter.call(el.parentNode.children, function (s) {
            return s.matches(".feature-card, .result-card");
        });
        const i = siblings.indexOf(el);
        el.style.setProperty("--d", (i > -1 ? i * 100 : 0) + "ms");
        el.classList.add("reveal");
        io.observe(el);
    });

    /* hero calorie count-up */
    const heroCal = document.querySelector(".calorie-number");
    if (heroCal) setTimeout(function () { countUp(heroCal); }, 500);

    /* --- ripple on buttons --- */
    document.querySelectorAll(".search-box button, .search-again-button").forEach(function (btn) {
        btn.addEventListener("pointerdown", function (e) {
            const r = btn.getBoundingClientRect();
            const dot = document.createElement("span");
            dot.className = "ripple";
            dot.style.left = e.clientX - r.left + "px";
            dot.style.top = e.clientY - r.top + "px";
            btn.appendChild(dot);
            setTimeout(function () { dot.remove(); }, 700);
        });

        if (!canHover) return;
        btn.addEventListener("pointermove", function (e) {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.translate = x * 0.2 + "px " + y * 0.3 + "px";
        });
        btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });

    /* --- typing placeholder --- */
    if (searchInput) {
        const foods = ["banana", "oats", "salmon", "avocado", "paneer", "almonds", "mango"];
        let f = 0, c = 0, deleting = false;

        (function type() {
            let wait = deleting ? 45 : 95;
            if (searchInput.value === "") {
                const word = foods[f];
                c += deleting ? -1 : 1;
                searchInput.placeholder = "Try " + word.slice(0, c);
                if (!deleting && c === word.length) { deleting = true; wait = 1400; }
                else if (deleting && c === 0) { deleting = false; f = (f + 1) % foods.length; wait = 350; }
            }
            setTimeout(type, wait);
        })();
    }

    if (!canHover) return;

    /* --- cursor glow --- */
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let tx = -500, ty = -500, gx = tx, gy = ty;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });

    (function follow() {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = "translate(" + gx + "px," + gy + "px)";
        requestAnimationFrame(follow);
    })();

    /* --- hero 3D card --- */
    const heroVisual = document.querySelector(".hero-visual");
    const heroCard = document.querySelector(".nutrition-preview");

    if (heroVisual && heroCard) {
        heroVisual.addEventListener("pointermove", function (e) {
            const r = heroVisual.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            heroCard.style.setProperty("--ry", (-14 + x * 22).toFixed(2) + "deg");
            heroCard.style.setProperty("--rx", (7 - y * 18).toFixed(2) + "deg");
            heroVisual.style.setProperty("--px", (x * 2).toFixed(3));
            heroVisual.style.setProperty("--py", (y * 2).toFixed(3));
        });
        heroVisual.addEventListener("pointerleave", function () {
            heroCard.style.removeProperty("--rx");
            heroCard.style.removeProperty("--ry");
            heroVisual.style.removeProperty("--px");
            heroVisual.style.removeProperty("--py");
        });
    }

    /* --- tilt on feature / result cards --- */
    document.querySelectorAll(".feature-card, .result-card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
            card.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", function () {
            card.style.removeProperty("--rx");
            card.style.removeProperty("--ry");
        });
    });

});


/* ============================================================
   Template-specific animations (home + results)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const countUp = window.kynCountUp || function () {};

    /* hero preview card cycles through foods */
    const card = document.querySelector(".nutrition-preview");

    if (card) {
        const foods = [
            { n: "Apple",      e: "🍎", k: 52,  v: ["0.3g", "13.8g", "2.4g"], w: [12, 46, 30] },
            { n: "Banana",     e: "🍌", k: 89,  v: ["1.1g", "22.8g", "2.6g"], w: [22, 76, 33] },
            { n: "Avocado",    e: "🥑", k: 160, v: ["2g", "8.5g", "6.7g"],     w: [30, 30, 84] },
            { n: "Strawberry", e: "🍓", k: 32,  v: ["0.7g", "7.7g", "2g"],     w: [14, 26, 26] }
        ];
        const name = card.querySelector("h2");
        const icon = card.querySelector(".preview-icon");
        const cal = card.querySelector(".calorie-number");
        const vals = card.querySelectorAll(".nutrient-row strong");
        const fills = card.querySelectorAll(".bar-fill");
        let i = 0, paused = false;

        card.addEventListener("pointerenter", function () { paused = true; });
        card.addEventListener("pointerleave", function () { paused = false; });

        function show(f) {
            name.textContent = f.n;
            icon.textContent = f.e;
            const node = Array.prototype.find.call(cal.childNodes, function (n) {
                return n.nodeType === 3 && /\d/.test(n.textContent);
            });
            if (node) node.textContent = "\n" + f.k + "\n";
            vals.forEach(function (el, j) { el.textContent = f.v[j]; });
            fills.forEach(function (el, j) { el.style.width = f.w[j] + "%"; });
            countUp(cal);
        }

        setInterval(function () {
            if (paused || document.hidden) return;
            i = (i + 1) % foods.length;
            card.classList.add("swapping");
            setTimeout(function () { show(foods[i]); }, 250);
            setTimeout(function () { card.classList.remove("swapping"); }, 600);
        }, 4800);
    }

    /* results page: emoji match */
    const title = document.querySelector(".result-header h1");
    const bigIcon = document.querySelector(".result-food-icon");

    if (title && bigIcon) {
        const map = [
            ["apple","🍎"],["banana","🍌"],["orange","🍊"],["lemon","🍋"],["mango","🥭"],["pineapple","🍍"],
            ["strawberr","🍓"],["blueberr","🫐"],["grape","🍇"],["watermelon","🍉"],["peach","🍑"],["pear","🍐"],
            ["cherr","🍒"],["coconut","🥥"],["kiwi","🥝"],["avocado","🥑"],["tomato","🍅"],["potato","🥔"],
            ["carrot","🥕"],["corn","🌽"],["broccoli","🥦"],["spinach","🥬"],["cucumber","🥒"],["onion","🧅"],
            ["garlic","🧄"],["mushroom","🍄"],["pepper","🌶️"],["peanut","🥜"],["almond","🥜"],["bread","🍞"],
            ["rice","🍚"],["pasta","🍝"],["noodle","🍜"],["egg","🥚"],["cheese","🧀"],["milk","🥛"],["butter","🧈"],
            ["chicken","🍗"],["beef","🥩"],["steak","🥩"],["pork","🥓"],["bacon","🥓"],["fish","🐟"],["salmon","🐟"],
            ["shrimp","🍤"],["honey","🍯"],["chocolate","🍫"],["cookie","🍪"],["cake","🍰"],["pizza","🍕"],
            ["burger","🍔"],["fries","🍟"],["salad","🥗"],["soup","🍲"],["yogurt","🥛"],["oat","🥣"]
        ];
        const t = title.textContent.toLowerCase();
        const hit = map.find(function (m) { return t.indexOf(m[0]) !== -1; });
        if (hit) bigIcon.textContent = hit[1];
    }
});


/* ============================================================
   ADVANCED MOTION
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector(".hero");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* --- headline: split into letters --- */
    const h1 = document.querySelector(".hero h1");
    if (h1) {
        const tn = Array.prototype.find.call(h1.childNodes, function (n) {
            return n.nodeType === 3 && n.textContent.trim();
        });
        if (tn) {
            const frag = document.createDocumentFragment();
            let i = 0;
            h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
            tn.textContent.trim().split(" ").forEach(function (w, wi) {
                if (wi) frag.appendChild(document.createTextNode(" "));
                const word = document.createElement("span");
                word.className = "word";
                word.setAttribute("aria-hidden", "true");
                w.split("").forEach(function (c) {
                    const ch = document.createElement("span");
                    ch.className = "ch";
                    ch.textContent = c;
                    ch.style.setProperty("--i", i++);
                    word.appendChild(ch);
                });
                frag.appendChild(word);
            });
            tn.replaceWith(frag);
        }
    }

    /* --- hero decorative blobs --- */
    if (hero && !hero.querySelector(".hero-blob")) {
        const blobs = [
            { w: 520, h: 520, r: "4%", t: "6%",  c: "radial-gradient(circle, rgba(110, 200, 130, 0.35), transparent 65%)" },
            { w: 420, h: 420, l: "8%",  b: "10%", c: "radial-gradient(circle, rgba(213, 161, 60, 0.22), transparent 65%)" },
            { w: 380, h: 380, r: "30%", b: "-5%", c: "radial-gradient(circle, rgba(76, 175, 105, 0.28), transparent 65%)" }
        ];
        blobs.forEach(function (b) {
            const el = document.createElement("div");
            el.className = "hero-blob";
            el.style.width = b.w + "px";
            el.style.height = b.h + "px";
            el.style.background = b.c;
            if (b.r) el.style.right = b.r;
            if (b.l) el.style.left = b.l;
            if (b.t) el.style.top = b.t;
            if (b.b) el.style.bottom = b.b;
            hero.appendChild(el);
        });
    }

    /* --- particle field --- */
    if (hero) {
        const cv = document.createElement("canvas");
        cv.className = "hero-canvas";
        hero.prepend(cv);
        const ctx = cv.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cols = ["76,175,105", "140,193,82", "213,161,60", "47,158,87"];
        const mouse = { x: -999, y: -999 };
        let W, H, P = [], run = true;

        function size() {
            W = hero.clientWidth; H = hero.clientHeight;
            cv.width = W * dpr; cv.height = H * dpr;
            cv.style.width = W + "px"; cv.style.height = H + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            P = Array.from({ length: Math.min(70, Math.round(W * H / 20000)) }, function () {
                return { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, r: 2 + Math.random() * 4,
                         c: cols[Math.random() * cols.length | 0], ph: Math.random() * 6.28 };
            });
        }
        size();
        window.addEventListener("resize", size);
        hero.addEventListener("pointermove", function (e) {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        });
        hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
        new IntersectionObserver(function (es) { run = es[0].isIntersecting; }).observe(hero);

        (function frame(t) {
            requestAnimationFrame(frame);
            if (!run || document.hidden) return;
            ctx.clearRect(0, 0, W, H);
            P.forEach(function (p) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy) || 1;
                if (d < 160) { const f = (160 - d) / 160; p.vx += dx / d * f * 0.12; p.vy += dy / d * f * 0.12; }
                p.vx = p.vx * 0.97 + Math.sin(t / 2200 + p.ph) * 0.01;
                p.vy = p.vy * 0.97 + Math.cos(t / 2600 + p.ph) * 0.01 - 0.004;
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
            });
            for (let a = 0; a < P.length; a++) {
                for (let b = a + 1; b < P.length; b++) {
                    const d = Math.hypot(P[a].x - P[b].x, P[a].y - P[b].y);
                    if (d < 120) {
                        ctx.strokeStyle = "rgba(76,175,105," + (0.22 * (1 - d / 120)) + ")";
                        ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke();
                    }
                }
            }
            P.forEach(function (p) {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                g.addColorStop(0, "rgba(" + p.c + ",0.55)");
                g.addColorStop(1, "rgba(" + p.c + ",0)");
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill();
            });
        })(0);
    }

    /* --- food ticker --- */
    const nutri = document.querySelector(".nutrition-section");
    if (nutri) {
        const items = ["🍎 Apple","🥑 Avocado","🍌 Banana","🥦 Broccoli","🍚 Rice","🥚 Egg","🍗 Chicken","🐟 Salmon","🥕 Carrot","🥭 Mango","🍓 Strawberry","🥜 Almonds"];
        const row = items.map(function (t) { return "<span>" + t + "</span>"; }).join("");
        const ticker = document.createElement("div");
        ticker.className = "ticker";
        ticker.setAttribute("aria-hidden", "true");
        ticker.innerHTML = '<div class="ticker-track">' + row + row + "</div>";
        nutri.before(ticker);
    }

    /* --- cursor-following glare --- */
    document.querySelectorAll(
        ".nutrition-preview, .feature-card, .result-card, .result-header, .macro-panel"
    ).forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
            el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        });
    });

    /* --- page transitions --- */
    const wipe = document.createElement("div");
    wipe.className = "page-wipe enter";
    document.body.appendChild(wipe);
    wipe.addEventListener("animationend", function () { wipe.classList.remove("enter"); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) wipe.className = "page-wipe"; });

    function leave(x, y, go) {
        wipe.style.setProperty("--wx", x + "px");
        wipe.style.setProperty("--wy", y + "px");
        wipe.classList.remove("enter");
        wipe.classList.add("go");
        setTimeout(go, 540);
    }

    document.addEventListener("click", function (e) {
        const a = e.target.closest("a[href]");
        if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
        const u = new URL(a.href, location.href);
        if (u.origin !== location.origin) return;
        if (u.pathname === location.pathname && u.search === location.search && u.hash) return;
        e.preventDefault();
        leave(e.clientX, e.clientY, function () { location.href = a.href; });
    });

    const form = document.querySelector("form.search-box");
    if (form) {
        form.addEventListener("submit", function (e) {
            if (e.defaultPrevented) return;
            e.preventDefault();
            const b = form.getBoundingClientRect();
            leave(b.right - 60, b.top + b.height / 2, function () { form.submit(); });
        });
    }

    /* --- results page: daily-value + donut --- */
    const cards = Array.prototype.slice.call(document.querySelectorAll(".result-card"));
    if (!cards.length) return;

    function valueOf(title) {
        const c = cards.find(function (c) {
            return c.querySelector(".result-card-title").textContent.trim().toLowerCase() === title;
        });
        const m = c && c.querySelector(".result-value").textContent.match(/\d+(\.\d+)?/);
        return { card: c, v: m ? parseFloat(m[0]) : null };
    }

    const DV = { "energy": 2000, "protein": 50, "carbohydrates": 275, "fiber": 28, "total fat": 78 };
    Object.keys(DV).forEach(function (k) {
        const r = valueOf(k);
        if (r.v === null) return;
        const pct = Math.round(r.v / DV[k] * 100);
        r.card.insertAdjacentHTML("beforeend",
            '<div class="dv"><div class="dv-bar"><i style="--w:' + Math.min(100, pct) + '%"></i></div><small>' + pct + "% of daily value</small></div>");
    });

    const p = valueOf("protein").v, c = valueOf("carbohydrates").v, f = valueOf("total fat").v;
    const dataBox = document.querySelector(".data-box");

    if (dataBox && p !== null && c !== null && f !== null && p + c + f > 0) {
        const kcal = [p * 4, c * 4, f * 9];
        const total = kcal[0] + kcal[1] + kcal[2];
        const pc = kcal.map(function (k) { return k / total * 100; });
        const names = ["Protein", "Carbohydrates", "Fat"];
        const colors = ["#3f9858", "#d5a13c", "#4a90a4"];
        const grams = [p, c, f];
        let acc = 0;

        const arcs = pc.map(function (v, i) {
            const s = '<circle class="arc" r="15.9155" cx="21" cy="21" stroke="' + colors[i] + '" stroke-dashoffset="-' + acc +
                      '" style="--p:' + Math.max(v - 0.6, 0).toFixed(2) + ";--k:" + i + '" transform="rotate(-90 21 21)"/>';
            acc += v;
            return s;
        }).join("");

        const top = pc.indexOf(Math.max.apply(null, pc));
        const legend = names.map(function (n, i) {
            return '<div class="legend-row" style="--c:' + colors[i] + '"><i></i>' + n + " · " + grams[i] + 'g<b>' + Math.round(pc[i]) + "%</b></div>";
        }).join("");

        const panel = document.createElement("section");
        panel.className = "macro-panel reveal";
        panel.innerHTML =
            '<div class="donut"><svg viewBox="0 0 42 42"><circle class="track" r="15.9155" cx="21" cy="21"/>' + arcs +
            '</svg><div class="donut-center"><b>' + Math.round(pc[top]) + "%</b><span>from " + names[top].toLowerCase() + "</span></div></div>" +
            '<div class="macro-info"><h2>Where the calories come from</h2>' + legend +
            "<small>Estimated at 4 kcal per gram of protein and carbohydrates and 9 per gram of fat. Daily values assume a 2,000 calorie diet.</small></div>";
        dataBox.before(panel);

        new IntersectionObserver(function (es, o) {
            if (es[0].isIntersecting) { panel.classList.add("in"); o.disconnect(); }
        }, { threshold: 0.25 }).observe(panel);
    }

    /* --- hero split parallax (mouse) --- */
    const heroContent = document.querySelector(".hero-content");
    const heroVisualEl = document.querySelector(".hero-visual");

    if (hero && heroContent && heroVisualEl && canHover) {
        let rx = 0, ry = 0, txr = 0, tyr = 0;
        hero.addEventListener("pointermove", function (e) {
            const r = hero.getBoundingClientRect();
            txr = ((e.clientX - r.left) / r.width - 0.5) * 6;
            tyr = -((e.clientY - r.top) / r.height - 0.5) * 4;
        });
        hero.addEventListener("pointerleave", function () { txr = 0; tyr = 0; });

        (function loop() {
            rx += (txr - rx) * 0.06;
            ry += (tyr - ry) * 0.06;
            heroContent.style.transform =
                "translate3d(" + (rx * 0.4).toFixed(2) + "px," +
                (ry * 0.4).toFixed(2) + "px, 0)";
            heroVisualEl.style.transform =
                "translate3d(" + (-rx * 0.8).toFixed(2) + "px," +
                (-ry * 0.8).toFixed(2) + "px, 0)";
            requestAnimationFrame(loop);
        })();
    }

    /* --- floating orbs in hero visual --- */
    if (heroVisualEl && !heroVisualEl.querySelector(".orb")) {
        ["orb-1", "orb-2", "orb-3", "orb-4"].forEach(function (cls) {
            const o = document.createElement("div");
            o.className = "orb " + cls;
            o.setAttribute("aria-hidden", "true");
            heroVisualEl.appendChild(o);
        });
    }

    /* --- 3D tilt on search box --- */
    if (canHover) {
        document.querySelectorAll(".search-box").forEach(function (box) {
            box.addEventListener("pointermove", function (e) {
                const r = box.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                box.style.transform =
                    "rotateX(" + (-y * 6).toFixed(2) + "deg) " +
                    "rotateY(" + (x * 6).toFixed(2) + "deg) " +
                    "translateY(-2px)";
            });
            box.addEventListener("pointerleave", function () {
                box.style.transform = "";
            });
        });
    }

    /* --- macro donut cursor tilt --- */
    const macroPanel = document.querySelector(".macro-panel");
    const donut = document.querySelector(".donut");

    if (macroPanel && donut && canHover) {
        macroPanel.addEventListener("pointermove", function (e) {
            const r = macroPanel.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            donut.style.animation = "none";
            donut.style.transform =
                "rotateY(" + (x * 22).toFixed(2) + "deg) " +
                "rotateX(" + (-y * 18).toFixed(2) + "deg) " +
                "translateZ(30px)";
        });
        macroPanel.addEventListener("pointerleave", function () {
            donut.style.transform = "";
            donut.style.animation = "";
        });
    }

    /* --- magnetic nav links --- */
    if (canHover) {
        document.querySelectorAll(".nav-links a, .logo").forEach(function (el) {
            el.addEventListener("pointermove", function (e) {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) / r.width;
                const y = (e.clientY - r.top - r.height / 2) / r.height;
                el.style.transform =
                    "translate(" + (x * 8).toFixed(2) + "px," +
                    (y * 6).toFixed(2) + "px)";
            });
            el.addEventListener("pointerleave", function () {
                el.style.transform = "";
            });
        });
    }

    /* --- result grid magnetic cluster --- */
    const grid = document.querySelector(".result-grid");
    if (grid && canHover) {
        grid.addEventListener("pointermove", function (e) {
            grid.querySelectorAll(".result-card").forEach(function (c) {
                const r = c.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const d = Math.hypot(e.clientX - cx, e.clientY - cy);
                const max = 320;
                if (d < max) {
                    const f = 1 - d / max;
                    c.style.setProperty("--lift", (-f * 12).toFixed(2) + "px");
                    c.style.setProperty("--rx", ((cy - e.clientY) / 40).toFixed(2) + "deg");
                    c.style.setProperty("--ry", ((e.clientX - cx) / 40).toFixed(2) + "deg");
                } else {
                    c.style.removeProperty("--lift");
                    c.style.removeProperty("--rx");
                    c.style.removeProperty("--ry");
                }
            });
        });
        grid.addEventListener("pointerleave", function () {
            grid.querySelectorAll(".result-card").forEach(function (c) {
                c.style.removeProperty("--lift");
                c.style.removeProperty("--rx");
                c.style.removeProperty("--ry");
            });
        });
    }

});


/* ============================================================
   REAL 3D: Three.js scroll showcase
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anchor = document.querySelector(".nutrition-section");
    if (!anchor || !document.querySelector(".hero")) return;

    function loadThree(ok, fail) {
        if (window.THREE) return ok();
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s.onload = ok; s.onerror = fail;
        document.head.appendChild(s);
    }

    loadThree(build, function () { /* offline: page keeps the rest of the design */ });

    function build() {
        const data = [
            ["52", "kcal", "Energy", "Every 100 g of apple, mostly from natural sugars.", "#ffb74a"],
            ["2.4", "g", "Fiber", "Much of it sits in the skin, so eat it unpeeled.", "#6fdc8c"],
            ["13.8", "g", "Carbohydrates", "Where nearly all of an apple's energy comes from.", "#f2c14e"],
            ["0.3", "g", "Protein", "Almost none. An apple is about 86% water.", "#5ec8d8"]
        ];

        const sec = document.createElement("section");
        sec.className = "tour";
        sec.setAttribute("aria-label", "Interactive 3D apple nutrition tour");
        sec.innerHTML =
            '<div class="tour-sticky"><canvas class="tour-canvas"></canvas>' +
            '<div class="tour-copy"><h2 class="tour-title on">Scroll to take<br>an <em>apple</em> apart.</h2>' +
            data.map(function (d) {
                return '<div class="tour-step" style="--ac:' + d[4] + '"><b>' + d[0] + "<small>" + d[1] + "</small></b><h3>" + d[2] + "</h3><p>" + d[3] + "</p></div>";
            }).join("") + '</div><div class="tour-dots"><i></i><i></i><i></i><i></i></div></div>';

        const canvas = sec.querySelector("canvas");
        const stick = sec.querySelector(".tour-sticky");
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        } catch (e) { return; }
        anchor.before(sec);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.outputEncoding = THREE.sRGBEncoding;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

        scene.add(new THREE.HemisphereLight(0xdfffe6, 0x0a1a10, 0.8));
        const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(3, 4, 5); scene.add(key);
        const rim = new THREE.PointLight(0x4cd17a, 7, 16); rim.position.set(-4, 1, -3); scene.add(rim);
        const warm = new THREE.PointLight(0xffb74a, 3, 12); warm.position.set(4, -2, 2); scene.add(warm);

        const pts = [];
        for (let i = 60; i >= 0; i--) {
            const t = i / 60 * Math.PI, s = Math.sin(t), c = Math.cos(t);
            let y = c - (t < 1.57 ? 0.32 * Math.exp(-Math.pow(s / 0.26, 2)) : -0.14 * Math.exp(-Math.pow(s / 0.3, 2)));
            pts.push(new THREE.Vector2(Math.max(s * (1.02 + 0.16 * c), 0.0001), y * 0.95));
        }
        const geo = new THREE.LatheGeometry(pts, 96);
        const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
        const A = new THREE.Color(0xa80f26), B = new THREE.Color(0xe84a2f), G = new THREE.Color(0xc8d84c), tmp = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x);
            tmp.copy(A).lerp(B, 0.5 + 0.5 * Math.sin(a * 3 + y * 2.5));
            tmp.lerp(G, Math.min(Math.max(0, y - 0.35) * 0.55 * (0.5 + 0.5 * Math.sin(a * 2 - 1)), 0.6));
            col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const apple = new THREE.Group();
        apple.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
            vertexColors: true, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.14, side: THREE.DoubleSide
        })));
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.42, 12), new THREE.MeshStandardMaterial({ color: 0x5a3b22, roughness: 0.8 }));
        stem.position.set(0.03, 1.0, 0); stem.rotation.z = -0.18; apple.add(stem);
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), new THREE.MeshStandardMaterial({ color: 0x3f9858, roughness: 0.5 }));
        leaf.scale.set(0.34, 0.018, 0.14); leaf.position.set(0.26, 1.12, 0); leaf.rotation.z = 0.35; apple.add(leaf);

        const stage = new THREE.Group();
        stage.add(apple);
        scene.add(stage);

        const orbCols = [0x6fdc8c, 0xf2c14e, 0x5ec8d8];
        const orbits = orbCols.map(function (c, i) {
            const g = new THREE.Group();
            g.rotation.set([1.15, 0.55, 1.45][i], 0, [0.3, -0.6, 0.9][i]);
            const R = [1.95, 2.35, 2.75][i];
            const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.006, 8, 180), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.35 }));
            const orb = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24),
                new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9, roughness: 0.25 }));
            g.add(ring, orb); stage.add(g);
            return { g: g, orb: orb, R: R, sp: [0.55, 0.4, 0.3][i], a: i * 2.1 };
        });

        const N = 420, dust = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const r = 3 + Math.random() * 5, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
            dust.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
        }
        const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dust, 3));
        const points = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.045, color: 0x8cffb0, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
        scene.add(points);

        const gc = document.createElement("canvas"); gc.width = gc.height = 128;
        const gx = gc.getContext("2d"), gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, "rgba(111,220,140,0.75)"); gr.addColorStop(1, "rgba(111,220,140,0)");
        gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = -1.5; stage.add(floor);

        function resize() {
            const w = stick.clientWidth, h = stick.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h; camera.updateProjectionMatrix();
            const wide = w / h > 1.1 && w > 800;
            stage.position.set(wide ? 1.9 : 0, wide ? 0 : 0.9, 0);
            stage.scale.setScalar(wide ? 1 : 0.7);
        }
        resize(); window.addEventListener("resize", resize);

        const stepEls = sec.querySelectorAll(".tour-step"), title = sec.querySelector(".tour-title"), dots = sec.querySelectorAll(".tour-dots i");
        let p = 0, step = -2, vis = true, mx = 0, my = 0, sx = 0, sy = 0;
        sec.addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
        new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(sec);

        function setStep(s) {
            title.classList.toggle("on", s < 0);
            stepEls.forEach(function (el, i) { el.classList.toggle("on", i === s); });
            dots.forEach(function (d, i) { d.classList.toggle("on", i === s); });
        }

        const clock = new THREE.Clock();
        (function frame() {
            requestAnimationFrame(frame);
            if (!vis || document.hidden) return;
            const t = clock.getElapsedTime(), r = sec.getBoundingClientRect();
            p += (Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1) - p) * 0.08;
            sx += (mx - sx) * 0.06; sy += (my - sy) * 0.06;

            const s = p < 0.06 ? -1 : Math.min(3, Math.floor((p - 0.06) / 0.235));
            if (s !== step) { step = s; setStep(s); }

            apple.rotation.y = p * Math.PI * 2.6 + t * 0.12 + sx * 0.7;
            apple.rotation.x = 0.28 - p * 0.35 + sy * 0.35;
            apple.position.y = Math.sin(t * 1.2) * 0.06;
            camera.position.set(sx * 0.8, -sy * 0.5, 8.2 - p * 1.4);
            camera.lookAt(stage.position.x * 0.35, 0, 0);

            const pulse = step === 0 ? 1 + 0.35 * Math.sin(t * 3) : 1;
            warm.intensity = 3 * pulse + (step === 0 ? 3 : 0);

            orbits.forEach(function (o, i) {
                o.a += o.sp * 0.016;
                o.orb.position.set(Math.cos(o.a) * o.R, Math.sin(o.a) * o.R, 0);
                const on = step === i + 1;
                const k = o.orb.scale.x + ((on ? 2.1 : 1) - o.orb.scale.x) * 0.1;
                o.orb.scale.setScalar(k);
                o.orb.material.emissiveIntensity = on ? 1.8 : 0.7;
                o.g.scale.setScalar(0.8 + p * 0.35);
                o.g.rotation.z += 0.0015 * (i + 1);
            });
            points.rotation.y = t * 0.03 + p * 1.2;
            renderer.render(scene, camera);
        })();
    }
});