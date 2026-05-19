export const moduleName = "locations";

export type LocationType = "site" | "building" | "floor" | "room";

export interface Model {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateModel {
  name: string;
  code?: string;
  type: LocationType;
  parent_id: string | null;
}

export interface ReadModel {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateModel {
  id: string;
  name: string;
  code?: string;
  type: LocationType;
  parent_id: string | null;
}

export const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: "site", label: "Site / Campus" },
  { value: "building", label: "Building" },
  { value: "floor", label: "Floor" },
  { value: "room", label: "Room / Zone" },
];

export const LOCATION_TYPE_ORDER: Record<LocationType, number> = {
  site: 1,
  building: 2,
  floor: 3,
  room: 4,
};