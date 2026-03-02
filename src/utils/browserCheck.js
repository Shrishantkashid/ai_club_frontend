/**
 * Detect if the current browser is Microsoft Edge
 * @returns {boolean} true if browser is Edge, false otherwise
 */
export const isEdgeBrowser = () => {
  const userAgent = navigator.userAgent;
  // Check for Edge browser (both old EdgeHTML and new Chromium-based Edge)
  return /Edg\/\d+/i.test(userAgent);
};

/**
 * Disable all Copilot features and shortcuts in Edge
 */
export const disableCopilotFeatures = () => {
  if (!isEdgeBrowser()) return;

  // Prevent keyboard shortcuts related to Copilot
  document.addEventListener('keydown', (e) => {
    // Block Ctrl+Shift+I (Copilot sidebar)
    // Block Ctrl+Shift+.
    // Block Alt+Shift+Copilot shortcut
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === '.')) ||
        (e.altKey && e.shiftKey && e.key === 'C')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Override Edge Copilot-related APIs if they exist
  if (window.chrome?.webstore) {
    // Block extension-related Copilot features
    Object.defineProperty(window.chrome.webstore, 'install', {
      value: function() {
        console.warn('Copilot features disabled');
        return Promise.reject(new Error('Copilot disabled'));
      }
    });
  }

  // Block any iframes or embedded content trying to load Copilot
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'IFRAME') {
          const iframe = node;
          if (iframe.src.toLowerCase().includes('copilot') || 
              iframe.src.toLowerCase().includes('bing.com/chat') ||
              iframe.title?.toLowerCase().includes('copilot')) {
            iframe.remove();
          }
        }
      });
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
};

/**
 * Get browser name
 * @returns {string} Browser name
 */
export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  
  if (/Edg\/\d+/i.test(userAgent)) {
    return 'Microsoft Edge';
  } else if (/Chrome\/\d+/i.test(userAgent)) {
    return 'Google Chrome';
  } else if (/Firefox\/\d+/i.test(userAgent)) {
    return 'Mozilla Firefox';
  } else if (/Safari\/\d+/i.test(userAgent)) {
    return 'Safari';
  } else {
    return 'Unknown Browser';
  }
};
