/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { TProduct } from "@/types/product";
import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsTableRowProps {
  product: TProduct;
  // onEdit: (product: TProduct) => void;
  onDelete: (product: TProduct) => void;
  onView: (product: TProduct) => void;
}

// const Row = ({ product, onEdit, onDelete, onView }: ProductsTableRowProps) => {
const Row = ({ product, onDelete, onView }: ProductsTableRowProps) => {
  const coverImage = product.coverImage;

  // console.log("Primary Image: ", primaryImage);

  const totalStock = product.productImages.reduce(
    (total, image) => total + image.stock,
    0
  );
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Image
          src={coverImage.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-10 h-10 rounded-md object-cover"
          width={40}
          height={40}
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell className="font-semibold text-green-600">
        {product.price}
      </TableCell>
      <TableCell>
        {product.originalPrice ? (
          <span className="text-muted-foreground line-through">
            {product.originalPrice}
          </span>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <Badge variant={totalStock > 0 ? "default" : "destructive"}>
          {totalStock}
        </Badge>
      </TableCell>
      <TableCell>
        {product.gender ? (
          <Badge variant="outline">{product.gender}</Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {product.isNew && <Badge variant="secondary">New</Badge>}
          <Badge variant={totalStock > 0 ? "default" : "destructive"}>
            {totalStock > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(product)}>
            <Eye className="h-4 w-4" />
          </Button>
          {/* <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button> */}
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Row;
