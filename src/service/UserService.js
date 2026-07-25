import Api from "./Api";

// foydalanuvchilar bilan bog'liq barcha requestlar shu yerda yoziladi
const UserService = {

  // login qilgan foydalanuvchi ma'lumotlarini olish
  getMe: async () => {

    const { data } = await Api.get("/users/me");

    return data;
  },

  // login qilgan foydalanuvchi ma'lumotlarini yangilash
  updateMe: async (userData) => {

    // userData ichida yangilanadigan ma'lumotlar bo'ladi
    const { data } = await Api.patch("/users/me", userData);

    return data;
  },

  // login qilgan foydalanuvchining parolini o'zgartirish
  changePassword: async (passwordData) => {

    // eski va yangi parol backendga yuboriladi
    const { data } = await Api.patch(
      "/users/me/password",
      passwordData
    );

    return data;
  },

  // barcha foydalanuvchilarni olish
  // pagination qo'llab-quvvatlanadi
  getAll: async (params = {}) => {

    // params query string ko'rinishida yuboriladi
    const { data } = await Api.get("/users", {
      params,
    });

    return data;
  },

  // id orqali bitta foydalanuvchini olish
  getById: async (id) => {

    const { data } = await Api.get(`/users/${id}`);

    return data;
  },

  // yangi foydalanuvchi yaratish
  create: async (userData) => {

    const { data } = await Api.post("/users", userData);

    return data;
  },

  // id orqali foydalanuvchini yangilash
  update: async (id, userData) => {

    const { data } = await Api.patch(
      `/users/${id}`,
      userData
    );

    return data;
  },

  // id orqali foydalanuvchini o'chirish
  remove: async (id) => {

    const { data } = await Api.delete(`/users/${id}`);

    return data;
  },
};

// boshqa fayllarda ishlatish uchun export qilamiz
export default UserService;