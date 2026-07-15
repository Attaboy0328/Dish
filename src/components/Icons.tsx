import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function IconBase({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function TodayIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8.5h14M7 4.5v2M17 4.5v2" />
      <rect x="4" y="5.5" width="16" height="15" rx="3" />
      <path d="m8.5 14 2.2 2.2 4.8-5" />
    </IconBase>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h4.5v16H7a2.5 2.5 0 0 0-2.5 2V5.5Z" />
      <path d="M19.5 5.5A2.5 2.5 0 0 0 17 3h-5.5v16H17a2.5 2.5 0 0 1 2.5 2V5.5Z" />
    </IconBase>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" />
    </IconBase>
  )
}

export function GiftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="9" width="17" height="11.5" rx="2" />
      <path d="M2.5 9h19V5.5h-19V9ZM12 5.5v15" />
      <path d="M12 5.5H8.75A2.25 2.25 0 1 1 11 3.25L12 5.5Zm0 0h3.25A2.25 2.25 0 1 0 13 3.25L12 5.5Z" />
    </IconBase>
  )
}

export function CardsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="3.5" width="12" height="17" rx="2.5" transform="rotate(-7 5 3.5)" />
      <path d="m11.7 9.2 2 2-2 2-2-2 2-2Z" />
      <path d="M17.8 7.2 20 8v9a2 2 0 0 1-2 2h-.8" />
    </IconBase>
  )
}

export function WheelIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3.5V10m0 4v6.5M3.5 12H10m4 0h6.5M6 6l4.5 4.5m3 3L18 18m0-12-4.5 4.5m-3 3L6 18" />
    </IconBase>
  )
}

export function ChevronIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  )
}



export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m7 7 10 10M17 7 7 17" />
    </IconBase>
  )
}
