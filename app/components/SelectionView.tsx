import { SolarPowerSystem } from "@prisma/client";
import selectionViewStyles from './SelectionView.css'

function SelectionView(){
    
    return(
        <div>
        </div>
    );
}
export default SelectionView;

export function links() {	
	return [{rel : 'stylesheet', href : selectionViewStyles}];
}