import React, {useState} from 'react';
import * as XLSX from 'xlsx';
import ExcelPicker from './ExcelPicker';
import ExcelTable from './ExcelTable';

function Excel() {
	const [curState, setCurState] = useState("upload")
	const [sheets, setSheets] = useState(new Map());
	const [sheetColMap, setSheetColMap] = useState(new Map())


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
			reader.readAsBinaryString(file);
			setCurState("pick");
		} catch { };

	};

	return (
		<>
			{
			(curState === "upload")?(<input type="file" onChange={handleFileUpload} />):
			(curState === "pick")?(
			<>
				<ExcelPicker sheets={sheets} sheetColMap={sheetColMap} setSheetColMap={setSheetColMap} />
				<br/>
				<button type="button" onClick={()=>(setCurState("table"))}>Continue to picking tables</button>
			</>):
			(curState==="table")?(
			<>
				<ExcelTable sheets={sheets} sheetColMap={sheetColMap}/>
			</>):
			(<p>error</p>)
			}			
		</>
	);
}

export default Excel;
