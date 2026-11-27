import CategoryCards from "@/components/category/CategoryCards";
import AdSlot from "@/components/ads/AdSlot";

export default function Home() {
  return (
    <main>
      <h1 style={{ textAlign: "center", padding: "32px 0" }}>お嬢様研究所</h1>
      <CategoryCards />
      <AdSlot slot="top-below-map" />    </main>
  );
}
