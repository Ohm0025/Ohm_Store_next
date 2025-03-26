"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType } from "@/types/category";
import { MoreVertical, Pencil, RefreshCcw, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditCategoryModal from "./edit-category-modal";
import DeleteCatModal from "./deleteCatModal";
import ReactiveCatModal from "./reactive-cat-modal";

interface CategoryListProps {
  categories: CategoryType[];
}

const CategoryList = ({ categories }: CategoryListProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredCategories, setFilteredCategories] =
    useState<CategoryType[]>(categories);

  const [isEditModal, setIsEditModal] = useState(false);
  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditModal(true);
  };
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const handleDeleteClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteModal(true);
  };

  const [isReactiveModal, setIsReactiveModal] = useState(false);
  const handleReactiveClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsReactiveModal(true);
  };

  const handleTabActive = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    let result = [...categories];
    if (activeTab === "active") {
      result = result.filter((c) => c.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((c) => c.status === "Inactive");
    }
    if (searchTerm) {
      result = result.filter((c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCategories(result);
  }, [categories, activeTab, searchTerm]);

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Category List</CardTitle>
          <Tabs value={activeTab} onValueChange={handleTabActive}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-2 text-muted-foreground"
              />
              <Input
                onChange={handleSearchTerm}
                value={searchTerm}
                placeholder="Search Category..."
                className="pl-8"
              />
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">
              <div className="col-span-1 hidden sm:block">No.</div>
              <div className="col-span-6 sm:col-span-5">Category name</div>
              <div className="col-span-2 text-center hidden sm:block">
                Products
              </div>
              <div className="col-span-3 sm:col-span-2 text-center">Status</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[420px]">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  className="grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                  key={index}>
                  <div className="col-span-1 hidden sm:block">{index + 1}</div>
                  <div className="col-span-6 sm:col-span-5 truncate pr-2">
                    {category.name}
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    {0}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-center">
                    <Badge
                      className="px-1 sm:px-2"
                      variant={
                        category.status === "Active" ? "default" : "destructive"
                      }>
                      {category.status}
                    </Badge>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    {/* mobile action */}
                    <div className="flex justify-end gap-1 md:hidden">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="size-7"
                        onClick={() => handleEditClick(category)}>
                        <Pencil size={15} />
                      </Button>
                      {category.status === "Active" ? (
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="size-7"
                          onClick={() => handleDeleteClick(category)}>
                          <Trash2 size={15} />
                        </Button>
                      ) : (
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="size-7"
                          onClick={() => handleReactiveClick(category)}>
                          <RefreshCcw size={15} />
                        </Button>
                      )}
                    </div>
                    {/* desktop action */}
                    <div className="hidden md:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(category)}>
                            <Pencil size={15} />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {category.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(category)}>
                              <Trash2 size={15} className="text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleReactiveClick(category)}>
                              <RefreshCcw
                                size={15}
                                className="text-destructive"
                              />
                              <span className="text-destructive">Reactive</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No category found matching
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <EditCategoryModal
        open={isEditModal}
        onOpenChange={setIsEditModal}
        category={selectedCategory}
      />

      <DeleteCatModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        category={selectedCategory}
      />

      <ReactiveCatModal
        open={isReactiveModal}
        onOpenChange={setIsReactiveModal}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryList;
