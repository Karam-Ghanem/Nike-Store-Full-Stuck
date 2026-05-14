import MainHead from "../../components/PublicCompontents/MainHead";
import TextReview from "./TextReview";
import TextReviewForm from "./TextReviewForm";
import ReviewWithSelect from "./ReviewWithSelect";

const Review = () => {

  return (
    <>
      <MainHead head="CUSTOMER'S REVIEW" />
      <ReviewWithSelect/>
      <TextReviewForm />
      <TextReview  />
    </>
  );
};

export default Review;



