const ZOOM_DOMAIN_REGEX = /zoom\.us\/j\/(\d+)/;

// Helper: Follow redirects and extract the final Zoom meeting ID
async function getZoomMeetingId(originalUrl) {
  let currentUrl = originalUrl;
  let maxRedirects = 10;
  for (let i = 0; i < maxRedirects; i++) {
    const res = await fetch(currentUrl, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    // Check for HTTP redirect status codes
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      const next = res.headers.get('location');
      currentUrl = next.startsWith('http') ? next : new URL(next, currentUrl).toString();
    } else {
      // Not a redirect. Check if this is a Zoom join URL
      const match = ZOOM_DOMAIN_REGEX.exec(currentUrl);
      if (match) {
        return { meetingId: match[1], joinUrl: currentUrl };
      }
      // If not a Zoom join link, maybe the page has a Zoom link in its HTML
      const text = await res.text();
      const linkMatch = text.match(/https:\/\/(?:[a-z]+\.)?zoom\.us\/j\/(\d+)/);
      if (linkMatch) {
        return { meetingId: linkMatch[1], joinUrl: linkMatch[0] };
      }
      return null;
    }
  }
  return null;
}

// Helper: Get Zoom OAuth access token
async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=account_credentials&account_id=${accountId}`,
  });
  if (!res.ok) throw new Error("Failed to get Zoom access token");
  const json = await res.json();
  return json.access_token;
}

// Helper: Check meeting status via Zoom API
async function checkMeetingStatus(meetingId, accessToken) {
  const res = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 404) return { available: false, reason: "Meeting not found" };
  if (!res.ok) return { available: false, reason: "Zoom API error" };
  const data = await res.json();
  return { available: data.status === "started", data };
}

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const meetingInfo = await getZoomMeetingId(url);
    if (!meetingInfo) {
      return res.status(200).json({ available: false, reason: "Zoom meeting link not found" });
    }
    const token = await getZoomAccessToken();
    const status = await checkMeetingStatus(meetingInfo.meetingId, token);
    return res.status(200).json({
      ...status,
      meetingId: meetingInfo.meetingId,
      joinUrl: meetingInfo.joinUrl
    });
  } catch (e) {
    return res.status(500).json({ available: false, reason: e.message });
  }
}