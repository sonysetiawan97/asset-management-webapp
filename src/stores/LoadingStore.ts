import { atom } from "nanostores";

/**
 * Tracks page content loading state.
 * When true, a loading overlay appears inside the body container
 * (header & sidebar remain visible and interactive).
 */
export const $isPageLoading = atom<boolean>(false);