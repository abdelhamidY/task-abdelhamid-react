import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

interface StyledPaperProps {
  $isOver: boolean;
  $borderColor: string;
}

export const StyledPaper = styled(Paper, {
  shouldForwardProp: prop =>
    !["$isOver", "$borderColor"].includes(prop as string),
})<StyledPaperProps>(({ theme, $isOver, $borderColor }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderTop: `4px solid ${$borderColor}`,
  backgroundColor: $isOver
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  transition: "background-color 0.2s ease",
  overflow: "hidden",
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

export const StyledHeaderStack = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

interface StyledCountBadgeProps {
  $color: string;
}

export const StyledCountBadge = styled(Box, {
  shouldForwardProp: prop => prop !== "$color",
})<StyledCountBadgeProps>(({ theme, $color }) => ({
  backgroundColor: $color,
  color: "white",
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.875rem",
  fontWeight: "bold",
}));

export const StyledAddButton = styled(Button)(() => ({
  borderStyle: "dashed",
  "&:hover": {
    borderStyle: "dashed",
  },
}));

export const StyledTasksList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1.5),
  },
}));

export const StyledLoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const StyledEmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

export const StyledScrollTrigger = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  textAlign: "center",
}));
