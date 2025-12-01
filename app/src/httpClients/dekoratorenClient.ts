import { queryOptions } from "@tanstack/react-query";

export type UserInfo = {
  name: string;
  userId: string;
};

type DekoratorenAuthResponse = {
  authenticated: boolean;
  name: string;
  userId: string;
};

export function getUserInfo() {
  return queryOptions({
    queryKey: ["USER_INFO"],
    queryFn: fetchUserInfo,
  });
}

async function fetchUserInfo(): Promise<UserInfo> {
  const response = await fetch("/nav-dekoratoren-api/auth");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DekoratorenAuthResponse = await response.json();

  if (!data.authenticated) {
    throw new Error("User is not authenticated");
  }

  return {
    name: data.name,
    userId: data.userId,
  };
}
