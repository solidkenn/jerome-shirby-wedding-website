/** Fired only when the guest opens the door (keyboard Enter or door Enter button). */
export const WEDDING_MUSIC_START = 'wedding:music-start'

export function requestBackgroundMusic() {
  window.dispatchEvent(new CustomEvent(WEDDING_MUSIC_START))
}
