import MainHead from "@/components/PublicCompontents/MainTitle";
import {
  Box,
  Button,
  Menu,
  SimpleGrid,
  Portal,
  Text,
  Textarea,
  Field,
  Input,
  Image,
  Checkbox,
} from "@chakra-ui/react";

import { Toaster, toaster } from "@/components/ui/toaster";
import { v4 as uuidv4 } from "uuid";
import type { ChangeEvent } from "react";
import { useState } from "react";
import useProductAdmin from "@/Admin/Hooks/useProductAdmin";

interface Props {
  title: string;
}

const AddProduct = ({ title }: Props) => {
  const {
    Sizes,
    addProduct,
    categories,
    currenntProductData,
    editProduct,
    genders,
    newProduct,
    setNewProduct,
    id,
  } = useProductAdmin();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const additionalImageFields = [
    { fileKey: "rearViewFile", previewKey: "rearView", label: "Select Rear View Image" },
    { fileKey: "topViewFile", previewKey: "topView", label: "Select Top View Image" },
    { fileKey: "sideView1File", previewKey: "sideView1", label: "Select Side View 1 Image" },
    { fileKey: "sideView2File", previewKey: "sideView2", label: "Select Side View 2 Image" },
  ] as const;

  return (
    <>
      <Toaster />

      <MainHead
        title={title}
      />

      <Box padding={4}>
        <form>
          {/* MAIN GRID */}
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 2 }}
            gap={{ base: 8, sm: 10, md: 16, lg: 20 }}
          >
            {/* LEFT SIDE */}
            <Box>
              {/* PRODUCT NAME */}
              <Field.Root>
                <Input
                  value={newProduct.productName}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
                  }
                  required
                  marginBottom={4}
                  border="1px solid #a800b7"
                  placeholder="Product Name"
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "16px",
                    lg: "18px",
                  }}
                />
                <Field.ErrorText />
              </Field.Root>

              {/* PRODUCT PRICE */}
              <Field.Root>
                <Input
                  required
                  value={newProduct.productPrice}
                  marginBottom={4}
                  border="1px solid #a800b7"
                  placeholder="Product Price"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewProduct({
                      ...newProduct,
                      productPrice: e.target.value,
                    })
                  }
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "16px",
                    lg: "18px",
                  }}
                />
                <Field.ErrorText />
              </Field.Root>

              {/* IMAGE UPLOAD */}
              <Field.Root>
                <label
                  style={{
                    width: "80%",
                    display: "inline-block",
                    padding: "10px",
                    marginBottom: "20px",
                    backgroundColor: "#facfeb",
                    color: "black",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  htmlFor="personal"
                >
                  Select Shoes Image ▼
                </label>

                {(newProduct.productImg || id) && (
                  <Image
                    marginLeft={1}
                    display="inline-block"
                    width="200px"
                    height="200px"
                    src={newProduct.productImg}
                    alt="error"
                  />
                )}

                <Input
                  id="personal"
                  type="file"
                  border="1px solid #a800b7"
                  width="20%"
                  display="none"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageURL = URL.createObjectURL(file);
                    setImageFile(file);
                    setNewProduct({ ...newProduct, productImg: imageURL, imageFile: file });
                  }}
                />
              </Field.Root>
            </Box>

            {/* RIGHT SIDE */}
            <Box marginTop={{md:-10}}>
              <Text
                fontSize={{ base: "14px", sm: "16px", md: "18px", lg: "20px" }}
                fontWeight="bold"
              >
                Sizes :
              </Text>

              <Box
                padding={2}
                marginTop={2}
                marginBottom={4}
                border="1px solid #a800b7"
              >
                {Sizes.map((size) => (
                  <Checkbox.Root
                    checked={newProduct.sizesAndQuantities
                      .map((s) => s.Size)
                      .includes(size)}
                    onCheckedChange={() => {
                      if (
                        !newProduct.sizesAndQuantities
                          .map((s) => s.Size)
                          .includes(size)
                      ) {
                        setNewProduct({
                          ...newProduct,
                          sizesAndQuantities: [
                            ...newProduct.sizesAndQuantities,
                            { Size: size, quantity: 1 },
                          ],
                        });
                      } else {
                        setNewProduct({
                          ...newProduct,
                          sizesAndQuantities:
                            newProduct.sizesAndQuantities.filter(
                              (s) => s.Size !== size
                            ),
                        });
                      }
                    }}
                    key={size}
                    margin={2}
                    variant="subtle"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label
                      fontSize={{
                        base: "12px",
                        sm: "14px",
                        md: "16px",
                        lg: "18px",
                      }}
                    >
                      {size}
                    </Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Box>

              {/* QUANTITIES GRID */}
              <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap={4}>
                {newProduct.sizesAndQuantities.map((s) => (
                  <Field.Root key={s.Size}>
                    <Text
                      fontSize={{
                        base: "12px",
                        sm: "14px",
                        md: "16px",
                        lg: "18px",
                      }}
                    >
                      quantity for Size : {s.Size}
                    </Text>

                    <Input
                      required
                      width="50%"
                      value={s.quantity}
                      type="number"
                      min={1}
                      marginBottom={4}
                      border="1px solid #a800b7"
                      fontSize={{
                        base: "12px",
                        sm: "14px",
                        md: "16px",
                        lg: "18px",
                      }}
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          sizesAndQuantities: [
                            ...newProduct.sizesAndQuantities.map((si) =>
                              si.Size === s.Size
                                ? { ...si, quantity: parseInt(e.target.value) }
                                : { ...si }
                            ),
                          ],
                        });
                      }}
                    />
                    <Field.ErrorText />
                  </Field.Root>
                ))}
              </SimpleGrid>

              {/* DESCRIPTION */}
              <Field.Root>
                <Textarea
                  required
                  value={newProduct.productDescription}
                  marginBottom={4}
                  placeholder="Product Description"
                  outline="1px solid #a800b7"
                  fontSize={{
                    base: "12px",
                    sm: "14px",
                    md: "16px",
                    lg: "18px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    setNewProduct({
                      ...newProduct,
                      productDescription: target.value,
                    });
                  }}
                />
                <Field.ErrorText />
              </Field.Root>

              {/* CATEGORY MENU */}
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    color="#777"
                    border="1px solid #a800b7"
                    marginRight={4}
                    fontSize={{
                      base: "12px",
                      sm: "14px",
                      md: "16px",
                      lg: "18px",
                    }}
                  >
                    {id ? currenntProductData?.category : newProduct.category}
                  </Button>
                </Menu.Trigger>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {categories.map((cat) => (
                        <Menu.Item
                          key={cat.value}
                          value={cat.value}
                          fontSize={{
                            base: "12px",
                            sm: "14px",
                            md: "16px",
                          }}
                          onClick={() =>
                            setNewProduct({
                              ...newProduct,
                              category: cat.value,
                            })
                          }
                        >
                          {cat.label}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              {/* GENDER MENU */}
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    color="#777"
                    border="1px solid #a800b7"
                    fontSize={{
                      base: "12px",
                      sm: "14px",
                      md: "16px",
                      lg: "18px",
                    }}
                  >
                    {id ? currenntProductData?.gender : newProduct.gender}
                  </Button>
                </Menu.Trigger>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {genders.map((gender) => (
                        <Menu.Item
                          key={gender.value}
                          value={gender.value}
                          fontSize={{
                            base: "12px",
                            sm: "14px",
                            md: "16px",
                          }}
                          onClick={() =>
                            setNewProduct({
                              ...newProduct,
                              gender: gender.value,
                            })
                          }
                        >
                          {gender.label}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Box>
          </SimpleGrid>

          <Box marginTop={8} padding={4} border="1px solid #a800b7" borderRadius="md">
            <Text fontWeight="bold" marginBottom={3}>
              360° View Images (4 additional images)
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
              {additionalImageFields.map(({ fileKey, previewKey, label }) => (
                <Field.Root key={fileKey}>
                  <label
                    htmlFor={fileKey}
                    style={{
                      display: "block",
                      padding: "10px",
                      backgroundColor: "#facfeb",
                      color: "black",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {label}
                  </label>
                  {newProduct[previewKey] && (
                    <Image
                      marginTop={2}
                      width="100%"
                      height="140px"
                      objectFit="contain"
                      src={newProduct[previewKey]}
                      alt={label}
                    />
                  )}
                  <Input
                    id={fileKey}
                    type="file"
                    accept="image/*"
                    display="none"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const imageURL = URL.createObjectURL(file);
                      setNewProduct({
                        ...newProduct,
                        [fileKey]: file,
                        [previewKey]: imageURL,
                      });
                    }}
                  />
                </Field.Root>
              ))}
            </SimpleGrid>
          </Box>

          {/* SUBMIT BUTTON ALWAYS LAST */}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              try {
                if (id) {
                  await editProduct(id, { ...newProduct, imageFile });
                  toaster.create({ title: "One Shoe Edited successfully!", type: "success", duration: 5000 });
                } else {
                  await addProduct({ ...newProduct, imageFile });
                  toaster.create({ title: "One Shoe Added successfully!", type: "success", duration: 5000 });
                }
                setNewProduct({
                  id: uuidv4(), category: "Category", gender: "Gender", productDescription: "", productPrice: "",
                  productName: "", isDiscounted: false, isArchived: false, oldProductPrice: "", sizesAndQuantities: [],
                  href: "product/", productImg: undefined,
                  rearView: undefined, topView: undefined, sideView1: undefined, sideView2: undefined,
                  imageFile: undefined, rearViewFile: undefined, topViewFile: undefined, sideView1File: undefined, sideView2File: undefined,
                });
                setImageFile(undefined);
              } catch (error) {
                toaster.create({ title: error instanceof Error ? error.message : "Unable to save this product.", type: "error", duration: 5000 });
              }
            }}
            type="submit"
            bg="#7008e7"
            marginTop={6}
            color="white"
            fontSize={{ base: "14px", sm: "16px", md: "18px" }}
          >
            {title}
          </Button>
        </form>
      </Box>
    </>
  );
};

export default AddProduct;
