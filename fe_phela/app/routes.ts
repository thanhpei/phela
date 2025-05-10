import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";
import { Children } from "react";

const customerRoutes: RouteConfig = [
    index("routes/CustomerDashboard.tsx"),

    // Sản phẩm
    route("san-pham", "routes/product.tsx"),
    route("order", "routes/order.tsx"),

    // Câu chuyện thương hiệu
    route("ve-chung-toi", "routes/aboutUs.tsx"),
    route("phong-cach-khac-biet-tai-phe-la", "routes/differentStyle.tsx"),
    route("category/tran-chau-o-long", "routes/olongPearl.tsx"),

    // Tin tức
    route("tin-tuc", "routes/news.tsx"),
    route("uu-dai", "routes/endow.tsx"),
    route("su-kien", "routes/event.tsx"),

    // Cửa hàng
    route("he-thong-cua-hang", "routes/storePage.tsx"),

    // Tuyển dụng
    route("tuyen-dung", "routes/recruitment.tsx"),
    route("khoi-van-phong", "routes/officeBlock.tsx"),
    route("khoi-cua-hang", "routes/blockOfShops.tsx"),

    // Thẻ thành viên
    route("dieu-khoan-va-dieu-kien-su-dung-the-thanh-vien-phe-la", "routes/clause.tsx"),

    // Liên hệ
    route("lien-he", "routes/contact.tsx"),

    // Chuyện đặc sản
    route("chuyendacsan", "routes/specialtyStory.tsx"),

    //Tài khoản
    route("login-register", "routes/loginRegisterCus.tsx"),
];

const adminRoutes: RouteConfig = [
      index("routes/loginRegisterAdmin.tsx"),
      route("dashboard", "routes/AdminDashboard.tsx"),
      route("san-pham", "routes/productManage.tsx"),
];

// Try creating the routes without the children property
export default [
  // Route cho giao diện admin
  {
    ...route("admin", "root.tsx"),
    children: adminRoutes,
    id: "admin-root"
  },

  // Route cho giao diện customer
  {
    ...route("/", "root.tsx"),
    children: customerRoutes,
    id: "customer-root"
  },
] satisfies RouteConfig;