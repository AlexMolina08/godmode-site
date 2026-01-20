/**
 * GODMODE CREATOR VIP PASS - LOGIC
 * Replicates the behavior of the React component in vanilla JS.
 */

const CREATOR_DATA_URL = './ambassadors.json';
const APP_STORE_URL = 'https://apps.apple.com/redeem?code=';

let currentAmbassador = null;

// --- UTILS ---

/**
 * Shows a toast message
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2500);
}

/**
 * Copies text to clipboard with fallback
 */
async function copyToClipboard(text, successMessage) {
    try {
        await navigator.clipboard.writeText(text);

        // Haptic feedback best-effort
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }

        showToast(successMessage || 'Copied to clipboard');
        return true;
    } catch (err) {
        console.error('Copy failed', err);
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(successMessage || 'Copied to clipboard');
            return true;
        } catch (err) {
            showToast('Failed to copy');
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// --- ACTIONS ---

async function handleRedeem() {
    if (!currentAmbassador) return;

    const btn = document.getElementById('redeem-btn');
    if (!btn) return;
    const originalContent = btn.innerHTML;

    // Set loading state
    btn.innerHTML = '<div class="loading-spinner"></div>';
    btn.disabled = true;

    // 1. Copy Code
    await copyToClipboard(currentAmbassador.vip_code, 'VIP code copied');

    // 2. Simulate delay then open URL
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        window.open(`${APP_STORE_URL}${currentAmbassador.vip_code}`, '_blank');
    }, 800);
}

async function handleShareAll() {
    if (!currentAmbassador) return;

    const shareText = `Godmode — 1-month passes\nRedeem link: https://godmode.app/redeem\n\n` +
        currentAmbassador.community_codes.map((code, i) =>
            `${(i + 1).toString().padStart(2, '0')} — ${code}`
        ).join('\n');

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Godmode Passes',
                text: shareText,
            });
        } catch (err) {
            console.log('Share cancelled or failed, falling back to copy');
            copyToClipboard(shareText, 'All codes copied');
        }
    } else {
        copyToClipboard(shareText, 'All codes copied');
    }
}

function handleCopyCode(code, index) {
    copyToClipboard(code, `Code ${index + 1} copied`);
}

// --- RENDERING ---

function renderAmbassador(ambassador) {
    currentAmbassador = ambassador;

    const headerTitle = document.getElementById('creator-name-header');
    const initials = document.getElementById('card-initials');
    const cardName = document.getElementById('card-name');
    const cardId = document.getElementById('card-id');
    const codeList = document.getElementById('code-list');

    if (headerTitle) headerTitle.textContent = `${ambassador.name}’s Creator Access`;
    if (initials) initials.textContent = ambassador.name.substring(0, 2).toUpperCase();
    if (cardName) cardName.textContent = ambassador.name;
    if (cardId) cardId.textContent = `ID: ${ambassador.vip_code.split('-').pop().substring(0, 6)}`;

    if (codeList) {
        codeList.innerHTML = '';
        ambassador.community_codes.forEach((code, index) => {
            const row = document.createElement('div');
            row.className = 'code-row';
            row.onclick = () => handleCopyCode(code, index);

            row.innerHTML = `
                <div class="code-row-left">
                    <span class="code-index">${(index + 1).toString().padStart(2, '0')}</span>
                    <div class="code-info">
                        <span class="code-text">${code}</span>
                        <span class="code-desc">1-month access</span>
                    </div>
                </div>
                <button class="copy-btn">Copy</button>
            `;
            codeList.appendChild(row);
        });
    }

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- INIT ---

async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'antonio'; // Fallback to antonio as it exists in ambassadors.json

    try {
        const response = await fetch(CREATOR_DATA_URL);
        if (!response.ok) throw new Error('Failed to load ambassadors.json');

        const data = await response.json();
        const ambassador = data[id.toLowerCase()];

        if (ambassador) {
            renderAmbassador(ambassador);
        } else {
            console.error('Ambassador not found');
            showToast('VIP Access not found');
        }
    } catch (err) {
        console.error('Error:', err);
        showToast('Error loading VIP data');
    }

    // Event Listeners
    const redeemBtn = document.getElementById('redeem-btn');
    const shareBtn = document.getElementById('share-all-btn');

    if (redeemBtn) redeemBtn.addEventListener('click', handleRedeem);
    if (shareBtn) shareBtn.addEventListener('click', handleShareAll);

    // Initial icon creation
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
