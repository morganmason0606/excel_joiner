export default class Cell{
    constructor(content, sheetName, index){
        this.content = content;
        this.sheetName = sheetName;
        this.index = index; 
        this.selected=false
    }
}