import { atom } from "nanostores";
import type { Model } from "../types/RoleTypes";

export const store = atom<Model[]>([]);
