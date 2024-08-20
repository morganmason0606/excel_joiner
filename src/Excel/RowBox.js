import "./RowBox.css"
export default function RowBox({sheetName, name, ind}){
    return (
        <td key={`${sheetName}?${name}`} className="box" onClick={()=>console.log(sheetName,name,ind)}>
            {name}
        </td>
    )
}