"use client";

import "../globals.css";
import type React from "react";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/dashboard/ui/sidebar";
import { Button } from "@/components/dashboard/ui/button";
import { IconPlus, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
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
import { Label } from "@/components/dashboard/ui/label";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Textarea } from "@/components/dashboard/ui/textarea";
import { Switch } from "@/components/dashboard/ui/switch";
import { toast } from "sonner";
import { productApi, type Product, type Asset } from "@/lib/dashboard/apiproduct";
import { categoryApi, type Category } from "@/lib/dashboard/api";

export default function ProductsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    slug: "",
    author: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    status: "active",
    is_feature: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [productImages, setProductImages] = useState<Record<string, Asset[]>>(
    {}
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
      fetchAllProductImages(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getParentCategories({ limit: 100 });
      setCategories(response.listCate);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProductImages = async (products: Product[]) => {
    const imagesMap: Record<string, Asset[]> = {};

    await Promise.all(
      products.map(async (product) => {
        try {
          const assets = await productApi.getProductAssets(product._id);
          imagesMap[product._id] = assets;
        } catch (error) {
          console.error(
            `Error fetching images for product ${product._id}:`,
            error
          );
          imagesMap[product._id] = [];
        }
      })
    );

    setProductImages(imagesMap);
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.quantity > 0).length,
    outOfStock: products.filter((p) => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      title: "",
      slug: "",
      author: "",
      description: "",
      price: "",
      discount: "",
      quantity: "",
      status: "active",
      is_feature: false,
    });
    setSelectedImages([]);
    setAttributes([]);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const handleAdd = async () => {
    try {
      if (
        !formData.category_id ||
        !formData.title ||
        !formData.slug ||
        !formData.author ||
        !formData.price ||
        !formData.quantity
      ) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Slug, Tác giả, Danh mục, Giá, Số lượng)"
        );
        return;
      }

      if (Number(formData.price) < 0) {
        toast.error("Giá phải lớn hơn hoặc bằng 0");
        return;
      }

      if (Number(formData.quantity) < 0) {
        toast.error("Số lượng phải lớn hơn hoặc bằng 0");
        return;
      }

      if (
        formData.discount &&
        (Number(formData.discount) < 0 || Number(formData.discount) > 100)
      ) {
        toast.error("Giảm giá phải từ 0 đến 100%");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug.toLowerCase()); // Ensure slug is lowercase
      formDataToSend.append("author", formData.author);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || "0");
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("status", formData.status); // status is "active" or "inactive"
      formDataToSend.append("is_feature", formData.is_feature.toString());

      selectedImages.forEach((image) => {
        formDataToSend.append("files", image);
      });

      // Add attributes as JSON
      if (attributes.length > 0) {
        formDataToSend.append("attributes", JSON.stringify(attributes));
      }

      await productApi.createProduct(formDataToSend);
      toast.success("Đã thêm sản phẩm mới thành công!");
      setIsAddOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm sản phẩm");
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;

    try {
      if (
        !formData.category_id ||
        !formData.title ||
        !formData.slug ||
        !formData.author ||
        !formData.price ||
        !formData.quantity
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      if (Number(formData.price) < 0) {
        toast.error("Giá phải lớn hơn hoặc bằng 0");
        return;
      }

      if (Number(formData.quantity) < 0) {
        toast.error("Số lượng phải lớn hơn hoặc bằng 0");
        return;
      }

      if (
        formData.discount &&
        (Number(formData.discount) < 0 || Number(formData.discount) > 100)
      ) {
        toast.error("Giảm giá phải từ 0 đến 100%");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug.toLowerCase());
      formDataToSend.append("author", formData.author);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || "0");
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("is_feature", formData.is_feature.toString());

      selectedImages.forEach((image) => {
        formDataToSend.append("files", image);
      });

      // Add attributes as JSON
      if (attributes.length > 0) {
        formDataToSend.append("attributes", JSON.stringify(attributes));
      }

      await productApi.updateProduct(selectedProduct.slug, formDataToSend);
      toast.success("Đã cập nhật sản phẩm thành công!");
      setIsEditOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật sản phẩm");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productApi.deleteProduct(selectedProduct.slug);
      toast.success("Đã xóa sản phẩm thành công!");
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa sản phẩm");
    }
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      category_id: product.category_id,
      title: product.title,
      slug: product.slug,
      author: product.author,
      description: product.description || "",
      price: product.price.toString(),
      discount: product.discount?.toString() || "",
      quantity: product.quantity.toString(),
      status: product.status,
      is_feature: product.is_feature,
    });
    setSelectedImages([]);
    setAttributes([]);
    setIsEditOpen(true);
  };

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "N/A";
  };

  const getProductImage = (productId: string): string | null => {
    const assets = productImages[productId];
    if (assets && assets.length > 0) {
      return assets[0].path;
    }
    return null;
  };

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
                  <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                  <p className="text-muted-foreground">
                    Quản lý và theo dõi tất cả sản phẩm trong cửa hàng
                  </p>
                </div>
                <Button
                  className="gap-2"
                  onClick={() => {
                    resetForm();
                    setIsAddOpen(true);
                  }}
                >
                  <IconPlus className="size-4" />
                  Thêm sản phẩm
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tổng sản phẩm</CardDescription>
                    <CardTitle className="text-4xl">{stats.total}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Còn hàng</CardDescription>
                    <CardTitle className="text-4xl">{stats.inStock}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Hết hàng</CardDescription>
                    <CardTitle className="text-4xl">
                      {stats.outOfStock}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Giá trị tồn kho</CardDescription>
                    <CardTitle className="text-2xl text-red-600">
                      {stats.totalValue.toLocaleString()} VND
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách sản phẩm</CardTitle>
                  <CardDescription>
                    Xem và quản lý tất cả sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Đang tải...
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có sản phẩm nào
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hình ảnh</TableHead>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead>Tác giả</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Giá gốc</TableHead>
                          <TableHead>Giảm giá (%)</TableHead>
                          <TableHead>Giá sau giảm</TableHead>
                          <TableHead>Tồn kho</TableHead>
                          <TableHead>Đã bán</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => {
                          const finalPrice = product.discount
                            ? product.price -
                              (product.price * product.discount) / 100
                            : product.price;

                          return (
                            <TableRow key={product._id}>
                              <TableCell>
                                {getProductImage(product._id) ? (
                                  <img
                                    src={
                                      getProductImage(product._id) ||
                                      "/placeholder.svg"
                                    }
                                    alt={product.title}
                                    className="w-16 h-16 object-cover rounded border"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                                    No image
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {product.title}
                              </TableCell>
                              <TableCell>{product.author}</TableCell>
                              <TableCell>
                                {getCategoryName(product.category_id)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(product.price)}
                              </TableCell>
                              <TableCell>
                                {product.discount ? (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                    {product.discount}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {product.discount ? (
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                      {formatCurrency(finalPrice)}
                                    </span>
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatCurrency(product.price)}
                                    </span>
                                  </div>
                                ) : (
                                  <span>{formatCurrency(product.price)}</span>
                                )}
                              </TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>{product.sold || 0}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    product.status === "active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  {product.status === "active"
                                    ? "Hoạt động"
                                    : "Không hoạt động"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEdit(product)}
                                  >
                                    <IconPencil className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDelete(product)}
                                  >
                                    <IconTrash className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để thêm sản phẩm mới vào cửa hàng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tên sản phẩm"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="slug-san-pham"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Slug tự động tạo từ tên sản phẩm, bạn có thể chỉnh sửa
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">
                Tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="Nhập tên tác giả"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả sản phẩm"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_feature">Sản phẩm nổi bật</Label>
              <Switch
                id="is_feature"
                checked={formData.is_feature}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_feature: checked })
                }
              />
            </div>

            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="images">Hình ảnh sản phẩm</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="cursor-pointer"
              />
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attributes Section */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Thuộc tính sản phẩm</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttribute}
                >
                  <IconPlus className="size-4 mr-1" />
                  Thêm thuộc tính
                </Button>
              </div>
              {attributes.length > 0 && (
                <div className="space-y-2">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Tên thuộc tính (VD: Màu sắc)"
                        value={attr.key}
                        onChange={(e) =>
                          updateAttribute(index, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Giá trị (VD: Đỏ, Xanh)"
                        value={attr.value}
                        onChange={(e) =>
                          updateAttribute(index, "value", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdd}>Thêm sản phẩm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author">
                Tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-discount">Giảm giá (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-is_feature">Sản phẩm nổi bật</Label>
              <Switch
                id="edit-is_feature"
                checked={formData.is_feature}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_feature: checked })
                }
              />
            </div>

            {/* Image Upload Section for Edit */}
            <div className="grid gap-2">
              <Label htmlFor="edit-images">Thêm hình ảnh mới</Label>
              <Input
                id="edit-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="cursor-pointer"
              />
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attributes Section for Edit */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Thuộc tính sản phẩm</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttribute}
                >
                  <IconPlus className="size-4 mr-1" />
                  Thêm thuộc tính
                </Button>
              </div>
              {attributes.length > 0 && (
                <div className="space-y-2">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Tên thuộc tính"
                        value={attr.key}
                        onChange={(e) =>
                          updateAttribute(index, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Giá trị"
                        value={attr.value}
                        onChange={(e) =>
                          updateAttribute(index, "value", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.title}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
