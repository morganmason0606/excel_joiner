import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelPicker from './ExcelPicker';
import ExcelTable from './ExcelTable';
import ExcelTableClass from './ExcelTableClass'
// enum
const STATES = {
	upload: "upload",
	pick: "pick",
	table: "table"
}

function Excel() {
	const [curState, setCurState] = useState(STATES.upload)
	//curState: STATES
	const [sheets, setSheets] = useState(new Map());
	//sheets: map<sheetName, array of arrays(row 0 is headers)>
	const [sheetColMap, setSheetColMap] = useState(new Map())
	//sheetColMap: map<sheetName, index of column to join on>
	const [joinedRows, setJoinedRows] = useState([])
	//array of map: index is row, map is sheet name, index to join on
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const sheetMap = new Map();
		const colMap = new Map()
		reader.onload = (event) => {
			const workbook = XLSX.read(event.target.result, { type: 'binary' });

			for (const sheetName of workbook.SheetNames) {
				const sheet = workbook.Sheets[sheetName];
				const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
				if (sheetData !== undefined && sheetData.length > 0) {
					sheetMap.set(sheetName, sheetData);
					colMap.set(sheetName, 0)
				}
			}
			setSheets(sheetMap);
			setSheetColMap(new Map(colMap));
		};

		try {
			reader.readAsArrayBuffer(file);
			setCurState(STATES.pick);
		} catch { };

	};

	return (
		<>
			{
				(curState === STATES.upload) ? (
					<>
						<input type="file" onChange={handleFileUpload} />
					</>) :
					(curState === STATES.pick) ? (
						<>
							<ExcelPicker sheets={sheets} sheetColMap={sheetColMap} setSheetColMap={setSheetColMap} />
							<br />
							<button type="button" onClick={() => (setCurState(STATES.table))}>Continue to picking tables</button>
						</>) :
						(curState === STATES.table) ? (
							<>
								<ExcelTableClass sheets={sheets} sheetColMap={sheetColMap} joinedRows={joinedRows} setJoinedRows={setJoinedRows}/>
							</>) :
							(<p>error</p>)
			}
		</>
	);
}

export default Excel;
