import { PeopleOutline } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import { testloApi } from "../../api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) {
    return <></>;
  }

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const prevUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updatedUsers);
    try {
      await testloApi.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      setUsers(prevUsers);
      console.log(error);
      alert("No se pudo actualizar ");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={({ target }) => onRoleUpdated(row.userId, target.value)}
            sx={{ width: 300 }}
          >
            <MenuItem value="admin">Admin </MenuItem>
            <MenuItem value="client">Client </MenuItem>
            <MenuItem value="super-user">Super User </MenuItem>
            <MenuItem value="SEO">SEO </MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user, index) => ({
    id: index + 1,
    email: user.email,
    name: user.name,
    role: user.role,
    userId: user._id,
  }));

  return (
    <AdminLayout
      title="Usuarios"
      subTitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
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

// import { GetServerSideProps, NextPage } from "next";
// import { dbUsers } from "../../database";

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const data = await dbUsers.allUsers();

//   return {
//     props: {
//       doto: data,
//     },
//   };
// };

export default UsersPage;
