import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Grid, Chip } from "@mui/material";
import { DataGrid, GridValueGetterParams, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { AdminLayout } from "../../../components/layouts";
import useSWR from "swr";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre completo", width: 300 },
  { field: "total", headerName: "Total orden", width: 200 },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: ({ row }: GridValueGetterParams) =>
      row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      ),
  },
  {
    field: "nProducts",
    headerName: "No.Productos",
    align: "center",
    width: 120,
  },
  {
    field: "check",
    headerName: "Ver Orden",
    renderCell: ({ row }: GridValueGetterParams) => (
      <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
        Ver Orden
      </a>
    ),
  },
  { field: "createdAt", headerName: "Fecha de creación", width: 200 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) {
    return <></>;
  }

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    nProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={"Ordenes"}
      subTitle={"Mantenimiento de las ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
