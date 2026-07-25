import Api from "./Api";

// mahsulotlar bilan bog'liq barcha requestlar shu yerda yoziladi
const ProductService = {

  // barcha mahsulotlarni olish
  // filter, qidiruv, pagination va sortingni qo'llab-quvvatlaydi
  getAll: async (params = {}) => {

    // params avtomatik query string ko'rinishida yuboriladi
    const { data } = await Api.get("/products", {
      params,
    });

    return data;
  },

  // id orqali bitta mahsulotni olish
  getById: async (id) => {

    const { data } = await Api.get(`/products/${id}`);

    return data;
  },

  // slug orqali mahsulotni olish
  getBySlug: async (slug) => {

    const { data } = await Api.get(`/products/slug/${slug}`);

    return data;
  },

  // yangi mahsulot qo'shish
  create: async (productData) => {

    // productData ichida barcha mahsulot ma'lumotlari bo'ladi
    const { data } = await Api.post("/products", productData);

    return data;
  },

  // mahsulotni to'liq almashtirish
  replace: async (id, productData) => {

    // put eski ma'lumotni to'liq almashtiradi
    const { data } = await Api.put(`/products/${id}`, productData);

    return data;
  },

  // mahsulotning kerakli qismini yangilash
  update: async (id, productData) => {

    // patch faqat yuborilgan maydonlarni yangilaydi
    const { data } = await Api.patch(`/products/${id}`, productData);

    return data;
  },

  // mahsulotni o'chirish
  remove: async (id) => {

    // soft delete ishlatilsa ma'lumot bazadan butunlay o'chmaydi
    const { data } = await Api.delete(`/products/${id}`);

    return data;
  },

  // o'chirilgan mahsulotni qayta tiklash
  restore: async (id) => {

    const { data } = await Api.post(`/products/${id}/restore`);

    return data;
  },

  // mahsulot statistikalarini olish
  getStats: async () => {

    // dashboard uchun statistik ma'lumotlar
    const { data } = await Api.get("/products/stats");

    return data;
  },
};

// boshqa fayllarda ishlatish uchun export qilamiz
export default ProductService;