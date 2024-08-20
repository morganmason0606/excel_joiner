import { Fragment, useState } from "react"
import RowBox from "./RowBox";

export default function ExcelTable({ sheets, sheetColMap }) {
    
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