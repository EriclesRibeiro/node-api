export default function dateFormatted(data: Date){
    const dia  = data.getUTCDate().toString().padStart(2, '0');
    const mes  = (data.getUTCMonth()+1).toString().padStart(2, '0');
    const ano  = data.getUTCFullYear();

    const horas = data.getUTCHours().toString().padStart(2, '0');
    const minutos = data.getUTCMinutes().toString().padStart(2, '0');
    const segundos = data.getUTCSeconds().toString().padStart(2, '0');

    return dia+"/"+mes+"/"+ano+" "+horas+":"+minutos+":"+segundos;
}