import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTable, useFilters } from 'react-table'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'

const BookRequestTable = ({ data }) => {
    const [filterInput, setFilterInput] = useState("");
    const [error, setError] = useState()
    const history = useHistory()

    const columns = React.useMemo(
        () => [
                {
                    Header: "Id",
                    accessor: "id_pembayaran"
                },
                {
                    Header: "Id Kost",
                    accessor: "id_kost"
                },
                {
                    Header: "Id Penyewa", 
                    accessor: "id_penyewa"
                },
                {
                    Header: "Nama Pemilik",
                    accessor: "nama_akhir"
                },
                {
                    Header: "No HP Pemilik",
                    accessor: "no_hp"
                },
                {
                    Header: "Nama Kost",
                    accessor: "nama_kost"
                }, 
                {
                    Header: "Nama Bank",
                    accessor: "nama_bank"
                },
                {
                    Header: "No. Rekening",
                    accessor: "no_rek"
                },   
                {
                    Header: "Tanggal Book",
                    accessor: "tanggal_trf"
                },  
                {
                    Header: "Status Payment",
                    accessor: "status"
                },    
                
            ], []
    )
    
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("nama_kost", value); 
        setFilterInput(value);
    };
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter 
    
      } = useTable({
        columns,
        data,
        initialState: { pageIndex: 1 },
      },
        useFilters
      )
    const handleOnClickRow = (e, row) => {
    }

    return (
        <>
            <div className="flex justify-between my-3 items-center">
                <span className="relative">
                    <input value={filterInput} onChange={handleFilterChange} className="border p-2 focus:outline-none rounded-lg text-gray-800 w-60" placeholder="search kost"></input>
                    <FontAwesomeIcon className="absolute top-4 text-gray-200 right-2" icon={faSearch}></FontAwesomeIcon>
                </span>
            </div>
            <div className="border rounded-xl z-30 overflow-x-scroll md:overflow-hidden">
                <table className="bg-white min-w-full divide-y divide-gray-200 " {...getTableProps()}>
                    <thead className="bg-gray-50">
                        {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                            <th className="text-left p-3 border text-green-dark" {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr className="cursor-pointer hover:bg-gray-100" {...row.getRowProps()} onClick={(e) => handleOnClickRow(e, row)}>
                                {row.cells.map((cell) => {
                                    return <td className="p-5" {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default BookRequestTable
