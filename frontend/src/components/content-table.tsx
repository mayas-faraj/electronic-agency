import React, { FunctionComponent, ReactNode } from "react";
import Content from "./content";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

// types
export enum CellDataTransform {
  normal,
  button,
  switch
}

export interface ITableHeader {
  key: string
  title: string
  dataTransform?: CellDataTransform
}

interface IContentTableProps {
  name: string
  headers: ITableHeader[]
  data: Record<string, ReactNode>[]
}

// main component
const ContentTable: FunctionComponent<IContentTableProps> = ({ name, headers, data }) => {
  // component state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // event handler
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // render
  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {
                headers.map(header => (
                  <TableCell
                    key={header.key}
                    align={header.dataTransform === CellDataTransform.button || header.dataTransform === CellDataTransform.switch ? "center" : "left"}>{header.title}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, rowIndex) => (
                <TableRow>
                  <Content key={dataRow.id?.toString() ?? `row${rowIndex}`} name={name}>
                    {
                      headers.map((header, colIndex) => (
                        <TableCell key={header.key + dataRow.id?.toString() ?? `row${rowIndex}`} align={header.dataTransform === CellDataTransform.button || header.dataTransform === CellDataTransform.switch ? "center" : "left"}>
                          {dataRow[header.key]}
                        </TableCell>
                      ))
                    }
                  </Content>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ContentTable;