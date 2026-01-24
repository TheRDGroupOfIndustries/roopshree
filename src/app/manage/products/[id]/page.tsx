

import ProductForm from "@/Components/admin/ProductForm";
import prisma from "@/lib/prisma";




export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const product = await prisma.products.findFirst({
    where: {
      id: id,
    },
    include: {
      stock: true,
    },
  })
  console.log("server product: ", product)
  return (
    <ProductForm id={id} mode="update" product={product} />
  );
};

