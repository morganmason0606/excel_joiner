import React, { Fragment} from 'react';

function ExcelPicker({ sheets, sheetColMap, setSheetColMap }) {
    const keys = Array.from(sheets.keys())
    const keyColMap = new Map()  
    for (const key of keys){
        keyColMap.set(key,  Object.keys(sheets.get(key)[0]))
     }

    return (
        <>
            <h3>Select Column to join on</h3>
            {
                keys.map((key, ind) => {
                    return( 
                    <Fragment key={key}>
                        <p>{key}</p>
                        <select
                            onChange={e => setSheetColMap(new Map(sheetColMap).set(key, e.target.value))}
                        >
                            {
                                keyColMap.get(key).map((val, ind)=>{
                                    return(
                                        <option key={val} value={val}>{val}</option>
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