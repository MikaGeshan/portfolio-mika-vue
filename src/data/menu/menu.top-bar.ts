interface MenuItem {
  name: string
  shortcut?: string
  disabled?: boolean
  divider?: boolean
}

export interface TopBarMenu {
  name: string
  items: MenuItem[]
}

export const apple_menu: TopBarMenu = {
  name: 'Apple',
  items: [
    { name: 'About This Mac' },
    { divider: true, name: 'System divider' },
    { name: 'System Settings...' },
    { name: 'App Store...', disabled: true },
    { divider: true, name: 'Power divider' },
    { name: 'Lock Screen', shortcut: '⌃⌘Q' },
    { name: 'Log Out Mika Geshan...', shortcut: '⇧⌘Q' },
  ],
}

export const top_bar_menu: TopBarMenu[] = [
  {
    name: 'Finder',
    items: [
      { name: 'About Finder' },
      { divider: true, name: 'Finder divider' },
      { name: 'Settings...', shortcut: '⌘,' },
      { divider: true, name: 'Services divider' },
      { name: 'Hide Finder', shortcut: '⌘H' },
      { name: 'Hide Others', shortcut: '⌥⌘H' },
      { name: 'Show All', disabled: true },
    ],
  },
  {
    name: 'File',
    items: [
      { name: 'New Finder Window', shortcut: '⌘N' },
      { name: 'New Folder', shortcut: '⇧⌘N' },
      { name: 'Open', shortcut: '⌘O', disabled: true },
      { divider: true, name: 'File divider' },
      { name: 'Get Info', shortcut: '⌘I' },
      { name: 'Rename', disabled: true },
      { name: 'Move to Trash', shortcut: '⌘⌫', disabled: true },
    ],
  },
  {
    name: 'Edit',
    items: [
      { name: 'Undo', shortcut: '⌘Z', disabled: true },
      { name: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      { divider: true, name: 'Edit divider' },
      { name: 'Cut', shortcut: '⌘X', disabled: true },
      { name: 'Copy', shortcut: '⌘C', disabled: true },
      { name: 'Paste', shortcut: '⌘V', disabled: true },
      { name: 'Select All', shortcut: '⌘A' },
    ],
  },
  {
    name: 'View',
    items: [
      { name: 'as Icons', shortcut: '⌘1' },
      { name: 'as List', shortcut: '⌘2' },
      { name: 'as Columns', shortcut: '⌘3' },
      { name: 'as Gallery', shortcut: '⌘4' },
      { divider: true, name: 'View divider' },
      { name: 'Show View Options', shortcut: '⌘J' },
    ],
  },
  {
    name: 'Go',
    items: [
      { name: 'Back', shortcut: '⌘[' },
      { name: 'Forward', shortcut: '⌘]', disabled: true },
      { name: 'Enclosing Folder', shortcut: '⌘↑' },
      { divider: true, name: 'Go divider' },
      { name: 'Home', shortcut: '⇧⌘H' },
      { name: 'Documents', shortcut: '⇧⌘O' },
      { name: 'Downloads', shortcut: '⌥⌘L' },
    ],
  },
  {
    name: 'Window',
    items: [
      { name: 'Minimize', shortcut: '⌘M' },
      { name: 'Zoom' },
      { divider: true, name: 'Window divider' },
      { name: 'Bring All to Front' },
    ],
  },
  {
    name: 'Help',
    items: [
      { name: 'Search' },
      { divider: true, name: 'Help divider' },
      { name: 'macOS Portfolio Help' },
      { name: 'Keyboard Shortcuts' },
    ],
  },
]
