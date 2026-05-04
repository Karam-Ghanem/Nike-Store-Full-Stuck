
import { useState } from "react";
import Stars from "@/Pages/Review/Data/StarsList";

const useStarsReview = ()=>{

    const [currentStars, setCurrentStars] = useState(Stars);
      const [hiddenBtn,setHiddenBtn] = useState(true);

    const FillStars = (id: number) => {
    const currStars = currentStars.map((star) =>
      star.id <= id
        ? { ...star, color: "#FFD700" }
        : { ...star, color: "white" }
    );
    setCurrentStars(currStars);
  };
  const ResetStars = () => {
    const currStars = currentStars.map((star) => ({
      ...star,
      color: "white",
    }));
    setCurrentStars(currStars);
  };


    return{
        FillStars,
        ResetStars,
        currentStars,
        hiddenBtn,
        setHiddenBtn,
        
    }
}

export default useStarsReview