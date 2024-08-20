import React, { Fragment, useEffect} from 'react';

function ExcelPicker({ sheets, sheetColMap, setSheetColMap }) {
    const sheetNames = Array.from(sheets.keys())
    const keyColMap = new Map(
        sheetNames.map(sheetName=>
        [sheetName, sheets.get(sheetName)[0]]
        )
    )

    useEffect(()=>console.log(sheetColMap))

    return (
        <>
            <h3>Select Column to join on</h3>
            {
                sheetNames.map((sheetName, ind) => {
                    return( 
                    <Fragment key={`picking${sheetName}`}>
                        <p>{sheetName}</p>
                        <select
                            onChange={e => setSheetColMap(new Map(sheetColMap).set(sheetName, e.target.value))}
                        >
                            {
                                keyColMap.get(sheetName).map((val, ind)=>{
                                    return(
                                        <option key={val} value={ind}>{val}</option>
                                    )
                                })
                            }
                        </select>
                    </Fragment>
                    )
                })
            }

        </>
    )

}
export default ExcelPicker