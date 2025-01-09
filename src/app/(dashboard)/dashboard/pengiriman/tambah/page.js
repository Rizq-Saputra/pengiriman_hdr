import ShippingForm from "../shipping-form";

export default function AddShipment() {
  return (
  <ShippingForm mode="add" initialData={{ items: [] }} />
  );
}