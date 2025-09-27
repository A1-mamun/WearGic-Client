/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TCategory } from "@/types/category";
import { Edit, Eye, Trash2 } from "lucide-react";

interface CategoriesTableProps {
  categories: TCategory[];
  onEdit: (category: TCategory) => void;
  onDelete: (category: TCategory) => void;
  onView: (category: TCategory) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  onView,
}: CategoriesTableProps) {
  if (categories?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{category.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(category)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
