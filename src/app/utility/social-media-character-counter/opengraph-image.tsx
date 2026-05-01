import { ImageResponse } from 'next/og';

export const alt = 'Social Media Character Counter';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'linear-gradient(135deg, rgb(12, 18, 32) 0%, rgb(30, 41, 59) 50%, rgb(29, 78, 216) 100%)',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: 'rgb(191, 219, 254)',
          }}
        >
          FindBest Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 940 }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Social Media Character Counter
          </div>
          <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.3, color: 'rgb(226, 232, 240)' }}>
            Check platform limits for Instagram, X, LinkedIn, TikTok, Threads, Bluesky, and more.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Real-time alerts', 'URL weighting', 'Multi-platform comparison'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontSize: 21,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
