// pages/api/zoom-status.js

export default async function handler(req, res) {
  const { meetingId } = req.query;
  if (!meetingId) {
    return res.status(400).json({ error: "Missing meetingId" });
  }

  // Get Zoom access token using Server-to-Server OAuth
  const tokenRes = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
  });

  if (!tokenRes.ok) {
    return res.status(500).json({ error: "Failed to get Zoom access token" });
  }
  const { access_token } = await tokenRes.json();

  // Check meeting status
  const apiRes = await fetch(
    `https://api.zoom.us/v2/meetings/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (apiRes.status === 404) {
    return res.status(200).json({ available: false, reason: "Meeting not found" });
  }
  if (!apiRes.ok) {
    return res.status(500).json({ available: false, reason: "Zoom API error" });
  }

  const data = await apiRes.json();

  // To check if meeting is live, check "status" field (should be "started")
  const isLive = data.status === "started";
  return res.status(200).json({ available: isLive, data });
}