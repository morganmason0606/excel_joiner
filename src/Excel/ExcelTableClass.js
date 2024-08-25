import { Fragment, useEffect, useState } from "react"
import * as XLSX from 'xlsx';


export default function ExcelTable({ sheets, sheetColMap, joinedRows, setJoinedRows }) {
    class Cell {
        constructor(cellVal, sheetName, ind) {
            this.cellVal = cellVal;
            this.sheetName = sheetName;
            this.ind = ind
            this.selected = 0
        }
    }

    const [maxLen, setMaxLen] = useState(0);
    const [selRows, setSelRows] = useState(new Map());
    const [inputName, setInputName] = useState("")

    const [table, setTable] = useState(new Map())

    useEffect(() => {
        const maxLen = Math.max(...[...sheets.keys()].map(sheetName => sheets.get(sheetName).length));
        setMaxLen(maxLen);
        const ntable = new Map([...sheets.keys()].map(sheetName =>
            [
                sheetName,
                sheets.get(sheetName).map((row, ind) => new Cell(row[sheetColMap.get(sheetName)], sheetName, ind))
            ]
        )
        )
        setTable(ntable);
    }, [sheets, sheetColMap])

    const handleSubmit = (e) => {
        e.preventDefault();
        const new_arr = [...joinedRows, { name: inputName, cols: new Map(selRows) }]
        selRows.forEach(cell => cell.selected += 1)
        setJoinedRows(new_arr);
        setInputName("");
        setSelRows(new Map());
    }
    const handleSelect = (e, cell) => {
        if (selRows.get(cell.sheetName) === cell) {
            const nMap = new Map(selRows);
            nMap.delete(cell.sheetName);
            setSelRows(nMap);
        } else {
            const nMap = new Map(selRows);
            nMap.set(cell.sheetName, cell);
            setSelRows(new Map(nMap));
        }

    }
    // const handleJoin = (e) => {
    //     e.preventDefault();

    // }
    const exportSheet = () => {
        // console.log(joinedRows)
        const headers = ["joined header", ...[...sheets.keys()].map(sheetName =>
            sheets.get(sheetName)[0].map(val => `${sheetName}: ${val}`)
        ).flat()
        ]
        const data = joinedRows.map(({ name, cols }) => [
            name,
            ...([...sheets.keys()].map(sheetName =>
                cols.has(sheetName)
                    ? (sheets.get(sheetName)[cols.get(sheetName).ind])
                    : (Array.apply(null, Array(sheets.get(sheetName)[0].length)).map(function () { return }))
            ).flat())

        ]
        )
        const aoa = [headers, ...data]
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        /* create workbook and export */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "SheetJSExportAOA.xlsx");
    
    }
    return (
        <>
            <button onClick={exportSheet}>Export sheet</button>

            <table>
                <tr>
                    <th>
                        Select cells and Join
                        <form onSubmit={handleSubmit}>

                            <input type="text" placeholder="new column name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
                            <button type='submit'>Join Selected Rows</button>
                        </form>
                    </th>
                    {[...sheets.keys()].map(sheetName => <th>{sheetName}</th>)}
                </tr>
                <tbody>
                    {joinedRows.map(row =>
                        <tr>
                            <td>{row.name}</td>
                            {[...sheets.keys()].map(sheetName =>
                                (row.cols.has(sheetName)) ?
                                    (<td>{row.cols.get(sheetName).cellVal}</td>) :
                                    (<td></td>)
                            )}
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    {
                        [...Array(maxLen).keys()].map(ind =>
                            <tr>
                                <td>row {ind}</td>
                                {
                                    [...table.keys()].map(sheetName =>
                                        (table.get(sheetName).length > ind
                                            && table.get(sheetName)[ind] !== undefined
                                            && table.get(sheetName)[ind] !== null) ?
                                            (
                                                (table.get(sheetName)[ind].selected !== 0) ?

                                                    (
                                                        <td
                                                            onClick={(e) => handleSelect(e, table.get(sheetName)[ind])}
                                                            bgcolor={(selRows.get(sheetName) === table.get(sheetName)[ind]) ? ('gray') : ("white")
                                                            }
                                                        >
                                                            <s>
                                                                {table.get(sheetName)[ind].cellVal}
                                                            </s>
                                                        </td>
                                                    ) : (
                                                        <td
                                                            onClick={(e) => handleSelect(e, table.get(sheetName)[ind])}
                                                            bgcolor={(selRows.get(sheetName) === table.get(sheetName)[ind]) ? ('gray') : ("white")
                                                            }
                                                        >
                                                            {table.get(sheetName)[ind].cellVal}
                                                        </td>
                                                    )
                                            ) : (
                                                <td></td>
                                            )
                                    )
                                }
                            </tr>
                        )
                    }
                </tfoot>
            </table>
        </>
    )

}
