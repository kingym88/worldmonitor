import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';

interface SocialMention {
  id: string;
  source: 'twitter' | 'reddit' | 'instagram' | 'news';
  author: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  engagement: number;
}

interface BrandMetric {
  name: string;
  sentiment: number; // 0-100
  volume: number;    // mentions per hour
  trend: 'up' | 'down' | 'stable';
}

const MOCK_MENTIONS: SocialMention[] = [
  { id: '1', source: 'twitter', author: '@TravelBug99', content: 'Just booked my trip to Bali via Expedia! Can\'t wait for the summer vibes. 🌞 #Travel', sentiment: 'positive', timestamp: new Date(), engagement: 45 },
  { id: '2', source: 'reddit', author: 'u/nomad_life', content: 'Comparing Expedia vs Booking for flights. Anyone seeing better deals on EXPE lately?', sentiment: 'neutral', timestamp: new Date(), engagement: 12 },
  { id: '3', source: 'news', author: 'TechCrunch', content: 'Expedia Group announces new AI features for trip planning assistance.', sentiment: 'positive', timestamp: new Date(), engagement: 156 },
  { id: '4', source: 'twitter', author: '@GrumpyTraveler', content: 'Flight delayed and app is glitching. Not cool, need support ASAP.', sentiment: 'negative', timestamp: new Date(), engagement: 8 },
  { id: '5', source: 'instagram', author: '@LuxuryEscapes', content: 'Partnering with Expedia for our next giveaway! Check out these amazing resorts.', sentiment: 'positive', timestamp: new Date(), engagement: 890 },
];

export class ExpediaMonitorPanel extends Panel {
  private mentions: SocialMention[] = [];
  private metrics: BrandMetric[] = [
    { name: 'Expedia', sentiment: 78, volume: 1250, trend: 'up' },
    { name: 'Booking', sentiment: 72, volume: 1400, trend: 'stable' },
    { name: 'Airbnb', sentiment: 65, volume: 980, trend: 'down' },
  ];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super({
      id: 'expedia-monitor',
      title: 'EXPEDIA SOCIAL PULSE',
      showCount: true,
      infoTooltip: `
        <strong>Brand Health Monitor</strong><br>
        Real-time social listening for Expedia Group brands.<br><br>
        <strong>Metrics:</strong><br>
        • Sentiment Analysis (AI-scored)<br>
        • Share of Voice (vs Competitors)<br>
        • Viral Topic Detection
      `,
    });
    this.mentions = [...MOCK_MENTIONS];
    this.startSimulation();
    this.render();
  }

  private startSimulation(): void {
    // Simulate incoming mentions
    this.timer = setInterval(() => {
      this.addNewMockMention();
      this.updateMetrics();
      this.render();
    }, 5000);
  }

  private addNewMockMention(): void {
    const authors = ['@Traveller', '@FlyHigh', '@Wanderlust', 'u/trip_advice', '@HotelPro'];
    const topics = ['prices', 'app update', 'refund', 'customer service', 'deals'];
    const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'positive', 'neutral', 'negative'];
    
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)] || '@Traveler';
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomSentiment = (sentiments[Math.floor(Math.random() * sentiments.length)]) || 'neutral';
    
    const newMention: SocialMention = {
      id: Date.now().toString(),
      source: Math.random() > 0.5 ? 'twitter' : 'reddit',
      author: randomAuthor,
      content: `Talking about ${randomTopic} on Expedia today. ${randomSentiment === 'positive' ? 'Great experience!' : randomSentiment === 'negative' ? 'Frustrating.' : 'Interesting.'}`,
      sentiment: randomSentiment,
      timestamp: new Date(),
      engagement: Math.floor(Math.random() * 50),
    };
    
    this.mentions.unshift(newMention);
    if (this.mentions.length > 20) this.mentions.pop();
  }

  private updateMetrics(): void {
    // Randomly fluctuate metrics slightly
    this.metrics.forEach(m => {
      m.sentiment = Math.min(100, Math.max(0, m.sentiment + (Math.random() - 0.5) * 5));
      m.volume = Math.max(0, m.volume + Math.floor((Math.random() - 0.5) * 50));
    });
    const firstMetric = this.metrics[0];
    if (firstMetric) {
      this.setCount(firstMetric.volume); // Show volume in header count
    }
  }

  public destroy(): void {
    if (this.timer) clearInterval(this.timer);
    super.destroy();
  }

  private getSentimentColor(sentiment: string): string {
    if (sentiment === 'positive') return 'var(--green)';
    if (sentiment === 'negative') return 'var(--red)';
    return 'var(--text-muted)';
  }

  private render(): void {
    const expedia = this.metrics.find(m => m.name === 'Expedia')!;
    const others = this.metrics.filter(m => m.name !== 'Expedia');

    const html = `
      <div class="monitor-dashboard">
        <!-- Main Sentiment Gauge -->
        <div class="monitor-hero">
          <div class="monitor-score-ring" style="--score: ${expedia.sentiment}%">
            <span class="score-value">${Math.round(expedia.sentiment)}</span>
            <span class="score-label">Sentiment</span>
          </div>
          <div class="monitor-stats">
            <div class="stat-row">
              <span class="stat-label">Volume</span>
              <span class="stat-val">${expedia.volume}/hr <span class="trend ${expedia.trend}">${expedia.trend === 'up' ? '↑' : '↓'}</span></span>
            </div>
            <div class="stat-row">
              <span class="stat-label">SoV</span>
              <span class="stat-val">34%</span>
            </div>
          </div>
        </div>

        <!-- Competitor Comparison -->
        <div class="monitor-comparison">
          <div class="comp-header">Competitive Landscape</div>
          ${others.map(c => `
            <div class="comp-row">
              <span class="comp-name">${c.name}</span>
              <div class="comp-bar-container">
                <div class="comp-bar" style="width: ${c.sentiment}%; background: ${c.sentiment > 70 ? 'var(--green)' : 'var(--yellow)'}"></div>
              </div>
              <span class="comp-val">${Math.round(c.sentiment)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Mentions Feed -->
        <div class="monitor-feed">
          <div class="feed-header">Live Mentions</div>
          <div class="feed-list">
            ${this.mentions.slice(0, 5).map(m => `
              <div class="feed-item">
                <div class="feed-item-header">
                  <span class="feed-author">${escapeHtml(m.author)}</span>
                  <span class="feed-time">${m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="feed-content">${escapeHtml(m.content)}</div>
                <div class="feed-footer">
                  <span class="feed-source source-${m.source}">${m.source}</span>
                  <span class="feed-sentiment" style="color: ${this.getSentimentColor(m.sentiment)}">• ${m.sentiment}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }
}
