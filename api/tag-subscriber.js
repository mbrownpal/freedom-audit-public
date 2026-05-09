export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Subscribe to Kit with freedom-audit tag
    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': process.env.KIT_API_SECRET,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: name || '',
        tags: ['freedom-audit'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Kit API Error]', error);
      return res.status(response.status).json({ error: 'Kit tagging failed' });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Tag Subscriber Error]', error);
    return res.status(500).json({ error: 'Kit tagging failed' });
  }
}
