import Hero from "./sections/Hero";
import Categories from "./sections/Categories";
import ProductSection from "./sections/ProductSection";
import SellerSection from "./sections/SellerSection";
import { useSearchParams } from "react-router-dom";
import { useGetProfile } from "@/hooks/useGetProfile";

const Home = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const getProfile = useGetProfile();
  if (token) {
    localStorage.setItem("token", token);
    // const decodedToken = jwtDecode(token) as Token;
    getProfile(token);
    window.history.replaceState({}, document.title, "/");
  }

  return (
    <div className="flex flex-col gap-5">
      <Hero />

      <Categories />

      <ProductSection title="Sản phẩm mới đăng" />
      <ProductSection title="Sản phẩm bán chạy nhất" />

      <SellerSection />
    </div>
  );
};

export default Home;
