import type { Route } from "./+types/accumulatePoints";
import AccumulatePoints from "~/pages/admin/promotion/AccumulatePoints";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý tích điểm" },
    { name: "Tích điểm", content: "Phê La!" },
  ];
}

export default function HomePage() {
  return <AccumulatePoints />;
}
