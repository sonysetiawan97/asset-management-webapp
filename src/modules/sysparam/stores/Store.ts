import { atom } from "nanostores";
import type { Model } from "../types/Model";

export const store = atom<Model[]>([]);
