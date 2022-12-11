import { Alert, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';
import React, { PureComponent, PropsWithChildren } from 'react';

type StateType = {
  hasError: boolean;
  error: AxiosError<{ status: string; message: string }> | Error | null;
};

export default class ErrorBoundary extends PureComponent {
  public state: StateType;

  constructor(public props: PropsWithChildren) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, hasError: true });
  }

  handleClose() {
    this.setState({ hasError: false });
  }

  render() {
    return (
      <>
        {
          <Snackbar
            open={this.state.hasError}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={this.handleClose.bind(this)}
          >
            <Alert severity='error' sx={{ width: '100%' }}>
              {this.state.error instanceof AxiosError &&
                this.state.error.response!.data.message}
              {this.state.error instanceof Error && this.state.error.message}
            </Alert>
          </Snackbar>
        }
        {this.props.children}
      </>
    );
  }
}
