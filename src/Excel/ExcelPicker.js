export default function ExcelPicker({ sheets, sheetColMap, setSheetColMap }) {
    const sheetNames = Array.from(sheets.keys())
    const keyColMap = new Map(
        sheetNames.map(sheetName =>
            [sheetName, sheets.get(sheetName)[0]]
        )
    )


    return (
        <>
            <h3>Select Column to join on</h3>
            <p style={{ textAlign: 'center' }}>
                Use the dropdown menus to select the row you wish to join on.<br />
                If you do not wish to use some column, either remove it from the worksheet or ignore it when selecting from the table.
            </p>
            {
                sheetNames.map((sheetName, ind) => {
                    return (
                        <div key={`picking${sheetName}`}>
                            <h4>{sheetName}</h4>
                            <select
                                onChange={e => setSheetColMap(new Map(sheetColMap).set(sheetName, e.target.value))}
                            >
                                {
                                    keyColMap.get(sheetName).map((val, ind) => {
                                        return (
                                            <option key={val} value={ind}>{val}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    )
                })
            }

        </>
    )

}