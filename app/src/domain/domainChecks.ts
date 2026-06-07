import { routineIds } from "./ids";
import {
  addCustomItemToOverride,
  createDefaultAppStorage,
  createUserRoutineOverride,
  mergeRoutine,
  resolveRoutineOrder,
} from "./mergeRoutine";
import { parseAppStorage, serializeAppStorage } from "./storageSchema";
import { templateRoutines } from "./templateRoutines";

const customItem = {
  id: "custom-1",
  label: "  추가   준비물  ",
  createdAt: "2026-06-07T00:00:00.000Z",
} as const;

const golfTemplate = templateRoutines.find((routine) => routine.id === "golf");

if (!golfTemplate) {
  throw new Error("Gate 5 domain check failed: golf template is missing");
}

const golfOverride = addCustomItemToOverride(
  createUserRoutineOverride("golf"),
  customItem,
);
const mergedGolf = mergeRoutine(golfTemplate, golfOverride);
const storageRoundTrip = parseAppStorage(
  serializeAppStorage({
    ...createDefaultAppStorage(),
    routineOverrides: [golfOverride],
  }),
);

export const gate5DomainChecks = {
  hasAllRoutineTemplates: templateRoutines.length === routineIds.length,
  keepsBaseAndCustomSeparate:
    mergedGolf.baseItems.every((item) => item.type === "base") &&
    mergedGolf.customItems.every((item) => item.type === "custom"),
  normalizesCustomItems: mergedGolf.customItems[0]?.label === "추가 준비물",
  keepsSessionStateOutOfStorage:
    !serializeAppStorage(createDefaultAppStorage()).includes("checkedItemIds"),
  storageRoundTripOk: storageRoundTrip.ok,
  prepFlowOrderIncludesGolf: resolveRoutineOrder(
    "prepFlow",
    "early",
    createDefaultAppStorage(),
  ).includes("golf"),
} as const;
