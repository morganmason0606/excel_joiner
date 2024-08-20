import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelPicker from './ExcelPicker';
import ExcelTable from './ExcelTable';

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
	//sheets: map<sheetName, array_of_rows[{columnHeader: row_value_under_columnHeader}}]>
	const [sheetColMap, setSheetColMap] = useState(new Map())
	//sheetColMap: map<sheetName, columHeader_to_join_on>


	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const sheetMap = new Map();
		reader.onload = (event) => {
			const workbook = XLSX.read(event.target.result, { type: 'binary' });

			for (const sheetName of workbook.SheetNames) {
				const sheet = workbook.Sheets[sheetName];
				const sheetData = XLSX.utils.sheet_to_json(sheet);
				if (sheetData !== undefined && sheetData.length > 0) {
					sheetMap.set(sheetName, sheetData);
				}
			}
			setSheets(sheetMap);
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
								<ExcelTable sheets={sheets} sheetColMap={sheetColMap} />
							</>) :
							(<p>error</p>)
			}
		</>
	);
}

export default Excel;
