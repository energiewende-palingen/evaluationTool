function getValidNumber(data : number | null) : number {
    if ( data == null || isNaN(data)){
        return 0;
    }
    return data;
}
export {getValidNumber};