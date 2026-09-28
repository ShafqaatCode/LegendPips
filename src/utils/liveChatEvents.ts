export const OPEN_LIVE_CHAT_EVENT = "lp:open-live-chat";

/** Open the floating live chat widget from anywhere in the app. */
export function openLiveChat() {
  window.dispatchEvent(new CustomEvent(OPEN_LIVE_CHAT_EVENT));
}
