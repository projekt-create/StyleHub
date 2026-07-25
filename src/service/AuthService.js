import Api from "./Api";

// authentication bilan bog'liq barcha requestlar shu yerda yoziladi
const AuthService = {

  // foydalanuvchini login qilish
  login: async (username, password) => {

    // login endpointiga username va password yuboramiz
    const { data } = await Api.post("/auth/login", {
      username,
      password,
    });

    // backend qaytargan javobni qaytaramiz
    return data;
  },

  // access token eskirganda yangi access token olish
  refresh: async (refreshToken) => {

    // refresh tokenni backendga yuboramiz
    const { data } = await Api.post("/auth/refresh", {
      refreshToken,
    });

    // yangi tokenlarni qaytaramiz
    return data;
  },

  // joriy qurilmadan logout qilish
  logout: async () => {

    // bearer token avtomatik interceptor orqali qo'shiladi
    const { data } = await Api.post("/auth/logout");

    // backend javobini qaytaramiz
    return data;
  },

  // barcha qurilmalardan logout qilish
  logoutAll: async () => {

    // foydalanuvchining barcha sessiyalarini tugatadi
    const { data } = await Api.post("/auth/logout-all");

    return data;
  },

  // login qilgan foydalanuvchi ma'lumotlarini olish
  getMe: async () => {

    // bearer token interceptor orqali avtomatik qo'shiladi
    const { data } = await Api.get("/auth/me");

    return data;
  },

  // foydalanuvchining barcha aktiv sessiyalarini olish
  getSessions: async () => {

    // qaysi qurilmalarda login qilinganini qaytaradi
    const { data } = await Api.get("/auth/sessions");

    return data;
  },
};

// boshqa fayllarda ishlatish uchun export qilamiz
export default AuthService;