import { redirect } from "next/navigation";

export default function HomePage() {
  // 主页面默认进入个人工作台
  redirect("/workspace");
}
