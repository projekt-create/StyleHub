import Cookies from "js-cookie";

// user access token bor yoki yo'qligini tekshiradi
export function isAuthenticated() {
  return !!Cookies.get("accessToken");
}

// current access token oladi
export function getAccessToken() {
  return Cookies.get("accessToken") || null;
}

// current refresh token oladi
export function getRefreshToken() {
  return Cookies.get("refreshToken") || null;
}

// localStorage dan user ma'lumotlarini oladi
export function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// user adminmi yoki yo'qligini tekshiradi
export function isAdmin() {
  const user = getStoredUser();
  return user?.role === "admin";
}