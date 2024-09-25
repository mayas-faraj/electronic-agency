import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ProfileContext from "./profile-context";
import CsvDownloadButton from "react-json-to-csv";
import Content from "./content";
import styles from "../styles/content-table.module.scss";

// types
export enum HeaderType {
  UPDATE,
  DELETE,
  SPECIAL
}

export interface ITableHeader {
  key: string;
  title: string;
  type?: HeaderType;
}

interface IContentTableProps {
  name: string;
  headers: ITableHeader[];
  data: Record<string, ReactNode>[];
  canCreate?: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  hasSnColumn?: boolean;
  addNewLink?: string;
  isAddNewRight?: boolean;
  hidePagination?: boolean;
}

// main component
const ContentTable: FunctionComponent<IContentTableProps> = ({
  name,
  headers,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  hasSnColumn,
  addNewLink,
  isAddNewRight,
  hidePagination,
  data
}) => {
  // component state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // component context
  const privileges = React.useContext(ProfileContext);

  // event handler
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // process privilege to product headers
  const visibleHeader = headers.filter(
    (header) => header.type === undefined || header.type === HeaderType.SPECIAL || (header.type === HeaderType.UPDATE && canUpdate) || (header.type === HeaderType.DELETE && canDelete)
  );

  // prepare export to csv
  const csvHeader = headers.filter((header) => header.type === undefined);

  // render
  return (
    <>
      {canCreate && addNewLink != null && (
        <Link to={addNewLink} className={`${styles.button} ${styles["button--main"]} ${isAddNewRight === true ? styles["button--right"] : ""}`}>
          <AddCircleIcon />
          Add new {name}
        </Link>
      )}
      <Paper className={styles.wrapper}>
        <TableContainer>
          <Table stickyHeader>
            {canRead !== true && <caption className={styles.caption}>Access deined for this role!</caption>}
            <TableHead>
              <TableRow>
                {hasSnColumn && <TableCell>Sn</TableCell>}
                {visibleHeader.map((header) => (
                  <TableCell key={header.key} align={header.type !== undefined ? "center" : "left"}>
                    {header.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {canRead === true &&
                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, rowIndex) => (
                  <TableRow key={dataRow.id?.toString() ?? `row${rowIndex}`}>
                    {hasSnColumn && <TableCell>{page * rowsPerPage + rowIndex + 1}</TableCell>}
                    <Content name={name}>
                      {visibleHeader.map((header) => (
                        <TableCell key={header.key + dataRow.id?.toString()} align={header.type !== undefined ? "center" : "left"}>
                          {dataRow[header.key]}
                        </TableCell>
                      ))}
                    </Content>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!hidePagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {privileges.updateAdmin && !hidePagination && (
          <CsvDownloadButton
            className={styles.button + " " + styles["button--small"]}
            headers={csvHeader.map((header) => header.title)}
            data={data.map((item) => {
              return csvHeader.map((header) => item[header.key]).filter((item) => typeof item === "string" || typeof item === "number");
            })}
            filename={name + ".csv"}
            title={`Export ${name} to excel table and Download`}
          >
            <CloudDownloadIcon />
          </CsvDownloadButton>
        )}
      </Paper>
    </>
  );
};

export default ContentTable;
