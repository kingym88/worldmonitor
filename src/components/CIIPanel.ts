import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';
import { calculateCII, type CountryScore } from '@/services/country-instability';

export class CIIPanel extends Panel {
  private scores: CountryScore[] = [];
  private focalPointsReady = false;
  private onShareStory?: (code: string, name: string) => void;

  constructor() {
    super({
      id: 'cii',
      title: 'DESTINATION DEMAND INDEX',
      showCount: true,
      trackActivity: true,
      infoTooltip: `<strong>DDI Methodology</strong>
        Score (0-100) indicating travel demand and safety:
        <ul>
          <li><strong>Safety</strong>: Inverse of conflict/unrest risk</li>
          <li><strong>Stability</strong>: Political stability and governance</li>
          <li><strong>Interest</strong>: Search and news volume signals</li>
          <li><strong>Access</strong>: Flight connectivity and open borders</li>
        </ul>
        <em>High Score = High Demand & Safety.</em>`,
    });
    this.showLoading('Scanning intelligence feeds');
  }

  public setShareStoryHandler(handler: (code: string, name: string) => void): void {
    this.onShareStory = handler;
  }

  private getLevelColor(level: CountryScore['level']): string {
    switch (level) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'elevated': return '#ffaa00';
      case 'normal': return '#88aa44';
      case 'low': return '#22aa88';
    }
  }

  private getLevelEmoji(level: CountryScore['level']): string {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'elevated': return '🟡';
      case 'normal': return '🟢';
      case 'low': return '⚪';
    }
  }

  private getTrendArrow(trend: CountryScore['trend'], change: number): string {
    if (trend === 'rising') return `<span class="trend-up">↑${change > 0 ? change : ''}</span>`;
    if (trend === 'falling') return `<span class="trend-down">↓${Math.abs(change)}</span>`;
    return '<span class="trend-stable">→</span>';
  }

  private renderCountry(country: CountryScore): string {
    // DDI Inversion: High Risk (CII) = Low Demand. So DDI = 100 - Risk.
    // However, for UI, if backend still returns Risk, we invert here.
    // Assuming backend returns RISK (0=Safe, 100=Critical).
    // DDI: 100=High Demand (Safe), 0=Low Demand ( unsafe).
    const ddiScore = Math.max(0, 100 - country.score);
    const barWidth = ddiScore;
    
    // Invert level colors for DDI (Green=High Score=Good, Red=Low Score=Bad)
    // But getLevelColor handles Risk levels (Critical=Red).
    // If we pass Risk Level, it returns Red. We want Red for Low DDI.
    // So if Risk is Critical (High Score), DDI is Low (Red).
    // So getLevelColor(country.level) returns Red for Critical Risk.
    // This matches: Low DDI (Red) = Critical Risk.
    const color = this.getLevelColor(country.level);
    
    // Emoji: Critical Risk = Red Circle. Matches Low DDI.
    const emoji = this.getLevelEmoji(country.level);
    
    // Trend: If Risk Rising -> DDI Falling. Invert trend arrow.
    const ddiTrend = country.trend === 'rising' ? 'falling' : country.trend === 'falling' ? 'rising' : 'stable';
    const trendArrow = this.getTrendArrow(ddiTrend, country.change24h);

    return `
      <div class="cii-country" data-code="${escapeHtml(country.code)}">
        <div class="cii-header">
          <span class="cii-emoji">${emoji}</span>
          <span class="cii-name">${escapeHtml(country.name)}</span>
          <span class="cii-score">${ddiScore}</span>
          ${trendArrow}
          <button class="cii-share-btn" data-code="${escapeHtml(country.code)}" data-name="${escapeHtml(country.name)}" title="Share story"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>
        </div>
        <div class="cii-bar-container">
          <div class="cii-bar" style="width: ${barWidth}%; background: ${color};"></div>
        </div>
        <div class="cii-components">
          <span title="Interest">I:${country.components.information}</span>
          <span title="Safety">S:${100 - country.components.conflict}</span>
          <span title="Access">A:${100 - country.components.security}</span>
          <span title="Events">E:${country.components.unrest}</span>
        </div>
      </div>
    `;
  }

  private bindShareButtons(): void {
    if (!this.onShareStory) return;
    this.content.querySelectorAll('.cii-share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const el = e.currentTarget as HTMLElement;
        const code = el.dataset.code || '';
        const name = el.dataset.name || '';
        if (code && name) this.onShareStory!(code, name);
      });
    });
  }

  public async refresh(forceLocal = false): Promise<void> {
    if (!this.focalPointsReady && !forceLocal) {
      return;
    }

    if (forceLocal) {
      this.focalPointsReady = true;
      console.log('[CIIPanel] Focal points ready, calculating scores...');
    }

    this.showLoading();

    try {
      const localScores = calculateCII();
      const localWithData = localScores.filter(s => s.score > 0).length;
      this.scores = localScores;
      console.log(`[CIIPanel] Calculated ${localWithData} countries with focal point intelligence`);

      const withData = this.scores.filter(s => s.score > 0);
      this.setCount(withData.length);

      if (withData.length === 0) {
        this.content.innerHTML = '<div class="empty-state">No instability signals detected</div>';
        return;
      }

      const html = withData.map(s => this.renderCountry(s)).join('');
      this.content.innerHTML = `<div class="cii-list">${html}</div>`;
      this.bindShareButtons();
    } catch (error) {
      console.error('[CIIPanel] Refresh error:', error);
      this.showError('Failed to calculate CII');
    }
  }

  public getScores(): CountryScore[] {
    return this.scores;
  }
}
