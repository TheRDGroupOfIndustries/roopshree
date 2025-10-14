import Checkout from "@/Components/Checkout";

export default async function Page({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = await params;
  console.log("product id", productId);

  return (
   <Checkout productId={productId} />
  );
}
