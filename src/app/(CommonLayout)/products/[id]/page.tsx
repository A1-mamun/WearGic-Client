import SingleProduct from "@/components/modules/product/SingleProduct";

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return <SingleProduct id={id} />;
};

export default ProductDetailsPage;
