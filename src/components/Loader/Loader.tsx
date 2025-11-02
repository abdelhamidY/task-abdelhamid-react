import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import { type LoaderProps } from "./types";

function Loader({
  error,
  isLoading,
  pastDelay,
  retry,
  timedOut,
  isSmall,
}: LoaderProps) {
  if (isLoading) {
    return (
      <Stack
        direction={"column"}
        justifyContent="center"
        alignItems="center"
        height={"90vh"}
      >
        <CircularProgress size={isSmall ? 20 : 100} color="inherit" />
      </Stack>
    );
  } else if (error) {
    return (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

export default Loader;
