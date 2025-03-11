
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const ActionButton = ({
  title,
  description,
  icon,
  color,
  onClick,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-6 w-full text-left relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "neon-glow",
        color
      )}
    >
      <div className="relative z-10 flex flex-col space-y-3">
        <div className="p-3 rounded-full bg-black/30 w-fit">
          <div className={`text-${color.replace('neon-', 'neon-')}`}>
            {icon}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
    </button>
  );
};

export default ActionButton;
