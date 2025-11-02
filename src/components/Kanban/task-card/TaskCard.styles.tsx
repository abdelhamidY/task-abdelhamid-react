import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

interface StyledCardProps {
  $isDragging: boolean;
}

export const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== "$isDragging",
})<StyledCardProps>(({ theme, $isDragging }) => ({
  position: "relative",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow: theme.shadows[3],
    "& .action-buttons": {
      opacity: 1,
    },
  },
  backgroundColor: theme.palette.background.paper,
  border: $isDragging ? "2px dashed" : "none",
  borderColor: $isDragging ? theme.palette.primary.main : undefined,
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    "&:last-child": {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

export const StyledActionButtons = styled(Stack)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  opacity: 0,
  transition: "opacity 0.2s ease",

  [theme.breakpoints.down("sm")]: {
    opacity: 1,
  },
}));

export const StyledContentWrapper = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(6),

  [theme.breakpoints.down("sm")]: {
    paddingRight: theme.spacing(5),
  },
}));

export const StyledTitle = styled(Typography)(() => ({
  wordBreak: "break-word",
}));

export const StyledDescription = styled(Typography)(() => ({
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  wordBreak: "break-word",
}));

export const StyledHighlight = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  fontWeight: "bold",
}));
