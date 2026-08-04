/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-unused-vars */
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { TProduct } from "@/types/product";

// interface DeleteProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onDelete: (productId: string) => void;
//   product: TProduct;
// }

// export function DeleteProductModal({
//   isOpen,
//   onClose,
//   onDelete,
//   product,
// }: DeleteProductModalProps) {
//   const handleDelete = () => {
//     onDelete(product.id);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Delete Product</DialogTitle>
//           <DialogDescription>
//             Are you sure you want to delete &quot;{product.name}&quot;? This
//             action cannot be undone.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex justify-end gap-3 mt-6">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete Product
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TProduct } from "@/types/product";
import {
  useDeleteProductMutation,
  useHardDeleteProductMutation,
} from "@/redux/features/product/product";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct;
  // refetchProducts: () => void;
}

type ModalStep = "choose" | "confirmPermanent";

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  // refetchProducts,
}: DeleteProductModalProps) {
  const [step, setStep] = useState<ModalStep>("choose");
  const [trashProduct, { isLoading: isTrashing }] = useDeleteProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] =
    useHardDeleteProductMutation();

  const isBusy = isTrashing || isDeleting;

  const resetAndClose = () => {
    setStep("choose");
    onClose();
  };

  const handleMoveToTrash = async () => {
    const toastId = toast.loading("Moving to trash...");
    try {
      await trashProduct(product.id).unwrap();
      toast.success(`"${product.name}" moved to trash`, { id: toastId });
      // refetchProducts();
      resetAndClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to move product to trash", {
        id: toastId,
      });
    }
  };

  const handlePermanentDelete = async () => {
    const toastId = toast.loading("Permanently deleting...");
    try {
      await deleteProduct(product.id).unwrap();
      toast.success(`"${product.name}" permanently deleted`, { id: toastId });
      // refetchProducts();
      resetAndClose();
    } catch (err: any) {
      // console.log(err);
      toast.error(err?.data?.message || "Failed to delete product", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-md">
        {step === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                What would you like to do with &quot;{product.name}&quot;?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">Move to Trash</p>
                <p className="text-sm text-muted-foreground">
                  Hides the product from listings. You can restore it later.
                  Images stay on Cloudinary.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isBusy}
                  onClick={handleMoveToTrash}
                >
                  {isTrashing ? "Moving..." : "Move to Trash"}
                </Button>
              </div>

              <div className="rounded-lg border border-red-200 p-4 space-y-2 bg-red-50">
                <p className="text-sm font-medium text-red-700 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Permanently Delete
                </p>
                <p className="text-sm text-red-700/80">
                  Deletes the product and all its images from Cloudinary. This
                  cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isBusy}
                  onClick={() => setStep("confirmPermanent")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Permanently Delete...
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={resetAndClose} disabled={isBusy}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-700">
                Confirm Permanent Deletion
              </DialogTitle>
              <DialogDescription>
                This will permanently delete &quot;{product.name}&quot; and
                remove all its images from Cloudinary. This action{" "}
                <strong>cannot be undone</strong>. Are you absolutely sure?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep("choose")}
                disabled={isDeleting}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handlePermanentDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
