import Api from "./Api";

// kategoriyalar bilan bog'liq barcha requestlar shu yerda yoziladi
const CategoryService = {

  // barcha kategoriyalarni olish
  getAll: async () => {

    // har bir kategoriya bilan birga mahsulotlar soni ham qaytishi mumkin
    const { data } = await Api.get("/categories");

    return data;
  },

  // faqat kategoriya nomlarini olish
  getNames: async () => {

    // odatda select yoki filter uchun ishlatiladi
    const { data } = await Api.get("/categories/names");

    return data;
  },

  // id yoki slug orqali bitta kategoriyani olish
  getOne: async (idOrSlug) => {

    const { data } = await Api.get(`/categories/${idOrSlug}`);

    return data;
  },

  // yangi kategoriya qo'shish
  create: async (categoryData) => {

    // categoryData ichida kategoriya ma'lumotlari bo'ladi
    const { data } = await Api.post("/categories", categoryData);

    return data;
  },

  // kategoriyani yangilash
  update: async (id, categoryData) => {

    const { data } = await Api.patch(
      `/categories/${id}`,
      categoryData
    );

    return data;
  },

  // kategoriyani o'chirish
  remove: async (id) => {

    const { data } = await Api.delete(`/categories/${id}`);

    return data;
  },
};

// boshqa fayllarda ishlatish uchun export qilamiz
export default CategoryService;