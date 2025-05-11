import type { Route } from "./+types/product";
import Present from "~/pages/admin/promotion/Present";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quà tặng Phê La" },
    { name: "Quà tặng", content: "Quà tặng Phê La!" },
  ];
}

export default function HomePage() {
  return <Present />;
}
