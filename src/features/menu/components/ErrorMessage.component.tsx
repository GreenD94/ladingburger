'use client';

import React from 'react';
import { PADDING_TOP_LARGE, PADDING_BOTTOM_LARGE, PADDING_HORIZONTAL_MEDIUM } from '../constants/dimensions.constants';
import { ERROR_COLOR } from '../constants/colors.constants';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: PADDING_TOP_LARGE,
        paddingBottom: PADDING_BOTTOM_LARGE,
        paddingLeft: PADDING_HORIZONTAL_MEDIUM,
        paddingRight: PADDING_HORIZONTAL_MEDIUM,
      }}
    >
      <h6 style={{ color: ERROR_COLOR, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
        {message}
      </h6>
    </div>
  );
};

