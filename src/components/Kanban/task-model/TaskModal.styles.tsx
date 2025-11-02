import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const StyledDialogPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontWeight: 'bold',
}));

export const StyledContentStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
