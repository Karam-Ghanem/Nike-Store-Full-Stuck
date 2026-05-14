
import { type ReviewType } from "../Data/ReviewList";
import { useState, type ChangeEvent } from "react";
import useReviewStore from "@/Pages/Review/reviewStore";

const useTextReview = ()=>{

//TextReview Component
    const {reviews} = useReviewStore();
//TextReviewForm Component
  const { AddReview } = useReviewStore();

  const [selectedIDImg, setSelectedIDImage] = useState("");
  const [openForm,setOpenForm] = useState(false);
  const [selectedPersonalImg, setSelectedPersonalImage] = useState<
    string | undefined
  >(undefined);

  const [singleReview, setSingleReview] = useState<ReviewType>({
    name: "",
    img: "",
    description: "",
  });
  
  const HandleIDImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setSelectedIDImage(imageURL);
  };

  const HandlePersonalImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setSelectedPersonalImage(imageURL);

    setSingleReview({
      ...singleReview,
      img: imageURL,
    });
  };

    return {
        reviews,
        AddReview,
        selectedIDImg,
        setSelectedIDImage,
        openForm,
        setOpenForm,
        selectedPersonalImg,
        setSelectedPersonalImage,
        HandleIDImg,
        HandlePersonalImg,
        singleReview,
        setSingleReview

    }
}


export default useTextReview