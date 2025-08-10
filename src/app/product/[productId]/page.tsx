import { useParams } from "next/navigation";

const ProductPage = async () => {
  // const product = await getProductById()
  const params = useParams();
  alert(params);
};

export default ProductPage;
