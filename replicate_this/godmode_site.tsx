import React, { useState, useEffect } from 'react';
import { Copy, Share, Check, Zap, ExternalLink, Ticket } from 'lucide-react';

/**
 * GODMODE CREATOR VIP PASS - IMPLEMENTATION
 * * Visual System: Cupertino Premium (Dark)
 * Primary Color: #D7B46A (Gold)
 * Backgrounds: #070809 (Base), #0B0C0E (Card)
 */

// --- MOCK DATA ---
const CREATOR_DATA = {
    name: "Alex",
    initials: "AL",
    vipCode: "GODMODE-VIP-2026-ALX",
    redeemUrl: "https://apps.apple.com/redeem?code=GODMODE-VIP-2026-ALX", // Mock URL
    followerCodes: [
        "GM-26-ALPHA", "GM-26-BRAVO", "GM-26-CHARLIE", "GM-26-DELTA",
        "GM-26-ECHO", "GM-26-FOXTROT", "GM-26-GOLF", "GM-26-HOTEL",
        "GM-26-INDIA", "GM-26-JULIET"
    ]
};

// --- STYLES & TOKENS ---
const COLORS = {
    bg0: '#070809',
    bg1: '#0B0C0E',
    gold: '#D7B46A',
    goldDark: '#B8923F',
    textPrimary: 'rgba(244,241,234,0.95)',
    textSecondary: 'rgba(244,241,234,0.70)',
    textMuted: 'rgba(244,241,234,0.50)',
    border: 'rgba(255,255,255,0.10)',
    borderSoft: 'rgba(255,255,255,0.07)',
    surface: 'rgba(255,255,255,0.035)',
    surface2: 'rgba(255,255,255,0.055)',
    goldSoftFill: 'rgba(215,180,106,0.10)',
    goldBorder: 'rgba(215,180,106,0.20)',
};

// --- ICONS ---

const GodmodeLogo = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// --- COMPONENTS ---

