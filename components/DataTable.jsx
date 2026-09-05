"use client";
import { React, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterDepartment from "./FilterDepartment";
import FilterShortlisted from "./FilterShortlisted";
import FilterStatus from "./FilterStatus";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";
import { CheckBoxComp } from "./CheckBoxComp";
import { toast } from "sonner";
import { curDate, curDay, curMonth, curYear, months, days, APPLICATION_STATUSES } from "@/constants";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
} from "react-table";
import { Input } from "@/components/ui/input";
import PaginationComp from "./PaginationComp";
import DialogComp from "./DialogComp";
import MailComposer from "./MailComposer";
import { CSVLink } from "react-csv";
import { CSV_Header } from "@/constants";

const DataTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  const [deptFiltered, setDeptFiltered] = useState(data);
  const [shortFiltered, setShortFiltered] = useState(data);
  const [statusFiltered, setStatusFiltered] = useState(data);
  const [filterKey, setFilterKey] = useState(0);

  const filterFunc = (dept) => {
    if (!dept) {
      setDeptFiltered(data);
      return;
    }
    setDeptFiltered(data.filter((item) => item.Department === dept));
  };

  const shortlistedFilterFunc = (status) => {
    if (!status) {
      setShortFiltered(data);
      return;
    }
    setShortFiltered(data.filter((item) => String(item.shortlisted) === status));
  };

  const statusFilterFunc = (status) => {
    if (!status) {
      setStatusFiltered(data);
      return;
    }
    setStatusFiltered(data.filter((item) => (item.status || "applied") === status));
  };

  // Intersect all active filters (an untouched filter holds the full dataset)
  useEffect(() => {
    const inShort = new Set(shortFiltered);
    const inStatus = new Set(statusFiltered);
    setTableData(deptFiltered.filter((x) => inShort.has(x) && inStatus.has(x)));
  }, [deptFiltered, shortFiltered, statusFiltered, data]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/shortlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        setTableData((prev) =>
          prev.map((applicant) =>
            applicant._id === id ? { ...applicant, ...result.data } : applicant
          )
        );
        toast.success(`Status → ${newStatus.replace("_", " ")}`, {
          description: result.emailSent
            ? "Candidate notified by email."
            : "Email not sent (mail not configured).",
        });
      } else {
        throw new Error(result.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error occurred while updating the status:", error.message);
      toast.error("Failed to update status", { description: error.message });
    }
  };

  const handleNoteSave = async (id, note) => {
    try {
      const res = await fetch(`/api/shortlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setTableData((prev) =>
          prev.map((applicant) =>
            applicant._id === id ? { ...applicant, statusNote: note } : applicant
          )
        );
        toast.success("Note saved");
      } else {
        throw new Error(result.message || "Failed to save note");
      }
    } catch (error) {
      toast.error("Failed to save note", { description: error.message });
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "RegistrationNumber",
        accessor: "RegistrationNumber",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Department",
        accessor: "Department",
      },
      {
        Header: "Preference",
        accessor: "Pref",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const current = row.original.status || "applied";
          const meta = APPLICATION_STATUSES.find((s) => s.value === current);
          return (
            <select
              value={current}
              onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs font-semibold"
              style={{ color: meta?.color }}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        Header: "Note",
        accessor: "statusNote",
        Cell: ({ row }) => (
          <Input
            key={`${row.original._id}-${row.original.statusNote ?? ""}`}
            defaultValue={row.original.statusNote || ""}
            placeholder="Add note..."
            className="min-w-[140px] text-xs"
            onBlur={(e) => {
              if (e.target.value !== (row.original.statusNote || "")) {
                handleNoteSave(row.original._id, e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.target.blur();
            }}
          />
        ),
      },
      {
        Header: "Shortlisted",
        accessor: "shortlisted",
        Cell: ({ row }) => (
          <span
            className={`inline-block rounded px-3 py-1 text-xs font-semibold text-white ${
              row.original.shortlisted ? "bg-green-600" : "bg-gray-400"
            }`}
          >
            {row.original.shortlisted ? "Yes" : "No"}
          </span>
        ),
      },
    ],
    [tableData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CheckBoxComp {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CheckBoxComp {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter, pageIndex } = state;

  const handlePageSize = (e) => {
    const sz = Number(e.target.value);
    if (sz) {
      setPageSize(sz);
    } else {
      setPageSize(10);
    }
  };

  const handleRowSelection = async (payloadData) => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    const request = {
      recipients: selectedApplicants,
      payloadData: payloadData,
    };

    try {
      // const response = await MailSender(request);
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        toast("Invite has been sent!", {
          description: `On ${months[curMonth]} ${curDate}, ${curYear}`,
        });
      } else {
        toast("Failed to send invite", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast("Failed to send invite", {
        description: "Please try again later.",
      });
    }
  };

  const showRowData = () => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    return selectedApplicants;
  };

  const formatQuestionsForCsv = (item) => {
    if (!item?.Questions) return "";

    if (Array.isArray(item.Questions)) {
      return item.Questions
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (Array.isArray(entry)) return entry.join(": ");
          if (entry && typeof entry === "object") {
            return Object.entries(entry)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ");
          }
          return String(entry ?? "");
        })
        .join(" | ");
    }

    if (typeof item.Questions === "object") {
      return Object.entries(item.Questions)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join(" | ");
    }

    return String(item.Questions);
  };

  const csv_link = {
    headers: CSV_Header,
    data: tableData.map((item) => ({
      ...item,
      Questions: formatQuestionsForCsv(item),
    })),
  };

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start border-none justify-start gap-3 p-1 overflow-x-scroll">
        <Input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter Data"
          className="min-w-[300px]"
        />
        <Input
          className="w-fit"
          onChange={(e) => handlePageSize(e)}
          placeholder={"Page Size"}
        />
        <FilterDepartment key={`dept-${filterKey}`} filterFunc={filterFunc} />
        <FilterShortlisted key={`short-${filterKey}`} filterFunc={shortlistedFilterFunc} />
        <FilterStatus key={`status-${filterKey}`} filterFunc={statusFilterFunc} />
        <DialogComp selectedApplicants={showRowData} />
        <Button
          onClick={() => {
            setDeptFiltered(data);
            setShortFiltered(data);
            setStatusFiltered(data);
            setTableData(data);
            setGlobalFilter("");
            setFilterKey((k) => k + 1); // remount comboboxes to clear labels
          }}
          className="flex gap-2"
        >
          <GrPowerReset />
          Reset Filters
        </Button>
        <Button>
          <CSVLink
            {...csv_link}
            className="flex gap-2 justify-center items-center"
          >
            <IoCloudDownloadOutline />
            Download CSV
          </CSVLink>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((hg) => (
              <TableRow key={hg.id} {...hg.getHeaderGroupProps()}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    {...header.getHeaderProps(header.getSortByToggleProps())}
                  >
                    <div className="inline-flex gap-1 items-center">
                      {header.render("Header")}
                      <FaSortAmountDownAlt />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center"
                >
                  <p className="text-sm font-semibold">
                    {tableData.length === 0 ? "No applications yet" : "No matching results"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tableData.length === 0
                      ? "Applications will appear here once candidates apply."
                      : "Try clearing the search or resetting filters."}
                  </p>
                </TableCell>
              </TableRow>
            )}
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.column.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationComp
        pageIndex={pageIndex}
        pages={pageOptions.length}
        nextPage={nextPage}
        canNext={canNextPage}
        previousPage={previousPage}
        canPrev={canPreviousPage}
        goto={gotoPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default DataTable;
