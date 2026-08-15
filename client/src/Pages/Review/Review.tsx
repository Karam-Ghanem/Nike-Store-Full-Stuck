import MainTitle from "../../components/PublicCompontents/MainTitle";
import TextReview from "./TextReview";
import TextReviewForm from "./TextReviewForm";
import ReviewWithSelect from "./ReviewWithSelect";
import { useEffect } from "react";
import useReviewStore from "./reviewStore";

const Review = () => {
  const loadReviews = useReviewStore((state) => state.loadReviews);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  return (
    <>
      <MainTitle title="CUSTOMER'S REVIEW" />
      <ReviewWithSelect/>
      <TextReviewForm />
      <TextReview  />
    </>
  );
};

export default Review;



