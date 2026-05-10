const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function sanitizeForAttribute(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
}

function sanitizeImageUrl(url) {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) {
        return '';
    }
    try {
        const parsedUrl = new URL(trimmedUrl);
        const allowedProtocols = ['http:', 'https:'];
        if (!allowedProtocols.includes(parsedUrl.protocol)) {
            return '';
        }
        return trimmedUrl;
    } catch {
        return '';
    }
}

function createSafeElement(tagName, attributes, textContent) {
    const element = document.createElement(tagName);
    if (attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'href' || key === 'src') {
                element.setAttribute(key, sanitizeImageUrl(value));
            } else if (key.startsWith('on')) {
                continue;
            } else {
                element.setAttribute(key, sanitizeForAttribute(value));
            }
        }
    }
    if (textContent !== undefined) {
        element.textContent = textContent;
    }
    return element;
}

function setSafeInnerHTML(element, html) {
    element.textContent = html;
}

export {
    escapeHtml,
    sanitizeForAttribute,
    sanitizeImageUrl,
    createSafeElement,
    setSafeInnerHTML
};