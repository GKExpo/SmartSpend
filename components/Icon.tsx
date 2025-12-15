import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.ComponentProps<typeof LucideIcons.Activity> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};