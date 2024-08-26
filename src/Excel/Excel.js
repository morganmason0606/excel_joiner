import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelPicker from './ExcelPicker';
import ExcelTable from './ExcelTable.js'
// enum
const STATES = {
	upload: "upload",
	pick: "pick",
	table: "table"
}

export default function Excel() {
	const [curState, setCurState] = useState(STATES.upload)
	//curState: should always be one of the vals in the state object
	const [sheets, setSheets] = useState(new Map());
	//sheets: map<sheetName, array of arrays(row 0 should headers)>
	const [sheetColMap, setSheetColMap] = useState(new Map())
	//sheetColMap: map<sheetName, index of column to join on>
	const [joinedRows, setJoinedRows] = useState([])
	//array of map: index is row, map is sheet name, index to join on

	const handleFileUpload = (e) => {
		//read file as array of arrays and update sheets, sheetColMap
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
		<div style={{ paddingBottom: "40px" }}>
			<h2>Excel Joiner</h2>
			<br />
			{
				(curState === STATES.upload) ? (
					// hard coded page
					<div style={{ width: "fit-content" }}>
						<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
						<h3>Instructions:</h3>
						<p>
							Collect the excel tables you wish to join in one excel workbook.<br />
							Each table should be on its own worksheet and should start at A1.<br />
							This program assumes that the colum you wish to join on will be the A-Column of each sheet but you will get the choice to select which column to join on.<br />
							After uploading the file, you will be prompted to pick which column to join on, defaulting to the A column.
							Then you will be shown a table where you can select rows from each of the sheets and can join them.
							Finally, you can export the sheet by clicking on the export button at the top of the sheet.
						</p>
					</div>
				) :
					(curState === STATES.pick) ? (
						// basic page for selecting sheet
						<>
							<button type="button" onClick={() => (setCurState(STATES.table))}>Continue to picking tables</button>
							<br />
							<ExcelPicker sheets={sheets} sheetColMap={sheetColMap} setSheetColMap={setSheetColMap} />
						</>
					) :
						(curState === STATES.table) ? (
							//final page for selecting page
							<>
								<ExcelTable sheets={sheets} sheetColMap={sheetColMap} joinedRows={joinedRows} setJoinedRows={setJoinedRows} />
							</>
						) :
							//if you get here, something is wrong
							(<p>error, please refresh the page</p>)
			}
		</div>
	);
}

