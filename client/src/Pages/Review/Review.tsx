import MainTitle from "../../components/PublicCompontents/MainTitle";
import TextReview from "./TextReview";
import TextReviewForm from "./TextReviewForm";
import ReviewWithSelect from "./ReviewWithSelect";

const Review = () => {

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



