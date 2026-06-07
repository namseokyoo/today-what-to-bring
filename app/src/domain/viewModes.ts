import type {
  CategoryGroup,
  HomeViewMode,
  PrepFlowGroup,
  RoutineId,
  ViewModeGroupId,
} from "./ids";
import { categoryGroups, prepFlowGroups } from "./ids";
import type { TemplateRoutine } from "./routine";

export interface PrepFlowMetadata {
  readonly id: PrepFlowGroup;
  readonly label: string;
  readonly description: string;
}

export interface CategoryMetadata {
  readonly id: CategoryGroup;
  readonly label: string;
  readonly searchKeywords: readonly string[];
}

export const homeViewModeLabels: Readonly<Record<HomeViewMode, string>> = {
  prepFlow: "준비 흐름별",
  category: "카테고리별",
};

export const prepFlowMetadata: readonly PrepFlowMetadata[] = [
  {
    id: "now",
    label: "지금",
    description: "나가기 직전 바로 확인하는 루틴",
  },
  {
    id: "todayTomorrow",
    label: "오늘·내일",
    description: "당일이나 전날 일정에 맞춰 확인하는 루틴",
  },
  {
    id: "early",
    label: "미리",
    description: "며칠 전부터 준비하면 좋은 루틴",
  },
] as const;

export const categoryMetadata: readonly CategoryMetadata[] = [
  {
    id: "daily",
    label: "일상/외출",
    searchKeywords: ["일상", "외출", "출근", "약속"],
  },
  {
    id: "health",
    label: "건강/운동",
    searchKeywords: ["건강", "운동", "병원", "헬스"],
  },
  {
    id: "family",
    label: "가족/생활",
    searchKeywords: ["가족", "생활", "장보기", "등원", "등교"],
  },
  {
    id: "work",
    label: "업무/출장",
    searchKeywords: ["업무", "출장", "외근", "미팅"],
  },
  {
    id: "leisure",
    label: "레저/여행",
    searchKeywords: ["레저", "여행", "캠핑", "골프", "등산"],
  },
] as const;

export const defaultPrepFlowRoutineOrder: Readonly<
  Record<PrepFlowGroup, readonly RoutineId[]>
> = {
  now: ["commute", "outing", "workout"],
  todayTomorrow: [
    "rainy",
    "hospital",
    "grocery",
    "childSchool",
    "businessTrip",
  ],
  early: ["golf", "camping", "domesticTravel", "overseasTravel", "hiking"],
};

export const defaultCategoryRoutineOrder: Readonly<
  Record<CategoryGroup, readonly RoutineId[]>
> = {
  daily: ["commute", "outing", "rainy"],
  health: ["workout", "hospital"],
  family: ["grocery", "childSchool"],
  work: ["businessTrip"],
  leisure: ["golf", "camping", "domesticTravel", "overseasTravel", "hiking"],
};

export const viewModeGroupOrder: Readonly<
  Record<HomeViewMode, readonly ViewModeGroupId[]>
> = {
  prepFlow: prepFlowGroups,
  category: categoryGroups,
};

export function getDefaultRoutineOrder(
  viewMode: "prepFlow",
  groupId: PrepFlowGroup,
): readonly RoutineId[];
export function getDefaultRoutineOrder(
  viewMode: "category",
  groupId: CategoryGroup,
): readonly RoutineId[];
export function getDefaultRoutineOrder(
  viewMode: HomeViewMode,
  groupId: ViewModeGroupId,
): readonly RoutineId[] {
  if (viewMode === "prepFlow" && isPrepFlowGroup(groupId)) {
    return defaultPrepFlowRoutineOrder[groupId];
  }

  if (viewMode === "category" && isCategoryGroup(groupId)) {
    return defaultCategoryRoutineOrder[groupId];
  }

  return [];
}

export function getRoutineGroupId(
  template: TemplateRoutine,
  viewMode: HomeViewMode,
): ViewModeGroupId {
  return viewMode === "prepFlow"
    ? template.prepFlowGroup
    : template.categoryGroup;
}

function isPrepFlowGroup(groupId: ViewModeGroupId): groupId is PrepFlowGroup {
  return (prepFlowGroups as readonly string[]).includes(groupId);
}

function isCategoryGroup(groupId: ViewModeGroupId): groupId is CategoryGroup {
  return (categoryGroups as readonly string[]).includes(groupId);
}
