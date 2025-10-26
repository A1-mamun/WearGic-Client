/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IOrderResponse } from "@/types/order";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orderUpdateStatus, statusConfig } from "@/data";

interface ProductsTableRowProps {
  order: IOrderResponse;
  onUpdateStatus: (
    orderId: string,
    newStatus: IOrderResponse["orderStatus"]
  ) => void;
  onView: (order: IOrderResponse) => void;
}

const OrderRow = ({ order, onUpdateStatus, onView }: ProductsTableRowProps) => {
  return (
    <TableRow key={order.id}>
      <TableCell>{order.orderId}</TableCell>
      <TableCell className="font-medium">
        <p>{order.user.name}</p> <p className="text-xs">{order.user.phone}</p>
      </TableCell>
      <TableCell>{order.orderItems.length}</TableCell>
      <TableCell className="font-semibold text-green-600">
        {order.grandTotal}
      </TableCell>
      <TableCell className="">
        {(() => {
          const status =
            statusConfig[order.orderStatus as keyof typeof statusConfig];
          const Icon = status?.icon;
          return (
            <>
              <Badge className={`${status?.color} border-0`}>
                {Icon ? <Icon className="h-3 w-3" /> : null}
                {status?.label}
              </Badge>{" "}
            </>
          );
        })()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-secondary/50"
              title="Update status"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {orderUpdateStatus.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => onUpdateStatus(order.id, status.value)}
              >
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(order)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
