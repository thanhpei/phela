import type { Route } from "./+types/promotions";
import Promotions from "~/pages/admin/promotion/Promotions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chương trình khuyến mãi" },
    { name: "Khuyến mãi", content: "Phê La!" },
  ];
}

export default function HomePage() {
  return <Promotions />;
}