const Toast = ({ message, isVisible }) => {
    return (
        <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                }`}
        >
            <div className="bg-[#141416]/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-[14px] shadow-2xl flex items-center gap-2">
                <Check size={14} className="text-[#D7B46A]" />
                <span className="text-[13px] font-medium text-[#F4F1EA]">{message}</span>
            </div>
        </div>
    );
};

const HeaderPill = ({ name }) => (
    <div className="flex justify-center mb-6">
        <div
            className="h-[34px] px-4 flex items-center justify-center rounded-full border backdrop-blur-sm"
            style={{
                backgroundColor: COLORS.goldSoftFill,
                borderColor: COLORS.goldBorder
            }}
        >
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#D7B46A]">
                {name}’s Creator Access
            </span>
        </div>
    </div>
);

const VipPassCard = ({ creator }) => {
    return (
        <div className="relative w-full aspect-[3/4] max-h-[420px] min-h-[360px] mx-auto perspective-1000 group">
            {/* Glow Effect behind card */}
            <div className="absolute inset-0 bg-[#D7B46A] blur-[80px] opacity-[0.08] rounded-full scale-75 translate-y-4" />

            {/* Card Container */}
            <div
                className="relative w-full h-full rounded-[26px] overflow-hidden flex flex-col justify-between p-6 transition-transform duration-500 ease-out"
                style={{
                    background: `linear-gradient(180deg, ${COLORS.bg1} 0%, #101216 100%)`,
                    boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: `1px solid ${COLORS.borderSoft}`
                }}
            >
                {/* Subtle Vignette & Grain */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Top Row */}
                <div className="relative flex justify-between items-start z-10">
                    <div className="flex items-center gap-2 opacity-90">
                        {/* Small logo text */}
                        <span className="text-white/90 font-bold tracking-wider text-sm">GODMODE</span>
                    </div>

                    <div
                        className="px-2.5 py-1 rounded-md border flex items-center gap-1.5"
                        style={{
                            backgroundColor: COLORS.goldSoftFill,
                            borderColor: COLORS.goldBorder
                        }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D7B46A] animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest text-[#D7B46A]">VIP • 1 YEAR</span>
                    </div>
                </div>

                {/* Center Hero */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-4">
                    {/* Center Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#D7B46A] blur-[60px] opacity-[0.12]" />

                    <GodmodeLogo className="w-20 h-20 text-[#D7B46A] drop-shadow-[0_0_15px_rgba(215,180,106,0.3)]" />
                    <span className="text-[17px] font-semibold tracking-[0.2em] text-[#F4F1EA]/90 uppercase">
                        Creator Pass
                    </span>
                </div>

                {/* Bottom Identity Strip */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F4F1EA] font-semibold text-sm">
                            {creator.initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[19px] font-semibold text-[#F4F1EA] leading-tight">{creator.name}</span>
                            <span className="text-[13px] text-[#F4F1EA]/70">Yearly access unlocked</span>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-3" />

                    <div className="flex justify-between items-center text-[11px] font-medium tracking-wide text-[#F4F1EA]/40 uppercase">
                        <span>Reserved for this link</span>
                        <span>ID: {creator.vipCode.split('-').pop()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrimaryButton = ({ onClick, isLoading }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full h-[50px] rounded-[14px] flex items-center justify-center gap-2 text-[#1A1306] font-semibold text-[16px] transition-all active:scale-[0.98] shadow-lg shadow-[#D7B46A]/10 hover:shadow-[#D7B46A]/20 relative overflow-hidden group"
        style={{
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldDark} 100%)`
        }}
    >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-[#1A1306]/30 border-t-[#1A1306] rounded-full animate-spin" />
        ) : (
            <>
                <span>Redeem 1-Year Access</span>
                <ExternalLink size={16} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </>
        )}

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
    </button>
);

const MessageBlock = () => (
    <div
        className="rounded-[18px] p-5 my-6 backdrop-blur-sm"
        style={{
            backgroundColor: COLORS.goldSoftFill,
            border: `1px solid ${COLORS.goldBorder}`
        }}
    >
        <h3 className="text-[15px] font-semibold text-[#F4F1EA] mb-2">
            You’ve been invited to Creator Access.
        </h3>
        <p className="text-[14px] leading-relaxed text-[#F4F1EA]/80">
            You unlocked 1 year of Godmode. You also get <span className="text-[#D7B46A] font-medium">10 one-month passes</span> to share with people who’ll actually use it.
        </p>
    </div>
);

const CodeRow = ({ index, code, onCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={handleCopy}
            className="group h-[64px] w-full rounded-[16px] px-4 flex items-center justify-between transition-colors cursor-pointer active:scale-[0.99] duration-150 mb-3 select-none"
            style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.borderSoft}`
            }}
        >
            <div className="flex items-center gap-4">
                <span className="text-[12px] font-mono text-[#F4F1EA]/30 w-5">
                    {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-[#F4F1EA] tracking-[0.1em] font-mono">
                        {code}
                    </span>
                    <span className="text-[11px] text-[#F4F1EA]/50">1-month access</span>
                </div>
            </div>

            <button
                className="h-[32px] px-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all"
                style={{
                    backgroundColor: copied ? COLORS.goldSoftFill : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${copied ? COLORS.goldBorder : COLORS.borderSoft}`,
                    color: copied ? COLORS.gold : 'rgba(244,241,234,0.6)'
                }}
            >
                {copied ? (
                    <>
                        <span className="text-[12px] font-medium">Copied</span>
                        <Check size={12} />
                    </>
                ) : (
                    <span className="text-[12px] font-medium group-hover:text-[#F4F1EA] transition-colors">Copy</span>
                )}
            </button>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function GodmodeCreatorPass() {
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isRedeeming, setIsRedeeming] = useState(false);

    // --- ACTIONS ---

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 2500);
    };

    const copyToClipboard = async (text, successMessage) => {
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
            // Fallback for some browsers
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
    };

    const handleRedeem = async () => {
        setIsRedeeming(true);

        // 1. Copy Code
        await copyToClipboard(CREATOR_DATA.vipCode, 'VIP code copied');

        // 2. Simulate delay then open URL
        setTimeout(() => {
            setIsRedeeming(false);
            // In a real app, this would open the specific App Store URL scheme
            window.open(CREATOR_DATA.redeemUrl, '_blank');
        }, 800);
    };

    const handleShareAll = async () => {
        const shareText = `Godmode — 1-month passes\nRedeem link: https://godmode.app/redeem\n\n` +
            CREATOR_DATA.followerCodes.map((code, i) =>
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
    };

    return (
        <div
            className="min-h-screen w-full font-sans antialiased text-[#F4F1EA] selection:bg-[#D7B46A]/30 selection:text-[#D7B46A]"
            style={{ backgroundColor: COLORS.bg0 }}
        >
            {/* Global Style overrides for font stack */}
            <style>{`
        :root {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
        }
        body {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

            <div className="max-w-[430px] mx-auto min-h-screen relative flex flex-col">
                {/* Main Content Padding */}
                <div className="flex-1 px-4 pt-[14px] pb-8 flex flex-col">

                    {/* Header */}
                    <HeaderPill name={CREATOR_DATA.name} />

                    {/* Hero VIP Pass */}
                    <div className="mb-8">
                        <VipPassCard creator={CREATOR_DATA} />
                    </div>

                    {/* Primary CTA */}
                    <div className="flex flex-col gap-3 mb-2">
                        <PrimaryButton onClick={handleRedeem} isLoading={isRedeeming} />
                        <span className="text-center text-[12px] text-[#F4F1EA]/50 font-medium">
                            Copies code and opens App Store redemption.
                        </span>
                    </div>

                    {/* Context Message */}
                    <MessageBlock />

                    {/* Follower Passes Section */}
                    <div className="mt-4">
                        {/* Section Header */}
                        <div className="flex items-end justify-between mb-4 px-1">
                            <div className="flex flex-col gap-0.5">
                                <h2 className="text-[16px] font-semibold text-[#F4F1EA]">Follower Passes (10)</h2>
                                <span className="text-[13px] text-[#F4F1EA]/60">Each code unlocks 1 month.</span>
                            </div>

                            <button
                                onClick={handleShareAll}
                                className="h-[34px] px-4 rounded-full border flex items-center gap-1.5 transition-colors active:bg-white/5"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderColor: COLORS.borderSoft,
                                    color: COLORS.textPrimary
                                }}
                            >
                                <Share size={14} />
                                <span className="text-[13px] font-medium">Share all</span>
                            </button>
                        </div>

                        {/* Codes List */}
                        <div className="flex flex-col gap-0 pb-8">
                            {CREATOR_DATA.followerCodes.map((code, idx) => (
                                <CodeRow
                                    key={idx}
                                    index={idx}
                                    code={code}
                                    onCopy={(c) => copyToClipboard(c, `Code ${idx + 1} copied`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto py-8 text-center flex flex-col gap-2 opacity-40">
                        <p className="text-[11px] font-medium">Having trouble? Contact support.</p>
                        <p className="text-[10px]">Godmode © 2026</p>
                    </div>

                </div>
            </div>

            <Toast message={toast.message} isVisible={toast.show} />
        </div>
    );
}