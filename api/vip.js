import ambassadors from '../ambassadors.json';

export const config = {
    runtime: 'edge',
};

// Regex to detect common bots/crawlers used by messaging apps and social networks
const BOT_USER_AGENTS = /facebookexternalhit|twitterbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|linkedinbot|skypeuripreview|applebot|bingbot|googlebot|yandex|baiduspider|ia_archiver/i;

export default function handler(request) {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const userAgent = request.headers.get('user-agent') || '';

    // 1. Resolve Ambassador
    // Normalize ID (lowercase) to match json keys
    const id = idParam ? idParam.toLowerCase() : '';
    const ambassador = ambassadors[id];

    // If no ambassador found, or no ID, redirect to home or generic vip
    // (Or we could serve generic tags. Let's redirect to static generic page for users, 
    // but for bots we might want a generic preview too? Let's assume generic preview if not found.)

    const creatorName = ambassador ? ambassador.name : 'Godmode';
    // Capitalize name for better presentation: "srpavlog" -> "Srpavlog"
    const formattedName = creatorName.charAt(0).toUpperCase() + creatorName.slice(1);

    const title = ambassador
        ? `${formattedName}, you have been invited to Godmode`
        : 'You have been invited to Godmode';

    const description = 'Exclusive VIP access to Godmode';
    // Use absolute URL for the image. Assuming the site is trygodmode.app based on the user prompt.
    // Ideally we use request.url origin, but for OG tags absolute is best.
    // Protocol might be http on localhost, so let's stick to the deployed domain or construct from request.
    const origin = url.origin;
    const imageUrl = `${origin}/assets/logo.png`; // Fixed image as requested

    // 2. Bot Detection
    const isBot = BOT_USER_AGENTS.test(userAgent);

    // 3. Response Logic
    if (isBot) {
        // Serve HTML with OG tags for bots
        // We also include the basic HTML structure and a meta-refresh just in case a user masquerades as a bot,
        // they will still get redirected eventually (though 307 is preferred for real users).

        // OG URL must include the full /vip?id=CREATOR_ID as requested
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
        // We maintain other query params if any, but strictly speaking we just need ID.
        // Simpler to just construct the target.
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
