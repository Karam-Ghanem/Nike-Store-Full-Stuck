
import { useState } from "react";
import useReviewStore from "../reviewStore";
import { initialCheckBoxData,initialRadioData } from "../Data/Qustions";
import type {  CheckBoxItem , RadioItem} from "../Data/Qustions";
const useCheckRadioReview = ()=>{


    const [checkBoxState, setCheckBoxState] = useState<CheckBoxItem[]>(initialCheckBoxData);


  const [radioState, setRadioState] = useState<RadioItem[]>(initialRadioData);

  const { addCheckBoxEvalute, addRadioEvalute } = useReviewStore();

    return{
        checkBoxState,
        setCheckBoxState,
        radioState,
        setRadioState,
        addCheckBoxEvalute,
        addRadioEvalute
    }
}

export default useCheckRadioReview