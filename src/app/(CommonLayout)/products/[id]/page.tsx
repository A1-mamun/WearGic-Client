import SingleProduct from "@/components/modules/product/SingleProduct";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <SingleProduct id={id} />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
