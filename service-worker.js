importScripts("config.js");

const CONFIG = globalThis.BK_INJECTOR_CONFIG;

function matchTarget(rawUrl) {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    return CONFIG.targets.find((target) =>
      url.protocol === target.protocol &&
      url.hostname === target.host &&
      url.pathname === target.pathname &&
      url.hash.split("?")[0] === target.hash
    ) || null;
  } catch {
    return null;
  }
}

async function setStatus(tabId, text, title = text) {
  try {
    await chrome.action.setBadgeText({ tabId, text });
    await chrome.action.setTitle({ tabId, title });
  } catch (_) {
    // The tab may have closed while the operation was running.
  }
}

async function runTarget(tabId, target) {
  const tab = await chrome.tabs.get(tabId);
  // Re-check immediately before fetching/injecting to avoid stale-tab races.
  const currentTarget = matchTarget(tab?.url);
  if (!currentTarget || currentTarget.id !== target.id) {
    throw new Error("The active tab no longer matches the configured route.");
  }

  const response = await fetch(target.scriptUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Controller download failed (HTTP ${response.status}).`);
  const source = await response.text();
  if (!source.trim()) throw new Error("The configured controller script is empty.");

  // The controller runs in the page's MAIN world to access the site's JS context.
  // Note: the site's CSP may block eval; if so, bundle the reviewed controller locally.
  await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (scriptText) => {
      (0, eval)(scriptText);
      return true;
    },
    args: [source]
  });

  await setStatus(tabId, "OK", `${target.name}: injected successfully`);
  return `${target.name} injected successfully.`;
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!Number.isInteger(tab?.id)) return;

  const target = matchTarget(tab.url);
  if (!target) {
    await setStatus(tab.id, "URL", "No configured script matches this URL");
    return;
  }

  await setStatus(tab.id, "…", `Loading ${target.name}…`);
  try {
    await runTarget(tab.id, target);
  } catch (error) {
    const message = error?.message || String(error);
    await setStatus(tab.id, "ERR", message);
    console.error(`[${target.name}]`, error);
  }
});

// Keep the badge informative when navigating between routes.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url && changeInfo.status !== "complete") return;
  const target = matchTarget(changeInfo.url || tab.url);
  if (!target) {
    await setStatus(tabId, "", "BK Injector — no configured route matched");
  } else {
    await setStatus(tabId, "", `BK Injector — ready for ${target.name}`);
  }
});
