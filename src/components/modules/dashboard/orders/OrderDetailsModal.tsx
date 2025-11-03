"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/data";
import type { IOrderResponse } from "@/types/order";
import Image from "next/image";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrderResponse;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View complete information about this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-lg font-semibold text-foreground">
                {order.orderId}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {(() => {
                const status =
                  statusConfig[order.orderStatus as keyof typeof statusConfig];
                const Icon = status?.icon;
                return (
                  <Badge className={`${status?.color} border-0`}>
                    {Icon ? <Icon className="h-3 w-3" /> : null}
                    {status?.label}
                  </Badge>
                );
              })()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="text-foreground font-medium capitalize">
                {order.paymentStatus.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="text-foreground font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">
                  {order.user.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">District</p>
                <p className="text-foreground font-medium">
                  {order.user.district}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              Shipping Address
            </h3>
            <p className="text-foreground bg-muted p-3 rounded-md">
              {order.shippingAddress}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 border border-border rounded-md"
                >
                  {item.productImage?.imageUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.productImage.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Code: {item.product.code}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ৳{item.product.price}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      {item.productImage?.color && (
                        <span className="text-muted-foreground">
                          Color: {item.productImage.color}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Pricing */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground font-medium capitalize">
                  {order.paymentMethod.replace(/_/g, " ").toLowerCase()}
                </span>
              </div>

              {/* if payment is online, show transaction ID */}
              {order.paymentMethod === "ONLINE_PAYMENT" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Payment Provider
                  </span>
                  <span className="text-foreground font-medium">
                    {order.paymentProvider}
                  </span>
                </div>
              )}

              {order.paymentMethod === "ONLINE_PAYMENT" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="text-foreground font-medium">
                    {order.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">
                  ৳{order.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground font-medium">
                  ৳{order.shippingCost}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-semibold text-foreground">
                  Grand Total
                </span>
                <span className="text-lg font-semibold text-foreground">
                  ৳{order.grandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Download Invoice</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
