import axios from "axios";
import Cookies from "js-cookie";

// api ning asosiy manzili
const API_BASE_URL = "https://api.magnateshop.uz/api/v1";

// axios instance yaratamiz
const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // barcha requestlar json formatida yuboriladi
    "Content-Type": "application/json",
  },
});

// request yuborilishidan oldin ishlaydi
Api.interceptors.request.use(
  (config) => {
    // cookie ichidan access tokenni olamiz
    const token = Cookies.get("accessToken");

    // token mavjud bo'lsa headerga qo'shamiz
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // requestni davom ettiramiz
    return config;
  },

  // request tayyorlanayotganda xatolik bo'lsa tashqariga uzatamiz
  (error) => Promise.reject(error)
);

// ayni vaqtda refresh request ketayotganini bildiradi
let isRefreshing = false;

// refresh tugashini kutayotgan requestlar shu yerda saqlanadi
let failedQueue = [];

// queue dagi requestlarni davom ettirish yoki bekor qilish
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      // refresh ishlamagan bo'lsa requestni bekor qilamiz
      promise.reject(error);
    } else {
      // refresh ishlagan bo'lsa yangi tokenni yuboramiz
      promise.resolve(token);
    }
  });

  // queue ni bo'shatamiz
  failedQueue = [];
};

// server javoblarini ushlab olamiz
Api.interceptors.response.use(
  // muvaffaqiyatli javob bo'lsa o'zgartirmay qaytaramiz
  (response) => response,

  // xatolik bo'lsa shu yer ishlaydi
  async (error) => {
    // xato bergan requestni saqlab olamiz
    const originalRequest = error.config;

    // faqat 401 bo'lsa refresh qilishga harakat qilamiz
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {

      // agar refresh allaqachon ketayotgan bo'lsa navbatda kutamiz
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            // yangi tokenni eski requestga qo'shamiz
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // requestni qayta yuboramiz
            return Api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // shu request ikkinchi marta refresh qilinmasligi uchun belgilaymiz
      originalRequest._retry = true;

      // refresh boshlandi
      isRefreshing = true;

      // cookie ichidan refresh tokenni olamiz
      const refreshToken = Cookies.get("refreshToken");

      // refresh token bo'lmasa logout qilamiz
      if (!refreshToken) {
        isRefreshing = false;
        forceLogout();
        return Promise.reject(error);
      }

      try {
        // backenddan yangi tokenlarni olamiz
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        // javob ichidan tokenlarni ajratib olamiz
        const {
          accessToken,
          refreshToken: newRefreshToken,
        } = data;

        // cookie dagi access tokenni yangilaymiz
        Cookies.set("accessToken", accessToken);

        // cookie dagi refresh tokenni ham yangilaymiz
        Cookies.set("refreshToken", newRefreshToken);

        // keyingi requestlar uchun default tokenni yangilaymiz
        Api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // aynan xato bergan requestga ham yangi tokenni qo'shamiz
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // navbatda kutayotgan requestlarni davom ettiramiz
        processQueue(null, accessToken);

        // eski requestni qayta yuboramiz
        return Api(originalRequest);

      } catch (refreshError) {
        // refresh ham ishlamasa queue dagi requestlarni bekor qilamiz
        processQueue(refreshError, null);

        // foydalanuvchini logout qilamiz
        forceLogout();

        return Promise.reject(refreshError);

      } finally {
        // refresh tugadi
        isRefreshing = false;
      }
    }

    // boshqa xatoliklarni tashqariga uzatamiz
    return Promise.reject(error);
  }
);

// logout qilish funksiyasi
function forceLogout() {
  // cookie dagi access tokenni o'chiramiz
  Cookies.remove("accessToken");

  // cookie dagi refresh tokenni o'chiramiz
  Cookies.remove("refreshToken");

  // localStorage dagi userni o'chiramiz
  localStorage.removeItem("user");

  // axios ichidagi eski authorization headerni ham tozalaymiz
  delete Api.defaults.headers.common.Authorization;

  // agar login sahifasida bo'lmasa login sahifasiga yuboramiz
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.replace("/login");
  }
}

// boshqa joylarda ishlatish uchun export qilamiz
export default Api;