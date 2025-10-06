"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setProjectId } from "@/lib/states/workspaceSlice";

export default function HydrateProjectData({
  projectInfo,
}: {
  projectInfo: string;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setProjectId({ projectId: projectInfo }));
  }, [dispatch, projectInfo]);
  return null;
}
