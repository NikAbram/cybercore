import { ImageResponse } from 'next/og'

export const alt = 'CYBERCORE — пространство для игры'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '76px 84px',
        background: '#09090d',
        color: '#f5f5f7',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 470,
          height: 630,
          background:
            'linear-gradient(145deg, rgba(239,35,60,0.92), rgba(239,35,60,0.08) 58%, transparent 59%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '-2px',
        }}
      >
        CYBERCORE
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div
          style={{
            display: 'flex',
            maxWidth: 820,
            fontSize: 86,
            fontWeight: 760,
            letterSpacing: '-6px',
            lineHeight: 0.94,
          }}
        >
          Твоя игра. Твои правила.
        </div>
        <div
          style={{
            display: 'flex',
            color: '#c9c9d2',
            fontSize: 28,
          }}
        >
          Игровые зоны для личных матчей и командных сессий
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          width: 340,
          height: 8,
          background: '#ef233c',
        }}
      />
    </div>,
    size,
  )
}
