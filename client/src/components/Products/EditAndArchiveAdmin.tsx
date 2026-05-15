import MainDialog from "@/Admin/components/MainDialog"
import { Button, HStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import type { Product } from "./Products Data/productsList"
import useProductStore from "./ProductStore"
interface Props{
    item:Product
}
const EditAndArchiveAdmin = ({item}:Props) => {

    const {archiveProduct} = useProductStore()
  return (
    <>
        <HStack
        justifyContent={"space-between"}
        width={"100%"}
        padding={{ base: 2, sm: 2 }}
        borderTop={"1px solid #6c14d0"}
    >
        <Button
        bg={"blue"}
        fontSize={{ base: 6, sm: 10, md: 12, lg: 15 }}
        width={{
            base: "20px",
            sm: "60px",
            md: "80px",
            lg: "100px",
        }}
        >
        <Link to={`/admin/editproduct/${item.id}`}>Edit</Link>
        </Button>

        <MainDialog
        id={item.id}
        parameter={item}
        completeTheProcess={(item) => archiveProduct(item)}
        theProces="Archive"
        >
        <Button
            fontSize={{ base: 6, sm: 10, md: 12, lg: 15 }}
            width={{
            base: "20px",
            sm: "60px",
            md: "80px",
            lg: "100px",
            }}
            bg={"red"}
        >
            Archive
        </Button>
        </MainDialog>
    </HStack>
    </>
  )
}

export default EditAndArchiveAdmin
