import { Fragment, useEffect, useState } from "react"

export default function ExcelTable({ sheets, sheetColMap, joinedRows, setJoinedRows }) {
    const [maxLen, setMaxLen] = useState(0);
    const [selRows, setSelRows] = useState(new Map());
    const [inputName, setInputName] = useState("")

    useEffect(() => {
        setMaxLen(Math.max(...[...sheets.keys()].map(sheetName => sheets.get(sheetName).length)));
    }, [sheets])


    const handleSelect = (e, sheetName, ind) => {
        if (selRows.get(sheetName) === ind) {
            const nMap = new Map(selRows)
            nMap.delete(sheetName)
            setSelRows(new Map(nMap))
        } else {
            setSelRows(new Map(selRows).set(sheetName, ind))
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const new_arr = [...joinedRows, { name: inputName, cols: new Map(selRows) }]
        setJoinedRows(new_arr);
        setInputName("");
        setSelRows(new Map());
        
    }
    const asdf = () => {
        console.log('hi')
        
        console.log(typeof(joinedRows[0]))
        console.log(joinedRows)
    }
    return (
        <>
            <button onClick={asdf}>asdf</button>
            <table>
                <thead>
                    <th>
                        Select cells and Join
                        <form onSubmit={handleSubmit}>

                            <input type="text" placeholder="new column name" value={inputName} onChange={(e) => setInputName(e.target.value)} />
                            <button type='submit'>Join Selected Rows</button>
                        </form>
                    </th>
                    {[...sheets.keys()].map(sheetName => <th>{sheetName}</th>)}
                </thead>
                <tbody>
                    {
                        joinedRows.map((row, ind) =>
                            
                            <tr key={`joined:${row.name}${ind}`}>
                                <td>{row.name}</td>
                                {
                                    [...sheets.keys()].map(sheetName =>
                                        (row.cols.has(sheetName)) ? (
                                            <td>{sheets.get(sheetName)[row.cols.get(sheetName)][sheetColMap.get(sheetName)]}</td >
                                        ) : (
                                            <td></td>
                                        )
                                    )
                                }
                            </tr>
                        )
                    }

                </tbody>
                <tbody>
                    {
                        [...Array(maxLen).keys()].map(ind =>
                            <tr>
                                <td></td>
                                {
                                    [...sheets.keys()].map(sheetName =>
                                        (sheets.get(sheetName).length > ind
                                            && sheets.get(sheetName)[ind][sheetColMap.get(sheetName)] !== undefined
                                            && sheets.get(sheetName)[ind][sheetColMap.get(sheetName)] !== null
                                        ) ? (
                                            <td
                                                key={`${sheetName}_${ind}`}
                                                onClick={(e) => handleSelect(e, sheetName, ind)}
                                                bgcolor={(selRows.get(sheetName) === ind) ? ('gray') : ('white')}
                                            >
                                                {sheets.get(sheetName)[ind][sheetColMap.get(sheetName)]}
                                            </td>

                                            // (selRows.get(sheetName) === ind)?
                                            // ((<td 
                                            //     key={`${sheetName}_${ind}`}
                                            //     onClick={(e)=>handleSelect(e,sheetName, ind)}
                                            //     bgcolor="gray"
                                            //     >
                                            //         {sheets.get(sheetName)[ind][sheetColMap.get(sheetName)]}
                                            // </td>))
                                            // :(<td 
                                            //     key={`${sheetName}_${ind}`}
                                            //     onClick={(e)=>handleSelect(e,sheetName, ind)}>
                                            //         {sheets.get(sheetName)[ind][sheetColMap.get(sheetName)]}
                                            // </td>)
                                        )

                                            : (<td></td>)
                                    )
                                }

                            </tr>

                        )
                    }
                </tbody>
            </table >
            {

            }
        </>
    )

}
/*
    //sheetColMap.get("2023")
    // const [selectedRowsMap, setSelectedRowsMap] = useState(new Map());
    // console.log(e.target.value)
    // console.log(e.target.parentNode.parentNode.id)
    // console.log(e)
    function handleOptionChange(e) {
    }
    const radioTable = (
        <table>
            <thead>
                <tr>
                    <th>Joined Rows</th>
                    {
                        sheets.keys().toArray().map(sheetName =>
                            <th key={"head?" + sheetName}>{sheetName}</th>
                        )
                    }
                </tr>
            </thead>
            <tr>

            </tr>
            <tr>
                <td>
                    <p>Select rows to join on the right, create a name to join them on, and join the rows</p>

                    <input type="text" />
                    <button>Join selected rows</button>
                </td>
                {
                    sheets.keys().toArray().map((sheetName, sheetInd) =>
                        <td key={"body?" + sheetName}>
                            <form>
                                <div id={sheetName}>

                                    {
                                        sheets.get(sheetName).map((row, ind) =>
                                            <Fragment key={"row?" + ind}>
                                                <input
                                                    id={sheetName + '?' + String(ind)}
                                                    type="radio"
                                                    value={row[sheetColMap.get(sheetName)]}
                                                    name={sheetName}
                                                    onChange={handleOptionChange} />
                                                <label for={sheetName + '?' + String(ind)}>{row[sheetColMap.get(sheetName)]}</label>
                                                <br></br>
                                            </Fragment>
                                        )
                                    }
                                </div>
                            </form>
                        </td>
                    )
                }
            </tr>
        </table>

    );

    const selectTable = (
            <table>
                <thead><tr>
                    <th>Joined Row</th>
                {
                    sheets.keys().toArray().map((sheetName) => <th>{sheetName}</th>)
                }
            </tr></thead>
            <tr></tr>
            <tr>
                <td>
                    <p>Select rows to join on</p>
                    <input type="text" />
                    <button>Join selected rows</button>
                </td>
                {
                    sheets.keys().toArray().map((sheetName) =>
                        <td>
                            <select name={sheetName} id={'select?' + sheetName}>
                                <option value="">No Row Selected</option>
                                {
                                    sheets.get(sheetName).map((row, ind) =>
                                        <option value={row[sheetColMap.get(sheetName)]}>{row[sheetColMap.get(sheetName)]}</option>
                                    )
                                }
                            </select>
                        </td>
                    )
                }
            </tr>
        </table>
    );
    const keys = sheets.keys().toArray()
    const rowMap = new Map(
        keys.map(sheetName=>
        [sheetName,
        sheets.get(sheetName).map((row)=>row[sheetColMap.get(sheetName)])
        ]
        )
    )
    const maxLen = Math.max(keys.map(sheetName => sheets.get(sheetName).length))

    const selectSide = (
        <div className="box">
            <div>
                <h1>select</h1>
                
            </div>
            {
                sheets.keys().toArray().map(sheetName=>
                    <div key={sheetName}>
                        <h1>{sheetName}</h1>
                        {
                            sheets.get(sheetName).map((row,ind)=>
                                <RowBox sheetName={sheetName} name={row[sheetColMap.get(sheetName)]} ind={ind}/>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
    return (
        <>
            <p>{maxLen}</p>
            {rowMap.get(keys[0]).map(row=>{return <p>{row}</p>})}
        </>
    )
}

export default ExcelTable
*/