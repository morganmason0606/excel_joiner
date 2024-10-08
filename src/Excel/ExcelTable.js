import { useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import "./ExcelTable.css"

export default function ExcelTable({ sheets, sheetColMap, joinedRows, setJoinedRows }) {
    const [maxLen, setMaxLen] = useState(0);    //used for building table
    const [selRows, setSelRows] = useState(new Map());  //map<column/sheet name, index of currently selected row> 
    const [inputName, setInputName] = useState("") //user inputted name for joined row

    const [table, setTable] = useState(new Map())   //map <sheet name, array of object representing cell
    //cell {cellVal, sheetName, ind, selected}


    const [columnWidths, setColumnWidths] = useState([...sheets.keys()].map(sheetName => 200))
    // const [isResizing, setIsResizing] = useState(false);



    //set up table data 
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
        const ws2 = XLSX.utils.aoa_to_sheet(joinedSheetData)
        /* create workbook and export */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Joined Data");

        XLSX.utils.book_append_sheet(wb, ws2, "Joined Rows");

        XLSX.writeFile(wb, "joined.xlsx");

    }


    const handleMouseDown = (index, event) => {
        event.preventDefault()
        // setIsResizing(true);
        const startX = event.clientX;
        const startWidth = columnWidths[index];

        const onMouseMove = (event) => {
            event.preventDefault()
            // console.log(isResizing)
            // if (!isResizing) return;
            const deltaX = event.clientX - startX;
            const newWidths = [...columnWidths];
            newWidths[index] = Math.max(startWidth + deltaX, 50); // Ensure a minimum width
            setColumnWidths(newWidths);
        };

        const onMouseUp = () => {
            event.preventDefault()

            // setIsResizing(false);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

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
                <table >
                    <thead>
                        <tr className="followHeader">
                            {/*sheet Names*/}
                            <th style={{width:"10%"}}>
                                Select cells and Join
                                <form onSubmit={handleSubmit}>

                                    <input type="text" placeholder="new row name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
                                    <button type='submit'>Join Selected Rows</button>
                                </form>
                            </th>
                            {[...sheets.keys()].map((sheetName, index) =>
                                <th
                                    key={`th${sheetName}`}
                                    scope="col"
                                    style={
                                        {
                                            width: columnWidths[index] + 'px',
                                            position: 'relative',
                                        }
                                    }>
                                    {sheetName}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '5px',
                                            cursor: 'col-resize',
                                            zIndex: 1,
                                        }}
                                        onMouseDown={(event) => handleMouseDown(index, event)}
                                    />
                                </th>)}
                        </tr>
                    </thead>
                    <tbody className="joinedRows">
                        {/* joined values */}
                        {joinedRows.map((row, ind) =>
                            <tr>
                                <th scope="row">
                                    {` ${row.name}`}
                                    <br/>
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
                                    <button onClick={()=>{
                                        const winInput = window.prompt("Rename row:", row.name);
                                        if(winInput !== null){
                                            const newRows = joinedRows.map((row2, ind2)=>{
                                                if (ind === ind2){
                                                    const newRow = row2
                                                    newRow.name = winInput
                                                    return newRow
                                                }else{
                                                    return row2
                                                }
                                            })
                                            setJoinedRows(newRows)
                                        }
                                    }}>
                                        update
                                    </button>
                                </th>
                                {[...sheets.keys()].map((sheetName, index) =>
                                    <td
                                        style={
                                            {
                                                width: columnWidths[index],
                                                wordBreak: 'break-word'
                                            }}
                                    >
                                        {
                                            (row.cols.has(sheetName)) ?
                                                (row.cols.get(sheetName).cellVal) :
                                                ("")
                                        }
                                    </td>
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
                                        [...table.keys()].map((sheetName, index) => //for each sheet

                                            (table.get(sheetName).length > ind
                                                && table.get(sheetName)[ind] !== undefined
                                                && table.get(sheetName)[ind] !== null) ? //if the sheet has a value at the index
                                                (
                                                    <td style={{ width: columnWidths[index], wordBreak: 'break-word' }}
                                                        onClick={(e) => handleSelect(e, table.get(sheetName)[ind])}
                                                        bgcolor={(selRows.get(sheetName) === table.get(sheetName)[ind]) ? ('gray') : ("white")}
                                                    >
                                                        {
                                                            (table.get(sheetName)[ind].selected !== 0) ? //if we have already selected, cross it out
                                                                (
                                                                    <s>
                                                                        {table.get(sheetName)[ind].cellVal}
                                                                    </s>

                                                                ) : ( // if not selected, display as normal
                                                                    table.get(sheetName)[ind].cellVal
                                                                )
                                                        }
                                                    </td>
                                                ) : ( // if no value, just empty
                                                    <td style={{ width: columnWidths[index], wordBreak: 'break-word' }} />
                                                )


                                        )
                                    }
                                </tr>
                            )
                        }
                    </tfoot>
                </table >
            </div >
        </>
    )

}
