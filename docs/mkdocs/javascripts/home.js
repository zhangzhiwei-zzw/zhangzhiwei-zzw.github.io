/* Homepage-only language preference. */
(() => {
  function initialize() {
    const home = document.querySelector(".home-page");
    if (!home || home.dataset.homeReady) return;
    home.dataset.homeReady = "true";

    const preferenceKey = "profile.home.language";
    const toggle = home.querySelector("[data-home-language-toggle]");
    const label = home.querySelector("[data-home-language-label]");
    const greeting = home.querySelector("[data-home-hello]");
    const translatedText = [...home.querySelectorAll("[data-home-zh]")].map(element => ({
      element, en: element.textContent, zh: element.getAttribute("data-home-zh"),
    }));
    const translatedAttributes = [];
    for (const [marker, attribute] of [["data-home-alt-zh", "alt"], ["data-home-aria-zh", "aria-label"]]) {
      for (const element of home.querySelectorAll(`[${marker}]`)) {
        translatedAttributes.push({element, attribute, en: element.getAttribute(attribute), zh: element.getAttribute(marker)});
      }
    }

    // Translate shared navigation only while the English/Chinese homepage is open.
    const navigation = new Map([
      ["张志威的个人主页", "Zhiwei Zhang"], ["首页", "Home"],
      ["技术笔记", "Technical notes"], ["博客", "Blog"], ["关于", "About"],
      ["导航", "Navigation"], ["目录", "Table of contents"], ["搜索", "Search"],
      ["回到页面顶部", "Back to top"],
      ["切换至夜间模式", "Switch to dark mode"], ["切换至日间模式", "Switch to light mode"],
      ["清空当前内容", "Clear search"],
    ]);
    const navigationText = [];
    const roots = document.querySelectorAll(".md-header, .md-tabs, .md-sidebar--primary, .md-top");
    const pairFor = text => [...navigation].find(([zh, en]) => text === zh || text === en);
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const raw = node.nodeValue;
        const pair = pairFor(raw.trim());
        if (pair) navigationText.push({node, zh: pair[0], en: pair[1],
          before: raw.match(/^\s*/)[0], after: raw.match(/\s*$/)[0]});
      }
      for (const element of [root, ...root.querySelectorAll("[aria-label], [title], [placeholder]")]) {
        for (const attribute of ["aria-label", "title", "placeholder"]) {
          const pair = pairFor(element.getAttribute(attribute));
          if (pair) translatedAttributes.push({element, attribute, zh: pair[0], en: pair[1]});
        }
      }
    }

    function changeLanguage(language, remember = false) {
      home.dataset.homeLanguage = language;
      home.lang = language;
      document.documentElement.lang = language;
      for (const item of translatedText) item.element.textContent = item[language];
      for (const item of translatedAttributes) item.element.setAttribute(item.attribute, item[language]);
      for (const item of navigationText) item.node.nodeValue = item.before + item[language] + item.after;
      label.textContent = language === "en" ? "中文" : "English";
      label.lang = language === "en" ? "zh" : "en";
      const toggleDescription = language === "en" ? "Switch homepage to Chinese" : "切换首页为英文";
      toggle.setAttribute("aria-label", toggleDescription);
      toggle.title = toggleDescription;
      const greetingDescription = language === "en" ? "Visit my GitHub" : "访问我的 GitHub";
      greeting.setAttribute("aria-label", greetingDescription);
      greeting.title = greetingDescription;
      document.title = language === "en" ? "Zhiwei Zhang | Embodied AI & Robotics" : "张志威的个人主页 | 具身智能与机器人";
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = language === "en"
        ? "Zhiwei Zhang explores embodied AI, robotics, artificial intelligence, and world models. Notes and ideas on making robots smarter."
        : "张志威的个人主页。关注具身智能、机器人、人工智能与世界模型，记录让机器人更智能的学习、实践与思考。";
      if (remember) {
        try { localStorage.setItem(preferenceKey, language); } catch { /* Switching works without storage. */ }
      }
    }

    let language = "en";
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (saved === "zh") language = "zh";
    } catch { /* Default to English when storage is unavailable. */ }
    changeLanguage(language);
    toggle.addEventListener("click", () => changeLanguage(home.dataset.homeLanguage === "en" ? "zh" : "en", true));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, {once: true});
  else initialize();
})();
