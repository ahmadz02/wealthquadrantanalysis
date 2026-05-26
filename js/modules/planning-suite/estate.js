(function () {
const html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Estate Planning</title>\n    <link href=\"https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;500;700&display=swap\" rel=\"stylesheet\">\n    <style>\n        /* Included your provided styles and appended the necessary structure */\n        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n        :root {\n            --bg: #f7f6f2; --surface: #fff; --surface2: #f2f0eb;\n            --border: #e2dfd8; --border-strong: #c8c4bb;\n            --text: #1a1916; --text2: #6b6860; --text3: #a09d98;\n            --blue: #1a4a6b; --blue-bg: #edf3f7;\n            --r: 6px; --rl: 10px;\n        }\n        body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); font-size:14px; line-height:1.5; padding:2rem; }\n        \n        .container { max-width: 800px; margin: 0 auto; }\n        \n        /* Card-like styling for the section */\n        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--rl); padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }\n        \n        h1 { font-size: 24px; font-weight: 500; margin-bottom: 1rem; }\n        p { color: var(--text2); margin-bottom: 1.5rem; line-height: 1.6; }\n        \n        .btn-link { \n            display: inline-flex; align-items: center; justify-content: center;\n            background: var(--blue); color: #fff; padding: 10px 20px;\n            border-radius: var(--r); text-decoration: none; font-weight: 500;\n            font-size: 14px; margin-bottom: 2rem; transition: opacity 0.15s;\n        }\n        .btn-link:hover { opacity: 0.9; }\n\n        /* Commentary styles from your provided CSS */\n        .commentary-block { margin-top: 1.5rem; }\n        .commentary-lbl { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }\n        .commentary-box { width: 100%; min-height: 120px; border: 1px solid var(--border); border-radius: var(--rl); padding: 12px 14px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--surface); resize: vertical; line-height: 1.6; transition: border-color 0.12s; }\n        .commentary-box:focus { outline: none; border-color: var(--text); }\n    </style>\n\n<style id=\"planning-suite-frame-overrides\">\n  html, body { min-height: 100%; }\n  body { margin: 0 !important; padding: 0 !important; background: #f7f6f2 !important; }\n  .topbar, .sidebar { display: none !important; }\n  .page.active { min-height: 100vh !important; display: block !important; }\n  .main-area { width: 100% !important; max-width: 1240px !important; margin: 0 auto !important; padding: 2rem !important; box-sizing: border-box !important; }\n  .container { max-width: 1240px !important; padding: 2rem !important; }\n  @media (max-width: 900px) { .main-area, .container { padding: 1rem !important; } .f-static { grid-template-columns: 1fr !important; } }\n</style>\n</head>\n<body>\n\n    <div class=\"container\">\n        <div class=\"card\">\n            <h1>Estate Planning</h1>\n            <p>\n                <strong>Objective:</strong> To identify the faraid heirs and their distribution, \n                and to plan the appointment of an administrator and the intended distribution \n                of assets.\n            </p>\n\n            <a href=\"https://as-salihin.com/en/faraid-calculator/\" target=\"_blank\" class=\"btn-link\">\n                Go to Faraid Calculator\n            </a>\n\n            <div class=\"commentary-block\">\n                <label class=\"commentary-lbl\">Commentary</label>\n                <textarea class=\"commentary-box\" placeholder=\"Add your notes or planning details here...\"></textarea>\n            </div>\n        </div>\n    </div>\n\n</body>\n</html>";

window.WQPlanningSuiteModules = window.WQPlanningSuiteModules || [];
window.WQPlanningSuiteModules.push({
  id: "estate",
  title: "Estate Planning",
  render(container) {
    container.innerHTML = '';
    const frame = document.createElement('iframe');
    frame.className = 'planning-suite-frame';
    frame.title = "Estate Planning";
    frame.srcdoc = window.WQStorage?.injectScopedStorageIntoHtml?.(html, this.id) || html;
    const resizeFrame = () => {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (!doc) return;
        const h = Math.max(760, doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0);
        frame.style.height = `${h + 32}px`;
      } catch (_) {}
    };
    frame.addEventListener('load', () => {
      resizeFrame();
      let runs = 0;
      const timer = setInterval(() => {
        resizeFrame();
        runs += 1;
        if (runs > 12) clearInterval(timer);
      }, 500);
    });
    container.appendChild(frame);
  }
});

})();
