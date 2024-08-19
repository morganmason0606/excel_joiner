import { Fragment, useState } from "react"

function ExcelTable({ sheets, sheetColMap }) {
    //sheetColMap.get("2023")
    console.log(sheets.get('2023'))
    return (
        <>
            <p>hi2</p>
            {
                sheets.keys().toArray().map(sheetName =>
                    <Fragment key={sheetName}>
                        <p>{sheetName}</p>
                        <ul>
                            {
                                sheets.get(sheetName).map(row => <li>
                                    {
                                        (sheetColMap.get(sheetName) in row) ?
                                            (row[sheetColMap.get(sheetName)]) :
                                            (<></>)
                                    }
                                </li>)
                            }
                        </ul>
                    </Fragment>
                )
            }
        </>
    )
}

export default ExcelTable