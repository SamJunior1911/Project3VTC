import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const PlaceOrderButton = ({ loading }) => {
  return (
    <Button
      type="submit"
      aria-label="Submit"
      className={cn(
        "justify-center w-full max-w-xl justify-center items-center cursor-pointer transition-all ease-in-out",
        loading && "opacity-70 pointer-events-none"
      )}
      disabled={loading}
    >
      <span className="flex items-center text-white text-lg">
        {loading ? "Processing..." : "Place order"}
      </span>
      {loading && (
        <span>
          <LoaderCircle
            role="status"
            aria-label="Loading"
            className={cn("size-6 text-white animate-spin ml-2")}
          />
        </span>
      )}
    </Button>
  );
};

export default PlaceOrderButton;
