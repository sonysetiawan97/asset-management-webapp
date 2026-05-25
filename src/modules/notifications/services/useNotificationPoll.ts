import { useState, useEffect, useCallback } from "react";
import { useList } from "@hooks/list/useList";
import { usePartialUpdate } from "@hooks/request/usePartialUpdate";
import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "@/utils/apiAxios";
import { type Notification, moduleName } from "../types/Model";

export const useNotificationPoll = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data } = useList<Notification>({
    module: moduleName,
    skip: 0,
    limit: 1,
    params: { read: "false" },
  });

  useEffect(() => {
    setUnreadCount(data?.data?.count ?? 0);
  }, [data]);

  return unreadCount;
};

export const useMarkAllRead = () => {
  const markAllRead = useMutation({
    mutationFn: async () => {
      await apiAxios.patch(`/${moduleName}/mark-all-read`);
    },
  });
  return markAllRead.mutateAsync;
};

export const useMarkRead = () => {
  const { partialUpdate } = usePartialUpdate<Record<string, never>>(moduleName);
  return useCallback(async (id: string) => {
    await partialUpdate({ url: moduleName, id, body: {} });
  }, [partialUpdate]);
};