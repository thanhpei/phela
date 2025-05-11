import type { Route } from "./+types/discountCode";
import DiscountCode from "~/pages/admin/promotion/DiscountCode";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mã giảm giá" },
    { name: "Mã giảm", content: "Phê La!" },
  ];
}

export default function HomePage() {
  return <DiscountCode />;
}
