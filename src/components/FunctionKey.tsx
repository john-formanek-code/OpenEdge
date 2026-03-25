'use client';

import React from 'react';
import Link from 'next/link';

interface FunctionKeyProps {
  item: {
    key: string;
    label: string;
    href: string;
    active: boolean;
    panelId?: string;
  };
}

export function FunctionKey({ item }: FunctionKeyProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // We store the panelId and label in the dataTransfer
    const dragData = {
      id: item.panelId || item.label.toUpperCase().replace(/\s/g, '_'),
      title: item.label,
    };
    e.dataTransfer.setData('application/openedge-panel', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Optional: set a drag image or cursor
  };

  return (
    <Link 
      href={item.href} 
      draggable
      onDragStart={handleDragStart}
      className={`function-key group cursor-grab active:cursor-grabbing ${item.active ? 'active' : ''}`}
    >
      <span className="keycode">{item.key}</span>
      <span className="hidden sm:inline group-hover:text-amber-400 transition-colors">
        {item.label}
      </span>
      {/* Visual indicator that it's draggable */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
