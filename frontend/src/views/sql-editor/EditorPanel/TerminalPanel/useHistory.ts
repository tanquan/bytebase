import { computed, unref, watch } from "vue";
import { useSQLEditorTabStore, useWebTerminalStore } from "@/store";
import type { WebTerminalQueryItemV1 } from "@/types";
import { minmax } from "@/utils";

const MAX_HISTORY_ITEM_COUNT = 1000;

type HistoryState = {
  index: number;
  list: WebTerminalQueryItemV1[];
};

export const useHistory = () => {
  const tabStore = useSQLEditorTabStore();
  const webTerminalStore = useWebTerminalStore();
  const historyByTabId = new Map<string, HistoryState>();
  const queryState = computed(() => {
    return webTerminalStore.getQueryStateByTab(tabStore.currentTab!);
  });

  const currentQuery = computed(() => {
    const queryList = unref(queryState.value.queryItemList);
    return queryList[queryList.length - 1];
  });

  const currentStack = () => {
    const tab = tabStore.currentTab!;
    if (tab.mode !== "ADMIN") return undefined;

    const existed = historyByTabId.get(tab.id);
    if (existed) {
      return existed;
    }
    const initial: HistoryState = {
      index: -1,
      list: [],
    };
    historyByTabId.set(tab.id, initial);
    return initial;
  };

  const push = (query: WebTerminalQueryItemV1) => {
    const stack = currentStack();
    if (!stack) return;
    const { list } = stack;
    list.push(query);
    if (list.length > MAX_HISTORY_ITEM_COUNT) {
      list.shift();
    }
    stack.index = list.length - 1;
  };

  const move = (direction: "up" | "down") => {
    const stack = currentStack();
    if (!stack) return;
    const { index, list } = stack;
    const delta = direction === "up" ? -1 : 1;
    const nextIndex = minmax(index + delta, 0, list.length - 1);
    if (nextIndex === index) {
      return;
    }
    if (nextIndex === list.length - 1) {
      currentQuery.value.statement = "";
    } else {
      const historyQuery = list[nextIndex];
      if (historyQuery) {
        currentQuery.value.statement = historyQuery.statement;
      }
    }

    stack.index = nextIndex;
  };

  watch(
    () => currentQuery.value,
    (query) => {
      push(query);
    },
    {
      immediate: true,
    }
  );

  return { push, move };
};
