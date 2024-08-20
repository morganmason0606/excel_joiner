import "./RowBox.css"
export default function RowBox({sheetName, name, ind}){
    return (
        <div key={`${sheetName}?${name}`} className="box" onClick={()=>console.log(sheetName,name,ind)}>
            {name}
        </div>
    )
}