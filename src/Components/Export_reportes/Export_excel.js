import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { toast } from 'react-toastify';

const exportToExcel = (data, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    if(!data || !Array.isArray(data) || data.length===0)
        return toast.warn('No hay datos para generarle un Reporte de Clientes. Intente más tarde.')
    try {
        //console.log(data, fileName)
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new() //{Sheets: {'data' : ws}, sheetNames: ['data']};
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, {bookType:'xlsx', type:'array'});
        //console.log(wb, {bookType:'xlsx', type:'array'})
        const blob = new Blob([excelBuffer], {type:fileType});
        FileSaver.saveAs(blob, fileName + fileExtension);
    } catch (error) {
        toast.error('Hubo un error al generar el Reporte de Clientes. Intente más tarde.')
    }
}

export default exportToExcel;