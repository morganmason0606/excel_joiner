import { Fragment, useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import "./ExcelTable.css"

export default function ExcelTable({ sheets, sheetColMap, joinedRows, setJoinedRows }) {
    const [maxLen, setMaxLen] = useState(0);    //used for building table
    const [selRows, setSelRows] = useState(new Map());  //map<column/sheet name, index of currently selected row> 
    const [inputName, setInputName] = useState("") //user inputted name for joined row

    const [table, setTable] = useState(new Map())   //map <sheet name, array of object representing cell
    //cell {cellVal, sheetName, ind, selected}

    useEffect(() => {
        // create table on loading of page
        //find max column len
        const maxLen = Math.max(...[...sheets.keys()].map(sheetName => sheets.get(sheetName).length));
        setMaxLen(maxLen);
        //our table is map of sheet name and array of cell object
        //cell object represented with its value, sheet, index in sheet, and selected for display purposes
        const ntable = new Map([...sheets.keys()].map(sheetName =>
            [
                sheetName,
                sheets.get(sheetName).map((row, ind) => ({
                    cellVal: row[sheetColMap.get(sheetName)],
                    sheetName: sheetName,
                    ind: ind,
                    selected: 0
                })
                )
            ]
        )
        )
        setTable(ntable);
    }, [sheets, sheetColMap])

    const handleSubmit = (e) => {
        //add new joinedRow object to joinedRows array, update cells joined, and clear inputs
        e.preventDefault();
        const new_arr = [...joinedRows, { name: inputName, cols: new Map(selRows) }]
        selRows.forEach(cell => cell.selected += 1)
        setJoinedRows(new_arr);
        setInputName("");
        setSelRows(new Map());
    }

    const handleSelect = (e, cell) => {
        //on select, toggle whether cell is selected
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

    const exportSheet = () => {
        // Sheetsjs expects an array of arrays
        //aoa[0] should be headers
        //accoplish by making an array of ( keys array from sheets) that are then flatten) 
        const sheetKeys = [...sheets.keys()]
        const headers = ["joined header", ...(sheetKeys.map(sheetName =>
            sheets.get(sheetName)[0].map(val => `${sheetName}: ${val}`)
        ).flat())
        ]
        //join data from joined rows
        //like headers, we make an array of sheet row array then flatten it
        //if a column was not selected, we just create a filler array of undefined 
        const data = joinedRows.map(({ name, cols }) => [
            name,
            ...(sheetKeys.map(sheetName =>
                cols.has(sheetName)
                    ? (sheets.get(sheetName)[cols.get(sheetName).ind])
                    : (Array.apply(null, Array(sheets.get(sheetName)[0].length)).map(function () { return undefined }))
            ).flat())

        ]
        )
        const joinedData = [headers, ...data]
        const ws = XLSX.utils.aoa_to_sheet(joinedData);

        const joinedSheetheader = ['joined name', ...(sheetKeys.map(sheetName => ['row number', sheetName])).flat()]
        const joinedSheetRows = joinedRows.map(row => [
            row.name,
            ...(sheetKeys.map(sheetName => (
                row.cols.has(sheetName)) ?
                ([row.cols.get(sheetName).ind + 1, row.cols.get(sheetName).cellVal]) :
                ([undefined, undefined])
            ).flat()
            )
        ])
        const joinedSheetData = [joinedSheetheader, ...joinedSheetRows]
        console.log(joinedSheetheader, joinedSheetRows, joinedSheetData)
        const ws2 = XLSX.utils.aoa_to_sheet(joinedSheetData)
        /* create workbook and export */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Joined Data");

        XLSX.utils.book_append_sheet(wb, ws2, "Joined Rows");

        XLSX.writeFile(wb, "joined.xlsx");

    }

    return (
        <>
            <button onClick={exportSheet}>Export sheet</button>
            <h3>Instructions</h3>
            <p>
                Select cells in the table and join them together using the form in the top left.<br />
                To select a cell, click on it. The background should turn gray. To unselect a cell, click on it again. It should turn white.<br></br>
                To join cells together, select the cells you wish to join (you can have an empty row by not selecting any cells). <br></br>
                &emsp;-tip: ctrl-f can be useful for finding keywords on the table<br></br>
                Then in the top left, create an optional name to join on. Finally, click the Join Selected Rows. <br></br>
                You should then see the joined row at the top of the table with a blue blackground and the cells previously selected crossed out.<br></br>
                Note that crossed out cells can still be selected. The crossing out is just to show it has already been joined on. <br></br>
                To remove a join, click the delete buttoon on the joined row.<br></br>
                To export the worksheet, click the above export button. This will only export the rows that have been joined.

            </p>
            <div>
                <h3>asdf</h3>
                <table>
                    <thead>
                        <tr className="followHeader">
                            {/*sheet Names*/}
                            <th>
                                Select cells and Join
                                <form onSubmit={handleSubmit}>

                                    <input type="text" placeholder="new column name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
                                    <button type='submit'>Join Selected Rows</button>
                                </form>
                            </th>
                            {[...sheets.keys()].map(sheetName =>
                                <th scope="col">
                                    <div className="adjustable">
                                        {sheetName}
                                    </div>
                                </th>)}
                        </tr>
                    </thead>

                    <tbody className="joinedRows">
                        {/* joined values */}
                        {joinedRows.map((row, ind) =>
                            <tr>
                                <th scope="row">
                                    <button
                                        onClick={() => {
                                            //filter out selected row and update the row's cells
                                            row.cols.forEach(cell => cell.selected -= 1);
                                            const newRows = joinedRows.filter((val, i) => i !== ind)
                                            setJoinedRows(newRows)

                                        }}
                                    >
                                        delete
                                    </button>
                                    {` ${row.name}`}
                                </th>
                                {[...sheets.keys()].map(sheetName =>
                                    (row.cols.has(sheetName)) ?
                                        (<td>
                                            <div className="adjustable">
                                                {row.cols.get(sheetName).cellVal}
                                            </div>
                                        </td>) :
                                        (<td>
                                            <div className="adjustable" />
                                        </td>)
                                )}
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        {
                            //sheet column values
                            [...Array(maxLen).keys()].map(ind =>
                                <tr>
                                    <th scope="row">row {ind + 1}</th>
                                    {
                                        [...table.keys()].map(sheetName => //for each sheet
                                            (table.get(sheetName).length > ind
                                                && table.get(sheetName)[ind] !== undefined
                                                && table.get(sheetName)[ind] !== null) ? //if the sheet has a value at the index
                                                (
                                                    (table.get(sheetName)[ind].selected !== 0) ? //if we have already selected, cross it out

                                                        (
                                                            <td
                                                                onClick={(e) => handleSelect(e, table.get(sheetName)[ind])}
                                                                bgcolor={(selRows.get(sheetName) === table.get(sheetName)[ind]) ? ('gray') : ("white")
                                                                }
                                                            >
                                                                <div className="adjustable" >

                                                                    <s>
                                                                        {table.get(sheetName)[ind].cellVal}
                                                                    </s>
                                                                </div>
                                                            </td>
                                                        ) : ( // if not selected, display as normal
                                                            <td
                                                                onClick={(e) => handleSelect(e, table.get(sheetName)[ind])}
                                                                bgcolor={(selRows.get(sheetName) === table.get(sheetName)[ind]) ? ('gray') : ("white")
                                                                }
                                                            >
                                                                <div className="adjustable" >

                                                                    {table.get(sheetName)[ind].cellVal}
                                                                </div>
                                                            </td>
                                                        )
                                                ) : ( // if no value, just empty
                                                    <td>
                                                        <div className="adjustable" />
                                                    </td>
                                                )
                                        )
                                    }
                                </tr>
                            )
                        }
                    </tfoot>
                </table>
            </div>
        </>
    )

}
