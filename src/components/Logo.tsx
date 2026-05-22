import React from 'react';
import { Origami } from 'lucide-react';

export const Logo: React.FC<React.ComponentProps<typeof Origami>> = (props) => {
  return <Origami {...props} />;
};
