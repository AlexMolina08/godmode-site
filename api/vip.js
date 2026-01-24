export const config = {
    runtime: 'edge',
};

// Regex to detect common bots/crawlers used by messaging apps and social networks
const BOT_USER_AGENTS = /facebookexternalhit|twitterbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|linkedinbot|skypeuripreview|applebot|bingbot|googlebot|yandex|baiduspider|ia_archiver/i;

export default function handler(request) {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const userAgent = request.headers.get('user-agent') || '';

    // Generic Metadata
    const title = 'You have been invited to Godmode';
    const description = 'Exclusive VIP access to Godmode';

    // Use absolute URL for the image.
    const origin = url.origin;
    const imageUrl = `${origin}/assets/logo.png`;

    // 1. Bot Detection
    const isBot = BOT_USER_AGENTS.test(userAgent);

    // 2. Response Logic
    if (isBot) {
        // Serve HTML with OG tags for bots
        const ogUrl = `${origin}/vip?id=${idParam || ''}`;

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Open Graph / Facebook / WhatsApp / Telegram -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${ogUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${ogUrl}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <!-- Fallback redirect just in case -->
    <meta http-equiv="refresh" content="0;url=/vip?id=${idParam || ''}&_r=1">
</head>
<body>
    <script>
        window.location.href = "/vip?id=${idParam || ''}&_r=1";
    </script>
</body>
</html>`;

        return new Response(html, {
            headers: { 'content-type': 'text/html;charset=UTF-8' },
        });
    } else {
        // Redirect real users to the static page with the loop-breaking parameter
        const redirectUrl = new URL(request.url);
        redirectUrl.pathname = '/vip';
        // Ensure id is present
        if (idParam) {
            redirectUrl.searchParams.set('id', idParam);
        }
        // Add loop breaker
        redirectUrl.searchParams.set('_r', '1');

        return Response.redirect(redirectUrl.toString(), 307);
    }
}
