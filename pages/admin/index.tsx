import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { NextPage } from "next";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { SummaryCard } from "../../components/admin";
import { Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { DashboardResponse } from "../../interfaces";

const DashBoardPage: NextPage = () => {
  const { data, error } = useSWR<DashboardResponse>("/api/admin/dashboard", {
    refreshInterval: 30 * 1000, //30 segundos
  });
  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    let interval: any;
    if (data) {
      interval = setInterval(() => {
        setRefreshIn((prev) => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  if (!error && !data) {
    return <></>;
  }
  if (error) {
    console.log(error);
    return <Typography>Error al cargar</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    noPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsNoInventory,
    LowInventory,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryCard
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
          title={numberOfOrders}
          subTitle={"Ordenes Totales"}
        />

        <SummaryCard
          icon={<AttachMoneyOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={paidOrders}
          subTitle={"Ordenes Pagadas"}
        />

        <SummaryCard
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          title={noPaidOrders}
          subTitle={"Ordenes Pendientes"}
        />

        <SummaryCard
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfClients}
          subTitle={"Clientes"}
        />

        <SummaryCard
          icon={<CategoryOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfProducts}
          subTitle={"Productos"}
        />
        <SummaryCard
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          title={productsNoInventory}
          subTitle={"Productos Sin Existencias"}
        />

        <SummaryCard
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          title={LowInventory}
          subTitle={"Baja Inventario"}
        />

        <SummaryCard
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={refreshIn}
          subTitle={"Actualizacion en..."}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
