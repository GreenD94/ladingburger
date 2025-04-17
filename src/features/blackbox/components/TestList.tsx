import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { TestItem } from '../types/index';

interface TestListProps {
  items: TestItem[];
  selectedTest: TestItem | null;
  onTestSelect: (test: TestItem) => void;
}

export const TestList: React.FC<TestListProps> = ({ items, selectedTest, onTestSelect }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Available Tests
      </Typography>
      <List>
        {items.map((test) => (
          <ListItem key={test.id} disablePadding>
            <ListItemButton
              selected={selectedTest?.id === test.id}
              onClick={() => onTestSelect(test)}
            >
              <ListItemText
                primary={test.name}
                secondary={test.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}; 