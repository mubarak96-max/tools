import { ImageResponse } from 'next/og';

export const alt = 'UTM Builder - Free Google Analytics Campaign URL Generator';
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
            'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 48%, rgb(79, 70, 229) 100%)',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: 'rgb(191, 219, 254)',
          }}
        >
          FindBest Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 }}>
          <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, lineHeight: 1.05 }}>
            UTM Builder for GA4
          </div>
          <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.3, color: 'rgb(226, 232, 240)' }}>
            Generate campaign URLs with source, medium, campaign, validation, and bulk mode.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['Bulk generator', 'Local history', 'No signup required'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 20px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontSize: 22,
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
