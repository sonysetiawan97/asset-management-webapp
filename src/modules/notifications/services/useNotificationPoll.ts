import { useState, useEffect, useCallback } from "react";
import { useList } from "@hooks/list/useList";
import { useUpdate } from "@hooks/request/useUpdate";
import { type Notification, moduleName } from "../types/Model";

export const useNotificationPoll = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data } = useList<Notification>({
    module: moduleName,
    skip: 0,
    limit: 1,
    params: { "!sort[created_at]": -1, is_read: false },
  });

  useEffect(() => {
    setUnreadCount(data?.data.count ?? 0);
  }, [data]);

  return unreadCount;
};

export const useMarkAllRead = () => {
  const { updateAsync } = useUpdate<Record<string, never>>();
  return useCallback(async () => {
    await updateAsync({ id: "read-all", url: `${moduleName}/read-all`, body: {} });
  }, [updateAsync]);
};

export const useMarkRead = () => {
  const { updateAsync } = useUpdate<Record<string, never>>();
  return useCallback(async (id: string) => {
    await updateAsync({ id, url: `${moduleName}/${id}/read`, body: {} });
  }, [updateAsync]);
};