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

        showToast(successMessage || i18n.t('common.copied'));
        return true;
    } catch (err) {
        console.error('Copy failed', err);
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(successMessage || i18n.t('common.copied'));
            return true;
        } catch (err) {
            showToast(i18n.t('common.failed_copy'));
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
    await copyToClipboard(currentAmbassador.vip_code, i18n.t('vip.vip_code_copied'));

    // 2. Simulate delay then open URL
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        window.open(`${APP_STORE_URL}${currentAmbassador.vip_code}`, '_blank');
    }, 800);
}

async function handleShareAll() {
    if (!currentAmbassador) return;

    const shareText = `${i18n.t('vip.share_text')}` +
        currentAmbassador.community_codes.map((code, i) =>
            `${(i + 1).toString().padStart(2, '0')} — ${code}`
        ).join('\n');

    if (navigator.share) {
        try {
            await navigator.share({
                title: i18n.t('vip.share_title'),
                text: shareText,
            });
        } catch (err) {
            console.log('Share cancelled or failed, falling back to copy');
            copyToClipboard(shareText, i18n.t('vip.all_codes_copied'));
        }
    } else {
        copyToClipboard(shareText, i18n.t('vip.all_codes_copied'));
    }
}

function handleCopyCode(code, index) {
    copyToClipboard(code, i18n.t('vip.code_index_copied', { index: index + 1 }));
}

// --- RENDERING ---

function renderAmbassador(ambassador) {
    currentAmbassador = ambassador;

    const headerTitle = document.getElementById('creator-name-header');
    const initials = document.getElementById('card-initials');
    const cardName = document.getElementById('card-name');
    const cardId = document.getElementById('card-id');
    const codeList = document.getElementById('code-list');

    const followerPassesTitle = document.getElementById('follower-passes-title');
    const passesMsg = document.getElementById('ambassador-passes');

    if (headerTitle) headerTitle.textContent = i18n.t('vip.ambassador_access', { name: ambassador.name });
    if (initials) initials.textContent = ambassador.name.substring(0, 2).toUpperCase();
    if (cardName) cardName.textContent = ambassador.name;
    if (cardId) cardId.textContent = `${i18n.t('vip.id')}: ${ambassador.vip_code.split('-').pop().substring(0, 6)}`;

    if (followerPassesTitle) followerPassesTitle.textContent = i18n.t('vip.follower_passes', { count: ambassador.community_codes.length });
    if (passesMsg) passesMsg.textContent = i18n.t('vip.ambassador_body_passes', { count: ambassador.community_codes.length });

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
                        <span class="code-desc">${i18n.t('vip.one_month_access')}</span>
                    </div>
                </div>
                <button class="copy-btn">${i18n.t('common.copy')}</button>
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
            showToast(i18n.t('vip.not_found'));
        }
    } catch (err) {
        console.error('Error:', err);
        showToast(i18n.t('vip.error_loading'));
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
document.addEventListener('DOMContentLoaded', () => {
    if (i18n.isLoaded) {
        init();
    } else {
        window.addEventListener('i18n-ready', init);
    }
});
