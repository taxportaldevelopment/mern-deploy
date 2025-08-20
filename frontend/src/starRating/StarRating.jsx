import { IoMdStar } from "react-icons/io";

const StarRating = ({ rating = 0, reviews }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center px-2 py-0.5 text-xs font-semibold bg-green-600 text-white rounded-md">
        {rating.toFixed(1)}
        <IoMdStar className="text-white text-sm ml-1" />
      </span>
      {reviews && (
        <span className="text-xs text-gray-500">{reviews} Reviews</span>
      )}
    </div>
  );
};

export default StarRating;
