# Design system

## Direction

Native-feeling mobile utility with a restrained culinary identity. The interface uses an iOS-like system font, true neutral surfaces, one warm tomato accent, thin separators, compact controls, and purposeful elevation. Delight belongs to the reveal, not the surrounding chrome.

## Color

- Canvas: `#F5F5F7`
- Primary surface: `#FFFFFF`
- Secondary surface: `#EFEFF4`
- Primary ink: `#1C1C1E`
- Secondary ink: `#636366`
- Separator: `rgba(60, 60, 67, 0.18)`
- Accent: `#C44736`
- Accent pressed: `#A93628`
- Success: `#2E7D4F`
- Rare: `#426C9A`
- Legendary: `#A87512`

Accent is reserved for primary actions, selection, current navigation, and reveal highlights.

## Typography

Use the Apple system stack (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `PingFang SC`) for all product UI. Use weight, spacing, and scale rather than a separate display face. Enable tabular figures for streaks and counters.

## Layout

Mobile-first, centered at 560px maximum. Respect top and bottom safe areas. Main content uses 20px side gutters and an 8px spacing base. On larger screens, the app remains a focused phone-like task surface rather than expanding into a dashboard.

## Components

- Navigation: translucent bottom tab bar with consistent custom line icons and 44px targets.
- Segmented control: filled selected segment inside a muted track; supports `aria-pressed`.
- Switch: standard 51×31 iOS proportion with a white thumb.
- Primary button: 50px tall, 14px radius, solid accent, direct verb label.
- Secondary action: text or neutral filled button, never a competing outline.
- Recipe row: clean white surface, food glyph container, metadata, trailing disclosure.
- Sheet: bottom-aligned, 18px top radius, dimmed backdrop, scroll lock, Escape close, visible handle.
- Filters: horizontal scroll chips with a filled selected state.

## Motion

Standard controls use 180–240ms exponential ease-out. Reveal motion can be longer because it communicates the core event. All motion has a reduced-motion path with no shaking, spinning, or long travel.
