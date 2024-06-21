import filterViewStyles from './FilterView.css'

function DefaultValueView({setHeatingLoss, setHotWaterPercentage} : 
    {   
        setHeatingLoss: (loss : number)=>void,
        setHotWaterPercentage: (percentage : number)=>void,
    }
){
    function forwardValues(){
        if(document && document != null && document != undefined){
            setHeatingLoss(document.getElementById("heatingLossInput")?.value);
            setHotWaterPercentage(document.getElementById("hotWaterPercentageInput")?.value);
        }
        
    }

    return(
        <div>
            <div>
                <div>Heizungsverlust</div>
                <input type="text" id="heatingLossInput" className="btn btn-light" defaultValue="0.9"></input>
                <div>Warmwasser Anteil</div>
                <input type="text" id="hotWaterPercentageInput" className="btn btn-light" defaultValue="0.15"></input>
                <button className={"col btn btn-success"} onClick={forwardValues}>Update</button>
			</div>
        </div>
    );
}
export default DefaultValueView;

export function links() {	
	return [{rel : 'stylesheet', href : filterViewStyles}];
}