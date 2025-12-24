import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const PersistSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Button size="sm">
        <Spinner />
        Loading...
      </Button>
    </div>
  );
};

export default PersistSpinner;
