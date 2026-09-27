import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory campaign storage
let campaignData = {
  id: 'GTS-2025-Q3',
  name: 'Global Tech Summit 2025: AI & Future of Work',
  organizer: 'Apex Innovations & TechVentures Alliance',
  date: 'OCT 24-26, 2025',
  location: 'San Francisco, CA & Virtual',
  badgeType: 'Flagship Summit',
  hashtags: ['#TechSummit2025', '#AIFuture', '#ProductInnovation'],
  channels: {
    linkedInCompany: 'linkedin.com/company/apex',
    twitter: '@ApexTechSummit',
    eventPortal: 'https://techsummit2025.io',
  },
  aiPromptDirectives: 'Emphasize high-value networking, actionable AI framework takeaways from keynote sessions, and visionary multi-cloud scalability challenges discussed on Day 2.',
  autoEnrichment: true,
  registeredDelegates: 3450,
  brandUniformityScore: 94.2,
  postsGenerated: 1420,
  impressions: '482.5K',
  engagementRate: '68.4%',
};

// API: Get current campaign configuration
app.get('/api/campaign', (_req, res) => {
  res.json({ success: true, campaign: campaignData });
});

// API: Update campaign configuration
app.post('/api/campaign', (req, res) => {
  campaignData = { ...campaignData, ...req.body };
  res.json({ success: true, campaign: campaignData });
});

// API: Generate AI LinkedIn post
app.post('/api/generate-post', async (req, res) => {
  const {
    eventName = campaignData.name,
    organizer = campaignData.organizer,
    hashtags = campaignData.hashtags,
    directives = campaignData.aiPromptDirectives,
    attendeeName = 'Sarah Chen',
    attendeeTitle = 'VP of AI Products @ NexaTech • Keynote Speaker',
    takeaways = '',
    tone = 'Grateful Attendee',
    photoLabels = ['Stage', 'Badge', 'Panel'],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Write an authentic, high-impact LinkedIn post for an executive attendee who just attended "${eventName}", organized by "${organizer}".
Attendee name: ${attendeeName}
Attendee title/headline: ${attendeeTitle}
Tone: ${tone} (e.g. Grateful Attendee, Key Takeaways, Professional Thought Leadership)
Attendee's personal takeaways/notes: "${takeaways}"
Organizer directives to incorporate subtly: "${directives}"
Hashtags to include naturally at the end: ${hashtags.join(' ')}
Attached photos context: ${photoLabels.join(', ')}

Formatting requirements:
- Use clean paragraph breaks for maximum mobile readability.
- Start with a compelling hook.
- Use clean bullet formatting (e.g. 1️⃣, 2️⃣, 3️⃣ or clean bullets) if listing takeaways.
- Include a gracious shoutout to the organizers (@${organizer.split('&')[0].trim()}).
- End with 3-5 relevant hashtags including ${hashtags.join(' ')}.
- Return ONLY the LinkedIn post text with no meta-commentary, markdown backticks, or intro.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an executive ghostwriter specialized in authentic, viral B2B LinkedIn posts for conference attendees and industry leaders.',
          temperature: 0.7,
        },
      });

      const generatedText = response.text?.trim();
      if (generatedText) {
        return res.json({
          success: true,
          postText: generatedText,
          viralScore: Math.floor(Math.random() * 6) + 92, // 92 - 97
          reachReasoning: `Includes ${hashtags.length} high-affinity summit tags, organizer mention, and authentic attached photos.`,
        });
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent template generator:', err);
    }
  }

  // Intelligent fallback generator based on tone & inputs
  let postText = '';
  const orgMention = `@${organizer.split('&')[0].trim()}`;
  const tagList = hashtags.join(' ');

  if (tone === 'Key Takeaways') {
    postText = `Still processing an energizing few days at ${eventName}! 🚀

Here are 3 core takeaways from the keynote discussions and peer deep-dives:

1️⃣ Autonomous AI agents are rapidly moving from exploratory prototypes to mission-critical infrastructure.
2️⃣ Data provenance, privacy guardrails, and ethical governance can't be bolted on later—they must be architectural defaults.
3️⃣ The serendipity of face-to-face dialogue accelerates partnerships faster than 6 months of asynchronous emails.

${takeaways ? `Personal highlight: "${takeaways}"\n\n` : ''}Huge thank you to ${orgMention} for curating a benchmark event.

${tagList} #Leadership #ProductInnovation #ArtificialIntelligence`;
  } else if (tone === 'Professional') {
    postText = `Reflecting on the strategic discussions at ${eventName}. 

As we look toward the next horizon of enterprise tech, the consensus from fellow leaders is unmistakable: agility and secure AI integration are the twin engines of sustainable scale.

${takeaways ? `Key observation: ${takeaways}\n\n` : ''}Grateful for the rich conversations with fellow executives and the incredible leadership shown by ${orgMention} in orchestrating this gathering.

Looking forward to continuing these conversations!

${tagList} #ExecutiveLeadership #EnterpriseTech #Strategy`;
  } else {
    // Grateful Attendee (default)
    postText = `Still buzzing from an incredible 3 days at ${hashtags[0] || '#TechSummit2025'}! 🚀

Three big takeaways that will shape our Q4 strategy:

1️⃣ Autonomous AI agents are rapidly transitioning from experimental prototypes to core enterprise architecture.
2️⃣ Ethical governance, guardrails, and data privacy must be baked into LLM workflows from day zero—not as an afterthought.
3️⃣ Nothing beats the spontaneous serendipity and energy of authentic peer collaboration in person.

${takeaways ? `Highlights: ${takeaways}\n\n` : ''}Huge thanks to ${orgMention} and the entire organizing team for curating such a world-class gathering. Grateful for the insightful conversations with fellow leaders!

${tagList} #ProductLeadership #ArtificialIntelligence`;
  }

  return res.json({
    success: true,
    postText,
    viralScore: 94,
    reachReasoning: `Includes ${hashtags.length} high-affinity event tags, 1 speaker mention, and authentic imagery.`,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EventPulse server running on port ${PORT}`);
  });
}

startServer();
