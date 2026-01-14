'use client';

import React from 'react';
import { PADDING_TOP_LARGE, PADDING_BOTTOM_LARGE, PADDING_HORIZONTAL_MEDIUM } from '../constants/dimensions.constants';
import { TEXT_COLOR_DARK } from '../constants/colors.constants';
import { NO_PRODUCTS_AVAILABLE } from '../constants/messages.constants';

export const EmptyMenuState: React.FC = () => {
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
      <h6 style={{ color: TEXT_COLOR_DARK, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
        {NO_PRODUCTS_AVAILABLE}
      </h6>
    </div>
  );
};

