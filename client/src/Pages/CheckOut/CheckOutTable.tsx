import { Span } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react";
import useCartStore from "../Cart/cartStore";

const CheckOutTable = () => {
  const { cartItems,getTotalPrice } = useCartStore();

  return (
    <Table.Root size="sm" variant="outline">
      <Table.ColumnGroup>
        <Table.Column />
        <Table.Column />
        <Table.Column />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row
          fontSize={{
            base: "12px",
            sm: "16px",
            md: "18px",
            lg: "22px",
          }}
        >
          <Table.ColumnHeader>Order</Table.ColumnHeader>
          <Table.ColumnHeader>Size</Table.ColumnHeader>
          <Table.ColumnHeader>Quantity</Table.ColumnHeader>
          <Table.ColumnHeader>Price</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {cartItems.map((item) => (
          <Table.Row
            key={item.product.id}
            fontSize={{
              base: "8px",
              sm: "14px",
              md: "14px",
              lg: "18px",
            }}
          >
            <Table.Cell>
              {item.product.productName} <Span color="#a800b7"></Span>
            </Table.Cell>
            <Table.Cell>{item.currentShoseSize}</Table.Cell>
            <Table.Cell>{item.currentShoseQuantity}</Table.Cell>
            <Table.Cell>{item.product.productPrice}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer
        height={"70px"}
        fontSize={{
          base: "12px",
          sm: "16px",
          md: "18px",
          lg: "22px",
        }}
        bg={"#f3f1f1"}
      >
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell
            fontSize={{
              base: "12px",
              sm: "16px",
              md: "18px",
              lg: "22px",
            }}
          >
            {getTotalPrice(cartItems)}$
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  );
};

export default CheckOutTable;
