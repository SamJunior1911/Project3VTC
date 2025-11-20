"use client";

import "../globals.css";
import type React from "react";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/dashboard/ui/sidebar";
import { Button } from "@/components/dashboard/ui/button";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Label } from "@/components/dashboard/ui/label";
import { Input } from "@/components/dashboard/ui/input";
import { Textarea } from "@/components/dashboard/ui/textarea";
import { toast } from "sonner";
import { categoryApi, type Category } from "@/lib/dashboard/api";

const ITEMS_PER_PAGE = 6;

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("parent");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCategories, setTotalCategories] = useState(0);
  const [activeCategories, setActiveCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [parentPage, setParentPage] = useState(1);
  const [subcategoryPage, setSubcategoryPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
    parentId: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchParentCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getParentCategories({
        page: 1,
        limit: 100,
      });
      setCategories(response.listCate);
      setTotalCategories(response.pagination.total);

      const active = response.listCate.filter((cat) => cat.status).length;
      setActiveCategories(active);

      const total = response.listCate.reduce(
        (sum, cat) => sum + (cat.childrenCount || 0),
        0
      );
      setTotalProducts(total);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await categoryApi.getSubcategories({
        page: 1,
        limit: 100,
      });
      console.log("[v0] Subcategories response:", response.listCate);
      if (response.listCate.length > 0) {
        console.log(
          "[v0] First subcategory parentId:",
          response.listCate[0].parentId
        );
      }
      setSubcategories(response.listCate);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await categoryApi.getParentCategories({
        page: 1,
        limit: 100,
      });
      console.log("[v0] Parent categories:", response.listCate);
      setParentCategories(response.listCate);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Tên danh mục là bắt buộc");
        return;
      }

      if (activeTab === "subcategory") {
        if (parentCategories.length === 0) {
          toast.error("Vui lòng tạo danh mục cha trước khi thêm danh mục con");
          return;
        }
        if (!formData.parentId) {
          toast.error("Vui lòng chọn danh mục cha");
          return;
        }
      }

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
        status: formData.status !== undefined ? formData.status : true,
        parentId: activeTab === "subcategory" ? formData.parentId : null,
      };

      await categoryApi.createCategory(categoryData);

      toast.success(
        `Đã thêm ${
          activeTab === "parent" ? "danh mục" : "danh mục con"
        } mới thành công!`
      );
      setIsAddOpen(false);
      setFormData({ name: "", description: "", status: true, parentId: "" });

      await fetchCategories();
      await fetchSubcategories();
      await fetchParentCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(
        error.message ||
          `Không thể thêm ${
            activeTab === "parent" ? "danh mục" : "danh mục con"
          }`
      );
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedCategory || !formData.name.trim()) {
        toast.error("Vui lòng nhập tên danh mục");
        return;
      }

      const updateData: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
      };

      if (activeTab === "subcategory" && formData.parentId) {
        updateData.parentId = formData.parentId;
      }

      await categoryApi.updateCategory(selectedCategory.slug, updateData);

      toast.success(
        `Đã cập nhật ${
          activeTab === "parent" ? "danh mục" : "danh mục con"
        } thành công!`
      );
      setIsEditOpen(false);

      await fetchCategories();
      await fetchSubcategories();
      await fetchParentCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(
        error.message ||
          `Không thể cập nhật ${
            activeTab === "parent" ? "danh mục" : "danh mục con"
          }`
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedCategory) return;

      await categoryApi.deleteCategory(selectedCategory.slug);

      toast.success(
        `Đã xóa ${
          activeTab === "parent" ? "danh mục" : "danh mục con"
        } thành công!`
      );
      setIsDeleteOpen(false);

      await fetchCategories();
      await fetchSubcategories();
      await fetchParentCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(
        error.message ||
          `Không thể xóa ${
            activeTab === "parent" ? "danh mục" : "danh mục con"
          }`
      );
    }
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status,
      parentId: category.parentId || "",
    });
    setIsEditOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const openAdd = () => {
    setFormData({ name: "", description: "", status: true, parentId: "" });
    setIsAddOpen(true);
  };

  const getParentName = (
    parentId:
      | string
      | { _id: string; name: string; slug: string }
      | null
      | undefined
  ) => {
    console.log("[v0] getParentName called with:", parentId);
    console.log("[v0] Type of parentId:", typeof parentId);
    console.log(
      "[v0] Available parent categories:",
      parentCategories.map((p) => ({ id: p._id, name: p.name }))
    );

    if (!parentId) return "N/A";

    // If parentId is an object (populated), return its name
    if (typeof parentId === "object" && "name" in parentId) {
      console.log("[v0] Found populated parent:", parentId.name);
      return parentId.name;
    }

    // If parentId is a string, look it up in the parent categories list
    if (typeof parentId === "string") {
      const parent = parentCategories.find(
        (cat) => cat._id === parentId || cat._id.toString() === parentId
      );
      console.log(
        "[v0] Looking for parentId:",
        parentId,
        "Found:",
        parent?.name
      );
      return parent?.name || "N/A";
    }

    return "N/A";
  };

  const parentTotalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const parentStartIndex = (parentPage - 1) * ITEMS_PER_PAGE;
  const parentEndIndex = parentStartIndex + ITEMS_PER_PAGE;
  const paginatedParentCategories = categories.slice(
    parentStartIndex,
    parentEndIndex
  );

  const subcategoryTotalPages = Math.ceil(
    subcategories.length / ITEMS_PER_PAGE
  );
  const subcategoryStartIndex = (subcategoryPage - 1) * ITEMS_PER_PAGE;
  const subcategoryEndIndex = subcategoryStartIndex + ITEMS_PER_PAGE;
  const paginatedSubcategories = subcategories.slice(
    subcategoryStartIndex,
    subcategoryEndIndex
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
                  <p className="text-muted-foreground">
                    Tổ chức và quản lý các danh mục sản phẩm
                  </p>
                </div>
                <Button className="gap-2" onClick={openAdd}>
                  <IconPlus className="size-4" />
                  {activeTab === "parent"
                    ? "Thêm danh mục"
                    : "Thêm danh mục con"}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tổng danh mục</CardDescription>
                    <CardTitle className="text-4xl">
                      {totalCategories}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Danh mục hoạt động</CardDescription>
                    <CardTitle className="text-4xl">
                      {activeCategories}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tổng danh mục con</CardDescription>
                    <CardTitle className="text-4xl">{totalProducts}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="parent">Danh mục cha</TabsTrigger>
                  <TabsTrigger value="subcategory">Danh mục con</TabsTrigger>
                </TabsList>

                <TabsContent value="parent">
                  <Card>
                    <CardHeader>
                      <CardTitle>Danh sách danh mục cha</CardTitle>
                      <CardDescription>
                        Xem và quản lý tất cả danh mục cha
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Đang tải...
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Chưa có danh mục nào
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tên danh mục</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Danh mục con</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">
                                  Thao tác
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedParentCategories.map((category) => (
                                <TableRow key={category._id}>
                                  <TableCell className="font-semibold">
                                    {category.name}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {category.slug}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {category.description || "Không có mô tả"}
                                  </TableCell>
                                  <TableCell>
                                    {category.childrenCount || 0} danh mục
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        category.status
                                          ? "bg-green-50 text-green-700"
                                          : "bg-red-50 text-red-700"
                                      }`}
                                    >
                                      {category.status
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(category)}
                                      >
                                        <IconPencil className="size-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDelete(category)}
                                      >
                                        <IconTrash className="size-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          {parentTotalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-muted-foreground">
                                Trang {parentPage} / {parentTotalPages} (
                                {categories.length} danh mục)
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setParentPage(Math.max(1, parentPage - 1))
                                  }
                                  disabled={parentPage === 1}
                                >
                                  <IconChevronLeft className="size-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setParentPage(
                                      Math.min(parentTotalPages, parentPage + 1)
                                    )
                                  }
                                  disabled={parentPage === parentTotalPages}
                                >
                                  <IconChevronRight className="size-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subcategory">
                  <Card>
                    <CardHeader>
                      <CardTitle>Danh sách danh mục con</CardTitle>
                      <CardDescription>
                        Xem và quản lý tất cả danh mục con
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Đang tải...
                        </div>
                      ) : subcategories.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {parentCategories.length === 0
                            ? "Vui lòng tạo danh mục cha trước khi thêm danh mục con"
                            : "Chưa có danh mục con nào"}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tên danh mục con</TableHead>
                                <TableHead>Danh mục cha</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">
                                  Thao tác
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedSubcategories.map((subcategory) => (
                                <TableRow key={subcategory._id}>
                                  <TableCell className="font-semibold">
                                    {subcategory.name}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {subcategory.parentId
                                      ? getParentName(subcategory.parentId)
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {subcategory.slug}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {subcategory.description ||
                                      "Không có mô tả"}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        subcategory.status
                                          ? "bg-green-50 text-green-700"
                                          : "bg-red-50 text-red-700"
                                      }`}
                                    >
                                      {subcategory.status
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(subcategory)}
                                      >
                                        <IconPencil className="size-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDelete(subcategory)}
                                      >
                                        <IconTrash className="size-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          {subcategoryTotalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-muted-foreground">
                                Trang {subcategoryPage} /{" "}
                                {subcategoryTotalPages} ({subcategories.length}{" "}
                                danh mục con)
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSubcategoryPage(
                                      Math.max(1, subcategoryPage - 1)
                                    )
                                  }
                                  disabled={subcategoryPage === 1}
                                >
                                  <IconChevronLeft className="size-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSubcategoryPage(
                                      Math.min(
                                        subcategoryTotalPages,
                                        subcategoryPage + 1
                                      )
                                    )
                                  }
                                  disabled={
                                    subcategoryPage === subcategoryTotalPages
                                  }
                                >
                                  <IconChevronRight className="size-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === "parent"
                ? "Thêm danh mục mới"
                : "Thêm danh mục con mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo{" "}
              {activeTab === "parent" ? "danh mục" : "danh mục con"} mới
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === "subcategory" && parentCategories.length === 0 && (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                Chưa có danh mục cha. Vui lòng tạo danh mục cha trước.
              </div>
            )}
            {activeTab === "subcategory" && parentCategories.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="parent">
                  Danh mục cha <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map((parent) => (
                      <SelectItem key={parent._id} value={parent._id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Tên {activeTab === "parent" ? "danh mục" : "danh mục con"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={`Nhập tên ${
                  activeTab === "parent" ? "danh mục" : "danh mục con"
                }`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả (tùy chọn)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleAdd}
              disabled={
                activeTab === "subcategory" && parentCategories.length === 0
              }
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Chỉnh sửa {activeTab === "parent" ? "danh mục" : "danh mục con"}
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin{" "}
              {activeTab === "parent" ? "danh mục" : "danh mục con"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === "subcategory" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-parent">
                  Danh mục cha <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.map((parent) => (
                      <SelectItem key={parent._id} value={parent._id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Tên {activeTab === "parent" ? "danh mục" : "danh mục con"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Xác nhận xóa{" "}
              {activeTab === "parent" ? "danh mục" : "danh mục con"}
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa{" "}
              {activeTab === "parent" ? "danh mục" : "danh mục con"} "
              {selectedCategory?.name}
              "?
              {activeTab === "parent" &&
                " Tất cả danh mục con trong danh mục này có thể bị ảnh hưởng."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
