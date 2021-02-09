import { Element } from 'components/element'


export class Table extends Element {


    public async getRowsArrays(): Promise<string[][]> {
        const tableElement = await this.getElement()
        const rowsElements = await tableElement.$$('tr')
        const rowsArrays = await Promise.all(rowsElements.map(async rowElement =>
            await Promise.all((await rowElement.$$('td,th')).map(async rowData => await rowData.textContent()))
        ))
        return rowsArrays
    }

}
